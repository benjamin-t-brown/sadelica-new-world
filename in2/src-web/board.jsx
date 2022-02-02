import React, { createRef } from 'react';
import injectSheet from 'react-jss';
import expose from 'expose';
import utils from 'utils';
import context from 'context';
import dialog from 'dialog';
import css from 'css';
const $ = (window.$ = require('jquery'));
const jsPlumb = window.jsPlumb;

const BOARD_SIZE_PIXELS = 6400;

export const getNodeId = () => {
  let id;
  do {
    id = utils.random_id(9);
  } while (document.getElementById(id));
  return id;
};

const waitMs = ms => {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
};

window.on_node_click = function (elem) {
  console.log('Click Event Not Overwritten!', elem);
};

window.on_node_unclick = function (elem) {
  console.log('Un-click Event Not Overwritten!', elem);
};

window.on_node_dblclick = function (elem) {
  console.log('DBLClick Event Not Overwritten!', elem);
};

window.on_node_rclick = function (elem) {
  console.log('RClick Event Not Overwritten!', elem);
};

window.on_delete_click = function (elem) {
  console.log('DeleteClick Event Not Overwritten!', elem);
};

window.on_node_mouseover = function (elem) {
  console.log('MouseOver Event Not Overwritten!', elem);
};

window.on_node_mouseout = function (elem) {
  console.log('MouseOut Event Not Overwritten!', elem);
};

window.center_on_active_node = function (elem) {
  expose.get_state('board').centerOnNode(elem);
};

