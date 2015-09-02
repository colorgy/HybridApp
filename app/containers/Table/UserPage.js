import React from 'react';
import { RaisedButton } from 'material-ui';
import { pageNavigateTo, pageNavigateBack } from '../../components/PageRouter';

export default React.createClass({
  render() {
    return (
      <div>
        Yo {this.props.username}!
        <RaisedButton label="Go to another user" onTouchTap={() => pageNavigateTo('/users/pk')} />
        <RaisedButton label="Go to a course" onTouchTap={() => pageNavigateTo('/courses/ntust-8289-2382')} />
        <RaisedButton label="Go Back" onTouchTap={() => pageNavigateBack()} />
      </div>
    );
  }
});
