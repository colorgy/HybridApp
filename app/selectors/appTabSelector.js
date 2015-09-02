import { createSelector } from 'reselect';

const appTabIndexSelector = state => ({ appTabIndex: ((state.appTab && state.appTab.appTabIndex) || 0) });

export default appTabIndexSelector;