class Board extends expose.Component {
  constructor(props) {
    super(props);
    const state = {};

    this.diagramContainer = createRef();
    this.diagramParent = createRef();
    this.diagram = createRef();

    this.plumb = null;
    this.file = props.file;
    this.panning = false;
    this.offsetX = 0;
    this.offsetY = 0;
    this.lastMouseX = 0;
    this.lastMouseY = 0;
    this.lastOffsetX = 0;
    this.lastOffsetY = 0;
    this.linkNode = null;
    this.linkNodeRef = null;
    this.dragSet = [];
    this.zoom = 1;
    this.maxZoom = 1;
    this.minZoom = 0.2;
    this.isSelectBoxVisible = false;
    this.selectPos = [0, 0];

    this.onKeydown = ev => {
      if (this.linkNode && ev.keyCode === 27) {
        this.exitLinkMode();
      } else if (this.dragSet.length && ev.keyCode === 27) {
        this.dragSet = [];
        this.plumb.clearDragSelection();
      }

      if (!dialog.is_visible()) {
        if (String.fromCharCode(ev.which) === 'C' && !utils.is_ctrl()) {
          if (this.props.file) {
            expose.get_state('player-area').compile(this.props.file?.name);
          }
        } else if (String.fromCharCode(ev.which) === 'A' && !utils.is_ctrl()) {
          if (this.props.file) {
            expose.get_state('player-area').compile();
          }
        }
      }
    };

    this.onMouseDown = ev => {
      if (dialog.is_visible() || ev.which === 3) {
        return;
      }
      if (utils.is_ctrl()) {
        ev.preventDefault();
        this.isSelectBoxVisible = true;
        this.selectPos = [ev.clientX, ev.clientY];
        const div = document.createElement('div');
        div.id = 'select-box';
        div.style.position = 'fixed';
        div.style.left = ev.clientX;
        div.style.top = ev.clientY;
        div.style.border = '4px solid white';
        div.style['min-width'] = '4px';
        div.style['min-height'] = '4px';
        div.style['pointer-events'] = 'none';
        document.body.appendChild(div);
      } else {
        this.panning = true;
        this.lastOffsetX = this.offsetX;
        this.lastOffsetY = this.offsetY;
        this.lastMouseX = ev.clientX;
        this.lastMouseY = ev.clientY;
      }
    };

    this.onMouseMove = ev => {
      if (this.panning) {
        this.offsetX =
          this.lastOffsetX + (this.lastMouseX - ev.clientX) * (1 / this.zoom);
        this.offsetY =
          this.lastOffsetY + (this.lastMouseY - ev.clientY) * (1 / this.zoom);
        this.renderAtOffset();
      } else if (this.isSelectBoxVisible) {
        const div = document.getElementById('select-box');
        const [origX, origY] = this.selectPos;
        const { clientX, clientY } = ev;
        div.style.width = Math.abs(clientX - origX);
        div.style.height = Math.abs(clientY - origY);

        if (clientX < origX) {
          div.style.left = clientX;
        } else {
          div.style.left = origX;
        }
        if (clientY < origY) {
          div.style.top = clientY;
        } else {
          div.style.top = origY;
        }
      }
    };

    this.onMouseUp = () => {
      this.panning = false;
      const div = document.getElementById('select-box');
      const rectCollides = (rect1, rect2) => {
        const { x: r1x, y: r1y, width: r1w, height: r1h } = rect1;
        const { x: r2x, y: r2y, width: r2w, height: r2h } = rect2;
        if (
          r1x + r1w >= r2x &&
          r1x <= r2x + r2w &&
          r1y + r1h >= r2y &&
          r1y <= r2y + r2h
        ) {
          return true;
        }
        return false;
      };

      if (div) {
        this.dragSet = [];
        this.plumb.clearDragSelection();
        this.isSelectBoxVisible = false;
        const div = document.getElementById('select-box');
        const selectRect = div.getBoundingClientRect();
        for (let i in this.file.nodes) {
          const node = this.file.nodes[i];
          const item = document.getElementById(node.id);
          const rect = item.getBoundingClientRect();
          if (rectCollides(selectRect, rect)) {
            let ind = this.dragSet.indexOf(node.id);
            if (ind === -1) {
              this.plumb.addToDragSelection(node.id);
              this.dragSet.push(node.id);
            }
          }
        }
        this.isSelectBoxVisible = false;
        document.getElementById('select-box').remove();
        div.remove();
      }
    };

    this.onScroll = ev => {
      const { offsetX, offsetY, scale } = utils.zoomWithFocalAndDelta({
        parentElem: this.diagramContainer.current,
        deltaY: ev.deltaY,
        scale: this.zoom,
        areaWidth: BOARD_SIZE_PIXELS,
        areaHeight: BOARD_SIZE_PIXELS,
        offsetX: this.offsetX,
        offsetY: this.offsetY,
        focalX: ev.clientX,
        focalY: ev.clientY,
        maxZoom: this.maxZoom,
        minZoom: this.minZoom,
      });

      this.zoom = scale;
      this.offsetX = offsetX;
      this.offsetY = offsetY;

      this.renderAtOffset();
      this.getPlumb().setZoom(this.zoom);
    };

    this.onDiagramDblClick = () => {};

    this.onNodeClick = window.on_node_click = elem => {
      let selectedNode = this.getNode(elem.id);
      if (this.linkNode) {
        let err = this.addLink(this.linkNode, selectedNode);
        if (err) {
          console.error('Error', 'Cannot create link', err);
          dialog.show_notification('Cannot create link. ' + err);
        }
        this.exitLinkMode();
      } else if (this.linkNodeRef) {
        this.setNodeContent(
          this.linkNodeRef,
          `player.get('nodes.${selectedNode.id}')`
        );
        this.linkNodeRef.rel = selectedNode.id;
        this.buildDiagram();
        this.renderAtOffset();
        this.getPlumb().setZoom(this.zoom);
        this.exitLinkMode();
      } else if (utils.is_shift() || utils.is_ctrl()) {
        let ind = this.dragSet.indexOf(selectedNode.id);
        if (ind === -1) {
          this.plumb.addToDragSelection(selectedNode.id);
          this.dragSet.push(selectedNode.id);
        } else {
          this.plumb.removeFromDragSelection(selectedNode.id);
          this.dragSet.splice(ind, 1);
        }
      }
    };

    this.onNodeUnclick = window.on_node_unclick = elem => {
      let file_node = this.getNode(elem.id);
      //$('#diagram-parent').panzoom('enable');
      file_node.left = elem.style.left;
      file_node.top = elem.style.top;
      this.file.nodes.forEach(node_file => {
        let node = document.getElementById(node_file.id);
        node_file.left = node.style.left;
        node_file.top = node.style.top;
      });
      this.saveFile();
    };

    this.onNodeDblClick = window.on_node_dblclick = elem => {
      let file_node = this.getNode(elem.id);
      if (file_node.type === 'next_file') {
        dialog.show_input_with_select(
          expose.get_state('file-browser').file_list,
          file_node.content,
          content => {
            this.setNodeContent(file_node, content);
            this.buildDiagram();
            this.renderAtOffset();
            this.getPlumb().setZoom(this.zoom);
            this.saveFile();
          }
        );
      } else if (
        file_node.type === 'chunk' ||
        file_node.type === 'action' ||
        file_node.type === 'declaration' ||
        file_node.type === 'switch_conditional'
      ) {
        dialog.set_shift_req(true);
        dialog.show_input(
          file_node,
          content => {
            dialog.set_shift_req(false);
            this.setNodeContent(file_node, content);
            file_node.rel = null;
            this.buildDiagram();
            this.renderAtOffset();
            this.getPlumb().setZoom(this.zoom);
            this.saveFile();
          },
          () => {
            dialog.set_shift_req(false);
          }
        );
      } else if (file_node.type === 'text') {
        dialog.set_shift_req(true);
        dialog.showTextNodeInput({
          node: file_node,
          onConfirm: content => {
            this.setNodeContent(file_node, content);
            file_node.rel = null;
            this.buildDiagram();
            this.renderAtOffset();
            this.getPlumb().setZoom(this.zoom);
            this.saveFile();
          },
          onCancel: () => {
            dialog.set_shift_req(false);
          },
        });
      } else {
        dialog.set_shift_req(false);
        dialog.show_input(file_node, content => {
          this.setNodeContent(file_node, content);
          file_node.rel = null;
          this.buildDiagram();
          this.renderAtOffset();
          this.getPlumb().setZoom(this.zoom);
          this.saveFile();
        });
      }
    };

    this.onNodeRClick = window.on_node_rclick = elem => {
      context.show_context_menu(this, elem);
    };

    this.onNodeMouseOver = window.on_node_mouseover = elem => {
      // perf issue it think?
      // const node = this.getNode(elem.id);
      // expose.set_state('status-bar', {
      //   hoverText: `Double click to edit '${node.type}' node.`,
      // });
    };

    this.onNodeMouseOut = window.on_node_mouseout = () => {
      expose.set_state('status-bar', {
        hoverText: '',
      });
    };

    this.onConnRClick = (params, ev) => {
      let from_id = params.sourceId.split('_')[0];
      let to_id = params.targetId.split('_')[0];
      let from = this.getNode(from_id);
      let to = this.getNode(to_id);
      this.deleteLink(from, to);
      ev.preventDefault();
    };

    this.onDeleteClick = window.on_delete_click = elem => {
      dialog.show_confirm('Are you sure you wish to delete this node?', () => {
        this.deleteNode(this.getNode(elem.id));
        if (this.dragSet.includes(elem.id)) {
          this.dragSet.forEach(id => {
            if (id !== elem.id) {
              const node = this.getNode(id);
              if (node.type !== 'root') {
                this.deleteNode(node);
              }
            }
          });
          this.dragSet = [];
          this.plumb.clearDragSelection();
        }
      });
    };

    document.oncontextmenu = () => {
      if (this.disable_context) {
        this.disable_context = false;
        return false;
      } else {
        return true;
      }
    };

    this.connectLink = link => {
      let connection = this.plumb.connect({
        source: link.from + '_from',
        target: link.to + '_to',
        paintStyle: { stroke: 'rgba(255,255,255,0.2)', strokeWidth: 8 },
        endpointStyle: {
          fill: css.colors.PRIMARY,
          outlineStroke: css.colors.TEXT_LIGHT,
          outlineWidth: 5,
        },
        connector: [
          'Flowchart',
          {
            midpoint: 0.6,
            curviness: 30,
            cornerRadius: 2,
            stub: 0,
            alwaysRespectStubs: true,
          },
        ],
        endpoint: ['Dot', { radius: 2 }],
        overlays: [['Arrow', { location: 0.6, width: 20, length: 20 }]],
      });
      connection.bind('contextmenu', this.onConnRClick);
      connection.bind('mouseover', () => {
        expose.set_state('status-bar', {
          hoverText: 'Right click to delete this link.',
        });
      });
      connection.bind('mouseout', () => {
        expose.set_state('status-bar', {
          hoverText: '',
        });
      });
    };

    this.centerOnNode = async nodeId => {
      const n = this.getNode(nodeId);
      if (n) {
        if (expose.get_state('player-area').visible) {
          const area = document
            .getElementById('player-area')
            .getBoundingClientRect();
          const node = document.getElementById(nodeId).getBoundingClientRect();
          this.offsetX =
            parseInt(n.left) + node.width / 2 - (window.innerWidth - 300) / 2;
          this.offsetY =
            parseInt(n.top) -
            area.height / 2 -
            node.height / 2 +
            window.innerHeight / 4;
          //const lastZoom = this.zoom;
          this.zoom = 1;
          this.renderAtOffset();
          this.getPlumb().setZoom(this.zoom);
        } else {
          const nodeElem = document.getElementById(nodeId);
          const node = nodeElem.getBoundingClientRect();
          this.offsetX =
            parseInt(n.left) + node.width / 2 - (window.innerWidth - 300) / 2;
          this.offsetY =
            parseInt(n.top) + node.height / 2 - window.innerHeight / 2;
          this.zoom = 1;
          this.renderAtOffset();
          this.getPlumb().setZoom(this.zoom);

          for (let i = 0; i < 3; i++) {
            nodeElem.style.opacity = '0.25';
            await waitMs(250);
            nodeElem.style.opacity = '1';
            await waitMs(250);
          }
        }

        // TODO add this
        // const { offsetX, offsetY, scale } = utils.zoomWithFocalAndDelta({
        //   parentElem: this.diagramContainer.current,
        //   deltaY: ev.deltaY,
        //   scale: this.zoom,
        //   areaWidth: BOARD_SIZE_PIXELS,
        //   areaHeight: BOARD_SIZE_PIXELS,
        //   offsetX: this.offsetX,
        //   offsetY: this.offsetY,
        //   focalX: ev.clientX,
        //   focalY: ev.clientY,
        //   maxZoom: this.maxZoom,
        //   minZoom: this.minZoom,
        // });

        // this.zoom = scale;
        // this.offsetX = offsetX;
        // this.offsetY = offsetY;
      }
    };
    state.centerOnNode = this.centerOnNode;

    this.copySelection = () => {
      const node_mapping = {};
      const links = [];
      const nodes = this.dragSet.map(id => {
        const node = this.getNode(id);
        const new_node = Object.assign({}, node);
        new_node.id = getNodeId();
        node_mapping[node.id] = new_node.id;
        return new_node;
      });
      this.dragSet.forEach(id => {
        const children = this.getChildren(this.getNode(id));
        children.forEach(child => {
          if (this.dragSet.includes(child.id)) {
            links.push({
              from: node_mapping[id],
              to: node_mapping[child.id],
            });
          }
        });
      });
      this.copySet = { nodes, links };
    };
    state.copySelection = this.copySelection;

    this.pasteSelection = () => {
      if (this.copySet) {
        let rootInd = -1;

        const newLinks = JSON.parse(JSON.stringify(this.copySet.links));
        const newNodes = this.copySet.nodes.map((node, i) => {
          const newId = getNodeId();
          const newNode = Object.assign({}, node);
          newLinks.forEach(link => {
            if (link.to === node.id) {
              link.to = newId;
            }
            if (link.from === node.id) {
              link.from = newId;
            }
          });
          newNode.id = newId;
          newNode.left = parseInt(node.left) + 25 + 'px';
          newNode.top = parseInt(node.top) + 25 + 'px';
          if (newNode.type === 'root') {
            rootInd = i;
          }
          return newNode;
        });

        if (rootInd > -1) {
          const newRoot = newNodes.splice(rootInd, 1)[0];
          const oldRoot = this.file.nodes[0];
          oldRoot.content = newRoot.content;
          newLinks.forEach(link => {
            if (link.from === newRoot.id) {
              link.from = oldRoot.id;
            }
          });
        }

        newNodes.forEach(node => {
          this.file.nodes.push(node);
        });
        newLinks.forEach(link => {
          this.file.links.push(link);
        });
        this.dragSet = [];
        this.plumb.clearDragSelection();
        this.buildDiagram();
        this.renderAtOffset();
        this.getPlumb().setZoom(this.zoom);
        newNodes.forEach(node => {
          this.plumb.addToDragSelection(node.id);
          this.dragSet.push(node.id);
        });
        this.saveFile();
      }
    };
    state.pasteSelection = this.pasteSelection;

    //remove (item-error, item-active) from nodes
    this.removeAllExtraClasses = () => {
      $('.jtk-draggable')
        .removeClass('item-active')
        .removeClass('item-error')
        .css('outline', '');
    };
    state.removeAllExtraClasses = this.removeAllExtraClasses;

    state.addNode = (parent, type, defaultText) => {
      return this.addNode(parent, type, defaultText);
    };
    state.saveFile = () => {
      this.saveFile();
    };
    state.buildDiagram = () => {
      this.buildDiagram();
      this.renderAtOffset();
      this.getPlumb().setZoom(this.zoom);
    };

    utils.set_on_copy(() => {
      if (!dialog.is_visible()) {
        this.copySelection();
      }
    });
    utils.set_on_paste(() => {
      if (!dialog.is_visible()) {
        this.pasteSelection();
      }
    });

    this.state = state;
    this.expose('board');
  }

