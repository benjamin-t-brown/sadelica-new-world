import { setNow } from 'model/generics';

export type RenderFunction = () => void;

const renderFunctions: { id: string; cb: RenderFunction }[] = [];

export const addRenderFunction = (id: string, rf: RenderFunction) => {
  if (!renderFunctions.find(obj => obj.id === id)) {
    renderFunctions.push({
      id,
      cb: rf,
    });
  }
};

export const removeRenderFunction = (id: string) => {
  const index = renderFunctions.findIndex(obj => obj.id === id);
  if (index > -1) {
    renderFunctions.splice(index, 1);
  }
};

let mainLoopRunning = false;
export const runMainLoop = () => {
  if (mainLoopRunning) {
    console.log('Main loop is already running.');
    return;
  }
  const reLoop = () => (window as any).running && requestAnimationFrame(loop);

  mainLoopRunning = true;
  const startTime = performance.now();
  // const sixtyFpsMs = 16;

  const loop = (now: number) => {
    setNow(now);

    for (let i = 0; i < renderFunctions.length; i++) {
      const { cb } = renderFunctions[i];
      cb();
    }

    reLoop();
  };
  loop(startTime);
};
