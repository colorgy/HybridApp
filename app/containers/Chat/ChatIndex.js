import React from 'react';
import { pageNavigateTo, pageNavigateBack } from '../../components/PageRouter';
import { RaisedButton } from 'material-ui';

export default React.createClass({
  render() {
    return (
      <div>
        <h1>Hello Chat</h1>
        <RaisedButton label="Go to a conversation" onTouchTap={() => pageNavigateTo('/conversations/3829')} />
        <RaisedButton label="Go to another conversation" onTouchTap={() => pageNavigateTo('/conversations/3893')} />
      </div>
    );
  }
});