  UNSAFE_componentWillReceiveProps(props) {
    this.file = props.file;
  }

  componentDidMount() {
    jsPlumb.ready(() => {
      window.plumb = this.plumb = jsPlumb.getInstance({
        PaintStyle: { strokeWidth: 1 },
        Anchors: [['TopRight']],
        Container: this.diagram.current,
      });
      this.buildDiagram();
      this.renderAtOffset();
      this.getPlumb().setZoom(this.zoom);
    });
    window.addEventListener('mousemove', this.onMouseMove);
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('keydown', this.onKeydown);
    window.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('wheel', this.onScroll);
  }
  componentWillUnmount() {
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('keydown', this.onKeydown);
    window.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('wheel', this.onScroll);
    this.exitLinkMode();
  }
  componentDidUpdate() {
    this.offsetX = 0;
    this.offsetY = 0;
    this.zoom = 1;
    this.plumb.empty(this.diagram.current);
    jsPlumb.ready(() => {
      this.buildDiagram();
      this.renderAtOffset();
      this.getPlumb().setZoom(this.zoom);
    });
  }

  saveFile() {
    clearTimeout(this.savetimeout);
    this.savetimeout = setTimeout(() => {
      const file = this.file;
      if (file !== null) {
        utils.post('/file/' + file.name, file, () => {
          console.log('Successfully saved.');
        });
      }
    }, 500);
  }

