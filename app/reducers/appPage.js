import { handleActions } from 'redux-actions';

export default handleActions({
  APP_PAGE_NAVIGATE: (state, action) => {
    var history = state.history;
    var currentPath = action.payload;
    var currentAppTabIndex = state.currentAppTabIndex;
    if (!history) history = {};
    if (!history[currentAppTabIndex]) history[currentAppTabIndex] = [];
    var previousPath = history[currentAppTabIndex][history[currentAppTabIndex].length - 1];
    history[currentAppTabIndex].push(currentPath);

    // if (window && window.history) {
    //   window.ignorepopstate = true;
    //   window.history.pushState({ appTabIndex: currentAppTabIndex, path: currentPath }, 'page');
    //   setTimeout( () => window.ignorepopstate = false, 100 );
    // }

    return {
      ...state,
      history: history,
      currentPath: currentPath,
      previousPath: previousPath
    };
  },

  APP_PAGE_BACK: (state, action) => {
    var history = state.history;
    if (!history) history = {};
    var currentAppTabIndex = state.currentAppTabIndex;
    if (!history[currentAppTabIndex]) history[currentAppTabIndex] = [];
    history[currentAppTabIndex].pop();

    var currentPath = history[currentAppTabIndex][history[currentAppTabIndex].length - 1];
    var previousPath = history[currentAppTabIndex][history[currentAppTabIndex].length - 2];

    if (!action.payload) {
      // if (window && window.history) {
      //   window.ignorepopstate = true;
      //   window.history.go(-1);
      //   setTimeout( () => window.ignorepopstate = false, 100 );
      // }
    }

    return {
      ...state,
      history: history,
      currentPath: currentPath,
      previousPath: previousPath
    };
  },

  APP_TAB_CHANGE: (state, action) => {
    var history = state.history;
    if (!history) history = {};
    var currentAppTabIndex = action.payload;
    var previousAppTabIndex = state.currentAppTabIndex;
    if (!history[currentAppTabIndex]) history[currentAppTabIndex] = [];
    if (!history[previousAppTabIndex]) history[previousAppTabIndex] = [];

    var currentPath = history[currentAppTabIndex][history[currentAppTabIndex].length - 1];
    var previousPath = history[currentAppTabIndex][history[currentAppTabIndex].length - 2];

    // if (window && window.history) {
    //   window.ignorepopstate = true;
    //   let backHistory = history[previousAppTabIndex].length * -1;
    //   history[currentAppTabIndex].reverse().forEach( (historyPath) => {
    //     window.history.pushState({ appTabIndex: currentAppTabIndex, path: historyPath }, 'page');
    //   });
    //   if (backHistory < 0) window.history.go(backHistory);
    //   window.history.replaceState({ appTabIndex: currentAppTabIndex, path: currentPath }, 'page');
    //   setTimeout( () => window.ignorepopstate = false, 100 );
    // }

    return {
      ...state,
      currentAppTabIndex: currentAppTabIndex,
      previousAppTabIndex: previousAppTabIndex,
      currentPath: currentPath,
      previousPath: previousPath
    };
  }
}, { history: {}, currentAppTabIndex: 0 });
