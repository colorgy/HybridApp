import { createSelector } from 'reselect';

const appTabIndexSelector = state => ({ appTabIndex: state.appTab.appTabIndex });

export default appTabIndexSelector;