  buildDiagram() {
    const file = this.file;
    if (file) {
      const html = file.nodes.reduce((prev, curr) => {
        return prev + this.getNodeHTML(curr);
      }, '');
      this.plumb && this.plumb.reset();
      // DONT MOVE THIS, IT FIXES THE DRAG OFFSET PROBLEMS
      window.plumb = this.plumb = jsPlumb.getInstance({
        PaintStyle: { strokeWidth: 1 },
        Anchors: [['TopRight']],
        Container: this.diagram.current,
      });
      const diagram = this.diagram.current;
      // diagram.innerHTML = '';
      diagram.innerHTML = html;
      setTimeout(() => {
        this.plumb.draggable(
          file.nodes.map(node => {
            return node.id;
          }),
          {
            containment: true,
          }
        );
        this.plumb.setSuspendDrawing(true);
        this.plumb.batch(() => {
          file.links.forEach(this.connectLink);
        });
        this.plumb.setSuspendDrawing(false, true);
      });
    }
  }

  getPlumb() {
    return this.plumb;
  }

  enterLinkMode(parent) {
    expose.set_state('status-bar', {
      isInLinkMode: true,
    });
    setTimeout(() => {
      this.linkNode = parent;
      this.diagramContainer.current.class =
        'no-drag linking ' + this.props.classes.diagramArea;
    }, 150);
  }
  enterLinkModeRef(parent) {
    expose.set_state('status-bar', {
      isInLinkMode: true,
    });
    setTimeout(() => {
      this.linkNodeRef = parent;
      this.diagramContainer.current.class =
        'no-drag linking ' + this.props.classes.diagramArea;
    }, 150);
  }
  exitLinkMode() {
    this.linkNode = false;
    this.linkNodeRef = false;
    this.diagramContainer.current.class =
      'no-drag movable ' + this.props.classes.diagramArea;
    expose.set_state('status-bar', {
      isInLinkMode: false,
    });
  }

