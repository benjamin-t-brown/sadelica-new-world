import React from 'react';
import { render } from 'react-dom';
import MainContainer from './cmpts/main-container';
import display from 'content/display';

async function loadPrimary() {
  console.log('load file list');
  console.time('load file list');
  const files = await display.getImageList();
  console.timeEnd('load file list');
  await display.loadImages(files);
  console.log('load txt');
  console.time('load txt');
  const txt = await display.loadTxt();
  console.timeEnd('load txt');
  console.time('load res');
  await display.loadRes(txt);
  console.timeEnd('load res');
}

async function init() {
  console.time('load');
  console.log('load placeholder');
  await display.loadPlaceholderImage();
  console.log('load init');
  console.time('load init');
  await display.init(null);
  console.timeEnd('load init');
  console.log('load primary');
  console.time('load primary');
  await loadPrimary();
  console.timeEnd('load primary');
  Array.prototype.forEach.call(
    document.querySelectorAll('.loading'),
    el => (el.style.display = 'none')
  );
  console.timeEnd('load');
}

const div = document.createElement('div');
document.body.append(div);
async function main() {
  await init();
  render(<MainContainer />, div);
}
main().catch(e => {
  console.error(e);
  throw e;
});
