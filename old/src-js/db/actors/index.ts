import { ActorDefinition } from 'model/actor';

import { init as initGeneral } from './general';
import { init as initAlinea } from './alinea';

const exp: Record<string, ActorDefinition> = {};

export const getIfExists = (name: string) => {
  const def = exp[name];
  if (def) {
    return def;
  }
};

export const init = () => {
  initGeneral(exp);
  initAlinea(exp);

  for (const i in exp) {
    exp[i].templateName = i;
  }
};