  getNode(id) {
    if (this.file) {
      for (let i in this.file.nodes) {
        if (this.file.nodes[i].id === id) {
          return this.file.nodes[i];
        }
      }
      return null;
    } else {
      return null;
    }
  }

  setNodeContent(node, content) {
    node.content = content;
    document.getElementById(node.id).children[1].innerHTML = content;
    this.renderAtOffset();
    this.getPlumb().setZoom(this.zoom);
  }

  getChildren(node) {
    return this.file.links
      .filter(link => {
        return link.from === node.id;
      })
      .map(link => {
        return this.getNode(link.to);
      });
  }

  getParents(node) {
    return this.file.links
      .filter(link => {
        return link.to === node.id;
      })
      .map(link => {
        return this.getNode(link.from);
      });
  }

  getLinkIndex(from_id, to_id) {
    if (this.file) {
      for (let i in this.file.links) {
        if (
          this.file.links[i].from === from_id &&
          this.file.links[i].to === to_id
        ) {
          return i;
        }
      }
      return -1;
    } else {
      return -1;
    }
  }

  nodeHasChild(node) {
    if (this.file) {
      for (let i in this.file.links) {
        if (this.file.links[i].from === node.id) {
          return true;
        }
      }
      return false;
    } else {
      return false;
    }
  }

