import React from 'react';
import { RaisedButton } from 'material-ui';
import { pageNavigateTo, pageNavigateBack } from '../../components/PageRouter';

export default React.createClass({
  render() {
    return (
      <div>
        <h1>Table Index</h1>
        <RaisedButton label="View a course" onTouchTap={() => pageNavigateTo('/courses/ntust-2342-6023')} />
        <RaisedButton label="View a user" onTouchTap={() => pageNavigateTo('/users/neson')} />
      </div>
    );
  }
});
