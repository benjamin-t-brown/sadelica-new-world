const G_VIEW_DIV = 'div';
const G_VIEW_INNER_HTML = 'innerHTML';
const G_VIEW_ONCLICK = 'onclick';

const G_view_appendChild = (parent: HTMLElement, child: HTMLElement) => {
  parent.appendChild(child);
};
const G_view_setClassName = (elem: HTMLElement, className: string) => {
  elem.className = className;
};
const G_view_getElementById = (id: string): HTMLElement | null =>
  document.getElementById(id);
const G_view_createElement = (
  name: string,
  innerHTML?: string,
  style?: { [key: string]: string }
): HTMLElement => {
  const elem = document.createElement(name);
  if (innerHTML) {
    elem[G_VIEW_INNER_HTML] = innerHTML;
  }
  if (style) {
    G_view_setStyle(elem, style);
  }
  return elem;
};
const G_view_setStyle = (
  elem: HTMLElement,
  style: { [key: string]: string | undefined }
) => {
  for (let i in style) {
    elem.style[i] = style[i];
  }
};