  nodeCanHaveChild(node) {
    if (node.type !== 'choice' && node.type !== 'switch') {
      if (this.nodeHasChild(node)) {
        return false;
      } else {
        return true;
      }
    }
    return true;
  }

  addLink(from, to) {
    let link = this.getLinkIndex(from.id, to.id);
    if (link !== -1) {
      return 'That specific link already exists.';
    }

    if (from.type === 'text' && this.nodeHasChild(from)) {
      return 'That text node already has a child.';
    }
    if (from.type === 'chunk' && this.nodeHasChild(from)) {
      return 'That chunk node already has a child.';
    }
    if (to.type === 'root') {
      return 'You cannot link to the root node.';
    }
    if (from.type === 'choice_conditional' && to.type !== 'choice_text') {
      return 'You can only link a Choice Conditional to a Choice Text.';
    }
    if (from.type === 'switch' && to.type !== 'switch_conditional') {
      return 'You can only link a Switch Conditional to a Switch node.';
    }
    if (
      (to.type === 'choice_text' || to.type === 'choice_conditional') &&
      this.getParents(to).length
    ) {
      if (this.getParents(to).length) {
        return 'You can only link to a Choice Text or Choice Conditional without a parent.';
      }
    }
    if (to.type === 'pass_text' || to.type === 'fail_text') {
      return 'You cannot link to Pass or Fail nodes.';
    }
    if (from.type === 'next_file') {
      return 'You cannot link from a Next File node.';
    }

    link = {
      from: from.id,
      to: to.id,
    };
    this.file.links.push(link);
    this.saveFile();
    this.buildDiagram();
    this.renderAtOffset();
    this.getPlumb().setZoom(this.zoom);
  }

