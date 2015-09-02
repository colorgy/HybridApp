import React from 'react';
import URLPattern from 'url-pattern';
import qs from 'qs';
import { appPageNavigate, appPageBack } from '../actions/appPageActions';
import store from '../store';

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
    returnPage = { props: { handler: React.createClass({ render() { return <div></div> } }) } };
  }

  return {
    page: returnPage,
    pageProps: pageProps
  };
}

var PageRouter = React.createClass({

  render() {
    var routes = this.props.children;

    var currentPage = null;
    var currentPageProps = {};
    var CurrentPageHandler = null;
    var currentPath = this.props.currentPath || '/';
    if (currentPath) {
      let match = matchRoutes(routes, currentPath);
      currentPage = match.page;
      currentPageProps = match.pageProps;
      window.currentPage = currentPage;
      CurrentPageHandler = currentPage.props.handler;
    }

    var hasPreviousPath = false;
    var previousPage = null;
    var previousPageProps = {};
    var PreviousPageHandler = null;
    if (this.props.previousPath) {
      hasPreviousPath = true;
      let match = matchRoutes(routes, this.props.previousPath);
      previousPage = match.page;
      previousPageProps = match.pageProps;
      PreviousPageHandler = previousPage.props.handler;
    }

    var currentContent =
      <div>Page Not Found: {currentPath}.</div>
    if (CurrentPageHandler) {
      currentContent = <CurrentPageHandler {...currentPageProps} />
    }

    return (
      <div>
        {currentContent}
      </div>
    );
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

var pageNavigateTo = function (path) {
  store.dispatch(appPageNavigate(path));
}

var pageNavigateBack = function (path) {
  store.dispatch(appPageBack());
}

export default PageRouter;
export { Route, pageNavigateTo, pageNavigateBack };
