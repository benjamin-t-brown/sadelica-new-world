/*
global
G_superfine_h
G_superfine_text
patch
load
*/

const styleObjToString = (style: { [key: string]: string }): string => {
  let ret: string[] = [];
  for (let i in style) {
    ret.push(`${i}:${style[i]}`);
  }
  return ret.join(';');
};

// Superfine compatibility with TypeScript
type SuperfineElement = {};
const G_superfine_patch = (parent: HTMLElement, vDom: SuperfineElement) => {
  patch(parent, vDom);
};

// TypeScript compiler changes all jsx to 'React.createElement' calls in *.tsx files
// when jsx is set to 'react'.  This can be leveraged as an alias for the Superfine 'h'
// and 'text' calls with some minor changes to the arguments.
/*eslint-disable-line no-unused-vars*/ const React = {
  createElement: function (type: string, props: any): SuperfineElement {
    let subChildren: any = [];

    const style = props?.style;
    if (style) {
      props.style = styleObjToString(style);
    }

    const children = Array.prototype.slice.call(arguments, 2);
    for (let i = 0; i < children.length; i++) {
      const child = children[i];
      if (typeof child === 'string') {
        subChildren.push(G_superfine_text(child));
      } else if ((child as SuperfineElement[])?.length !== undefined) {
        for (let j = 0; j < child.length; j++) {
          if (child[j]) {
            subChildren.push(child[j]);
          }
        }
      } else {
        if (!child.type) {
          throw new Error(
            'Invalid child provided to superfine: ' + JSON.stringify(child)
          );
        }
        subChildren.push(child);
      }
    }
    return G_superfine_h(type, props || {}, subChildren);
  },
};

load(); // load specified in in2.js
let model_in2Dialog = run(true); // run specified in in2.compiled.js
const G_in2_executeDialog = (dialogName: string) => {
  const key = dialogName + '.json';
  const cb = model_in2Dialog.files[key];
  if (cb) {
    cb();
  } else {
    console.error(`Cannot play in2 dialog, no key exists: '${dialogName}'`);
  }
};
