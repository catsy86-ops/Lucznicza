import type { AppDataModel } from '../types';
import { PLACES } from './places';
import { ROUTES } from './routes';
import { EVENTS } from './events';

export const APP_CENTER: [number, number] = [14.5546,53.4559];

export const APP_DATA: AppDataModel = {
  center: APP_CENTER,
  places: PLACES,
  routes: ROUTES,
  events: EVENTS
};

export { PLACES } from './places';
export { ROUTES } from './routes';
export { EVENTS } from './events';
