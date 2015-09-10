import React from 'react';
import { RaisedButton } from 'material-ui';
import { pageNavigateTo, pageNavigateBack } from '../../components/PageRouter';

export default React.createClass({
  render() {
    return (
      <div>
        This is the {this.props.code} course!
        <RaisedButton label="Go to another course" onTouchTap={() => pageNavigateTo('/courses/ntust-2892-8225')} />
        <RaisedButton label="Go to a user" onTouchTap={() => pageNavigateTo('/users/neson')} />
        <RaisedButton label="Go Back" onTouchTap={() => pageNavigateBack()} />
      </div>
    );
  }
});
