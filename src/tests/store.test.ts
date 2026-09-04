import { describe, it, expect } from 'vitest';
import { Store } from '../store/index';

describe('App Store Reactive State', () => {
  it('initializes with default state', () => {
    const store = new Store({ count: 0, user: 'test' });
    expect(store.getState()).toEqual({ count: 0, user: 'test' });
  });

  it('updates state immutably', () => {
    const store = new Store({ count: 0 });
    store.setState({ count: 1 });
    expect(store.getState().count).toBe(1);
  });

  it('notifies subscribers on update', () => {
    const store = new Store({ activeTab: 'map' });
    let notifiedVal = '';
    const unsubscribe = store.subscribe((s) => {
      notifiedVal = s.activeTab;
    });
    store.setState({ activeTab: 'places' });
    expect(notifiedVal).toBe('places');
    unsubscribe();
    store.setState({ activeTab: 'routes' });
    expect(notifiedVal).toBe('places');
  });
});