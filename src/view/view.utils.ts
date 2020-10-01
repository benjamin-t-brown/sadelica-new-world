/*
global
G_model_createCanvas
G_view_drawSprite
*/

const G_VIEW_DIV = 'div';
const G_VIEW_INNER_HTML = 'innerHTML';
const G_VIEW_ONCLICK = 'onclick';
const cachedItemIconDataUrls = {};
const cachedPortraitIconDataUrls = {};

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
const G_view_cacheItemIconDataUrl = (spriteName: string): string => {
  let ret = cachedItemIconDataUrls[spriteName];
  if (!ret) {
    const [canvas, ctx] = G_model_createCanvas(32, 32);
    G_view_drawSprite(spriteName, 0, 0, 2, ctx);
    ret = canvas.toDataURL();
    cachedItemIconDataUrls[spriteName] = ret;
  }
  return ret;
};

const G_view_cachePortraitIconDataUrl = (
  spriteName: string,
  spriteSize?: number,
  scale?: number
): string => {
  scale = scale || 1;
  spriteSize = spriteSize || 16;
  let ret = cachedPortraitIconDataUrls[spriteName];
  if (!ret) {
    const [canvas, ctx] = G_model_createCanvas(
      spriteSize * scale,
      spriteSize * scale
    );
    G_view_drawSprite(spriteName, 0, 0, scale, ctx);
    ret = canvas.toDataURL();
    cachedPortraitIconDataUrls[spriteName] = ret;
  }
  return ret;
};
