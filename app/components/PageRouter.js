import React from 'react';
import URLPattern from 'url-pattern';
import qs from 'qs';
import { pageRouterNavigate, pageRouterBack } from '../actions/pageRouterActions';
import store from '../store';

var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

var BlankComponent = React.createClass({ render() { return <div style={{ width: '100%', height: '100%' }}></div> } })

function matchRoutes(routes, path) {
  var queryObj, match, page, pageProps, notFound;

  if (!Array.isArray(routes)) {
    routes = [routes];
  }

  path = path.split('?');
  var pathToMatch = path[0];
  var queryString = path[1];
  if (queryString) {
    queryObj = qs.parse(queryString);
  }

  for (let i=0, len=routes.length; i<len; i++) {
    let route = routes[i];
    if (!route) continue;

    if (route.props.path) {
      var pattern = new URLPattern(route.props.path);
      if (!page) {
        match = pattern.match(pathToMatch);
        if (match) {
          page = route;
          pageProps = {
            ...queryObj,
            ...match
          }
        }
      }
    }

    if (!notFound && route.props.path === null) {
      notFound = route;
    }
  }

  var returnPage = page || notFound;

  if (!returnPage) {
    console.error(`PageRouter: Not Found: ${path}. (Add an <Route> without the "path" property to display a Not Found page.)`);
    returnPage = { props: { handler: BlankComponent } };
  }

  return {
    route: returnPage,
    pageProps: pageProps
  };
}

var PageRouter = React.createClass({

  getInitialState() {
    return {};
  },

  render() {
    var routes = this.props.children;
    var history = this.props.history;
    var pages = [];

    var CurrentPageHandler = null;
    var currentPath = (history && history[history.length - 1]) || '/';
    var routeMatch = matchRoutes(routes, currentPath);
    var currentRoute = routeMatch.route;
    var currentPageProps = routeMatch.pageProps;
    var CurrentPageHandler = currentRoute.props.handler;
    var CurrentPagePreloadPlaceholder = currentRoute.props.preloadPlaceholder;

    // Use the preload placehoder for faster reaction while rendering the first time
    if (!this.refs[btoa(currentPath)] && CurrentPagePreloadPlaceholder) {
      this.preloading = true;
      pages.push(<div className="PageRouter-PageContainer" ref="currentPageContainer" key={currentPath} path={currentPath} style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: '#fff' }}>
        <div ref={btoa(currentPath)} className={currentPath}></div>
        <CurrentPagePreloadPlaceholder ref="CurrentPagePreloadPlaceholder" {...currentPageProps} />
      </div>);

    } else {
      pages.push(<div className="PageRouter-PageContainer" ref="currentPageContainer" key={currentPath} path={currentPath} style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: '#fff' }}>
        <div ref={btoa(currentPath)} className={currentPath}></div>
        <CurrentPageHandler ref="currentPage" {...currentPageProps} />
      </div>);
    }

    if (history) {
      for (let i=history.length-2; i>history.length-4; i--) {
        var historyPath = history && history[i];
        if (!historyPath) continue;

        var historyRouteMatch = matchRoutes(routes, historyPath);
        var historyRoute = historyRouteMatch.route;
        var historyPageProps = historyRouteMatch.pageProps;
        var HistoryPageHandler = historyRoute.props.handler;

        pages.unshift(<div className="PageRouter-PageContainer" key={historyPath} path={historyPath} style={{ position: 'absolute', width: '100%', height: '100%', backgroundColor: '#fff' }}>
          <div ref={btoa(historyPath)} className={historyPath}></div>
          <HistoryPageHandler {...historyPageProps} />
        </div>);
      }
    }

    var transitionName = 'PageRouterTransitionFromRight';
    this.transitionTime = 312;

    return (
      <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
        <ReactCSSTransitionGroup transitionName={transitionName}>
          {pages}
        </ReactCSSTransitionGroup>
      </div>
    );
  },

  routeDidUpdate() {

    if (this.preloading) {
      this.preloading = false;
      setTimeout( () => this.setState({ update: new Date() }) , this.transitionTime || 1);
    }

    setTimeout( () => {
      let currentPage = this.refs.currentPage;

      if (currentPage) {
        if (typeof currentPage.componentWillBeVisibleOnPageRouter === 'function') currentPage.componentWillBeVisibleOnPageRouter();

        if (currentPage.refs && currentPage.refs.wrappedInstance && typeof currentPage.refs.wrappedInstance.componentWillBeVisibleOnPageRouter === 'function') currentPage.refs.wrappedInstance.componentWillBeVisibleOnPageRouter();
      }
    }, this.transitionTime || 1);
  },

  componentDidMount() {
    this.routeDidUpdate();
  },

  componentDidUpdate() {
    this.routeDidUpdate();
  }
});

var Route = React.createClass({

  render() {
    var Handler = this.props.handler;
    var handlerProps = this.pageProps || {};
    return (
      <Handler {...handlerProps}/>
    );
  }
});

var pageNavigateTo = function (key, path) {
  store.dispatch(pageRouterNavigate({ key: key, path: path }));
}

var pageNavigateBack = function (key, path) {
  store.dispatch(pageRouterBack({ key: key }));
}

export default PageRouter;
export { Route, pageNavigateTo, pageNavigateBack };
