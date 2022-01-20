import { getUiInterface } from 'controller/ui-actions';
import { useEffect, useState } from 'preact/hooks';

let hooksInitialized = false;

export const initHooks = () => {
  if (hooksInitialized) {
    console.log('Hooks have already been initialized.');
    return;
  }
  hooksInitialized = true;

  let debounceResizeId: any;
  window.addEventListener('resize', () => {
    if (debounceResizeId !== false) {
      clearTimeout(debounceResizeId);
    }
    debounceResizeId = setTimeout(() => {
      getUiInterface().render();
      debounceResizeId = false;
    }, 50);
  });

  window.addEventListener('keydown', (ev: KeyboardEvent) => {
    const cb = inputEventStack[inputEventStack.length - 1];
    if (cb && !ev.repeat) {
      cb(ev);
    }
  });
};

export const useReRender = () => {
  const [render, setRender] = useState(false);
  return () => {
    setRender(!render);
  };
};

export type KeyboardEventHandler = (ev: KeyboardEvent) => void;
const inputEventStack: KeyboardEventHandler[] = [];

export const useKeyboardEventListener = (
  cb: KeyboardEventHandler,
  captures?: any[]
) => {
  useEffect(() => {
    const handleKeyDown = (ev: KeyboardEvent) => {
      if (!ev.repeat) {
        cb(ev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, captures);
};

export interface IUseConfirmModalArgs {
  onClose?: () => void;
  onConfirm?: () => void;
  body?: string;
  danger?: boolean;
}
