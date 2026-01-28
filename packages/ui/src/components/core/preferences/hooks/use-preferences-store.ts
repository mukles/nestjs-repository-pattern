import { useContext } from 'react';
import { PreferencesStoreContext } from '../store';

export const usePreferencesStore = () => {
  const store = useContext(PreferencesStoreContext);
  if (!store) throw new Error('Missing PreferencesStoreProvider');

  return store;
};
