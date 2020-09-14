// declare namespace JSX {
//   type Element = string;
//   interface ElementChildrenAttribute {
//     children: any;
//   }
//   interface IntrinsicElements {
//     [element: string]: {
//       [property: string]: any;
//     };
//   }
// }

/*
global
G_superfine_h
G_superfine_text
patch
*/

const styleObjToString = (style: { [key: string]: string }): string => {
  let ret: string[] = [];
  for (let i in style) {
    ret.push(`${i}:${style[i]}`);
  }
  return ret.join(';');
};

type SuperfineElement = {};
const G_superfine_patch = (parent: HTMLElement, vDom: SuperfineElement) => {
  patch(parent, vDom);
};

/*eslint-disable-line no-unused-vars*/ const React = {
  createElement: function (
    type: string,
    props: any
    // ...children: any
  ): // children: string | SuperfineElement | SuperfineElement[]
  SuperfineElement {
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
          // subChildren = subChildren.concat(child);
        }
      } else {
        subChildren.push(child);
      }
    }
    return G_superfine_h(type, props || {}, subChildren);
  },
};