  addNode(parent, type, defaultText) {
    let id = getNodeId();
    let parentElem = document.getElementById(parent.id);
    let rect = parentElem.getBoundingClientRect();
    let node = {
      id: id,
      type: type,
      content:
        defaultText === undefined
          ? 'This node currently has no actual content.'
          : defaultText,
      left: parent.left,
      top: parseInt(parent.top) + (rect.height + 30) + 'px',
    };
    this.file.nodes.push(node);
    let link = {
      to: id,
      from: parent.id,
    };
    this.file.links.push(link);
    this.saveFile();
    this.buildDiagram();
    this.renderAtOffset();
    this.getPlumb().setZoom(this.zoom);
    return node;
  }

  addSwitchNode(parent) {
    let node = this.addNode(parent, 'switch', 'switch');
    let id_default = getNodeId();
    let parent_elem = document.getElementById(parent.id);
    let rect = parent_elem.getBoundingClientRect();
    let node_default = {
      id: id_default,
      type: 'switch_default',
      content: 'default',
      left: parseInt(node.left),
      top: parseInt(parent.top) + (rect.height + 120) + 'px',
    };
    this.file.nodes.push(node_default);
    this.file.links.push({
      to: id_default,
      from: node.id,
    });
    this.saveFile();
    this.buildDiagram();
    this.renderAtOffset();
    this.getPlumb().setZoom(this.zoom);
    return node;
  }

  addPassFailNode(parent) {
    let node = this.addNode(
      parent,
      'pass_fail',
      'player.once() ? true : false'
    );
    let idPass = getNodeId();
    let idFail = getNodeId();
    let parentElem = document.getElementById(parent.id);
    let rect = parentElem.getBoundingClientRect();
    let nodePass = {
      id: idPass,
      type: 'pass_text',
      content: '',
      left: parseInt(node.left) - 115 + 'px',
      top: parseInt(parent.top) + (rect.height + 90) + 'px',
    };
    let nodeFail = {
      id: idFail,
      type: 'fail_text',
      content: '',
      left: parseInt(node.left) + 115 + 'px',
      top: parseInt(parent.top) + (rect.height + 90) + 'px',
    };
    this.file.nodes.push(nodePass, nodeFail);
    this.file.links.push({
      to: idPass,
      from: node.id,
    });
    this.file.links.push({
      to: idFail,
      from: node.id,
    });
    this.saveFile();
    this.buildDiagram();
    this.renderAtOffset();
    this.getPlumb().setZoom(this.zoom);
    return node;
  }

  deleteLink(from, to) {
    let ind = this.getLinkIndex(from.id, to.id);
    if (to.type === 'pass_text' || from.type === 'pass_fail') {
      return;
    }
    if (ind > -1) {
      dialog.show_confirm('Are you sure you wish to delete this link?', () => {
        this.file.links.splice(ind, 1);
        this.buildDiagram();
        setTimeout(() => {
          this.renderAtOffset();
          this.getPlumb().setZoom(this.zoom);
        });
      });
    } else {
      console.error(
        'ERROR',
        'no link exists that you just clicked on',
        from,
        to,
        this.file.links
      );
    }
  }

