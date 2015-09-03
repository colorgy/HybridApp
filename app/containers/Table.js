import React from 'react';
import { connect } from 'react-redux';
import { RaisedButton } from 'material-ui';
import PageRouter, { Route } from '../components/PageRouter';
import Page from '../components/Page';
import TablePage from './Table/TablePage';
import CoursePage from './Table/CoursePage';
import UserPage from './Table/UserPage';
import Link from '../components/Link';

var Table = React.createClass({
  render() {
    return (
      <PageRouter currentPath={this.props.pageCurrentPath} previousPath={this.props.pagePreviousPath}>
        <Route path="/" handler={TablePage} />
        <Route path="/courses/:code" handler={CoursePage} />
        <Route path="/users/:username" handler={UserPage} />
      </PageRouter>
    );
  }
});

export default connect(state => ({
  pageHistory: state.appPage.history[state.appTab.appTabIndex],
  pageCurrentPath: state.appPage.currentPath,
  pagePreviousPath: state.appPage.previousPath
}))(Table);
