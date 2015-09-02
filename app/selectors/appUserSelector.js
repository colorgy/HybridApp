import { createSelector } from 'reselect';

const appUserSelector = state => ({
  ...state.appUser
});

export default appUserSelector;