  deleteNode(node) {
    let _delete = node => {
      for (let i in this.file.nodes) {
        if (node === this.file.nodes[i]) {
          this.file.nodes.splice(i, 1);
          break;
        }
      }

      this.file.links = this.file.links.filter(link => {
        if (link.to === node.id || link.from === node.id) {
          return false;
        } else {
          return true;
        }
      });

      this.buildDiagram();
      this.renderAtOffset();
      this.getPlumb().setZoom(this.zoom);
    };

    if (node.type === 'pass_fail' || node.type === 'switch') {
      let children = this.getChildren(node);
      for (let i in children) {
        _delete(children[i]);
      }
      _delete(node);
    } else if (
      node.type === 'pass_text' ||
      node.type === 'fail_text' ||
      node.type === 'switch_default'
    ) {
      let parents = this.getParents(node);
      for (let i in parents) {
        this.deleteNode(parents[i]);
      }
    } else {
      _delete(node);
    }
    this.saveFile();
  }

  getNodeHTML(node) {
    let style = {
      left: node.left || null,
      top: node.top || null,
      width: node.width || null,
      height: node.height || null,
    };
    let style_str = '';
    for (let i in style) {
      if (style[i]) {
        style_str += `${i}:${style[i]}; `;
      }
    }
    let content_style = '';
    if (
      node.type === 'next_file' ||
      node.type === 'pass_fail' ||
      node.type === 'choice_conditional'
    ) {
      content_style = 'style="overflow:hidden;text-overflow:ellipsis"';
    }
    let className = 'item item-' + node.type;
    return (
      `<div class="node ${className}" ` +
      `style="${style_str}" id="${node.id}" ` +
      `onmousedown="on_node_click(${node.id})" ` +
      `onmouseup="on_node_unclick(${node.id})" ` +
      `ondblclick="on_node_dblclick(${node.id})" ` +
      `oncontextmenu="on_node_rclick(${node.id})" ` +
      `onmouseenter="on_node_mouseover(${node.id})" ` +
      `onmouseout="on_node_mouseout(${node.id})" ` +
      `>` +
      `<div class="node-id">${node.id}${
        node.rel
          ? ` -> <span class="node-id-ref" onclick="center_on_active_node('${node.rel}')">` +
            node.rel +
            '</span>'
          : ''
      }</div>` +
      `<div class="item-content" ${content_style}><span class="no-select">${node.content}</span></div>` +
      `<div class="anchor-to" id="${node.id}_to"></div>` +
      `<div class="anchor-from" id="${node.id}_from"></div>` +
      (node.type === 'root' ||
      node.type === 'pass_text' ||
      node.type === 'fail_text'
        ? ''
        : `<div onclick="on_delete_click(${node.id})" class="item-delete" id="${
            node.id
          }_delete" style="${
            node.type === 'choice' || node.type === 'switch' ? 'right:10' : ''
          }"><span class="no-select">X</span></div>`) +
      `</div>`
    );
  }

  renderAtOffset() {
    utils.renderAt({
      elem: this.diagramParent.current,
      scale: this.zoom,
      offsetX: this.offsetX,
      offsetY: this.offsetY,
    });
  }

  render() {
    const { classes } = this.props;
    return (
      <div
        id="diagram-area"
        className={'no-drag movable ' + classes.diagramArea}
        ref={this.diagramContainer}
        onMouseDown={ev => {
          ev.preventDefault();
        }}
        onDragStart={ev => {
          ev.preventDefault();
          return false;
        }}
        onDrop={ev => {
          ev.preventDefault();
          return false;
        }}
      >
        <div
          id="diagram-parent"
          ref={this.diagramParent}
          className={classes.diagramParent}
        >
          <div
            id="diagram"
            ref={this.diagram}
            className={'no-drag ' + classes.diagram}
          />
        </div>
      </div>
    );
  }
}

const styles = theme => ({
  diagramArea: {
    position: 'relative',
    width: BOARD_SIZE_PIXELS + 'px',
    height: BOARD_SIZE_PIXELS + 'px',
  },
  diagramParent: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    left: 0,
    top: 0,
  },
  diagram: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: theme.colors.BG,
  },
});

export default injectSheet(styles)(Board);
