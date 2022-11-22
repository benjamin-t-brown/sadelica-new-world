import alinea from './map-alinea';

import TiledMap from 'tiled-types';

const exp: Record<string, TiledMap> = {};

export const getIfExists = (name: string) => {
  const def = exp[name];
  if (def) {
    return def;
  }
};

export const init = () => {
  exp.alinea = alinea as any;
};
