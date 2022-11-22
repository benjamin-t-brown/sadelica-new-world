import { init as initActors } from './actors';
import { init as initMaps } from './map';
import { init as initItems } from './items';

export const init = () => {
  initActors();
  initMaps();
  initItems();
};
