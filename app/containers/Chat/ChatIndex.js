import React from 'react';
import { pageNavigateTo, pageNavigateBack } from '../../components/PageRouter';
import { RaisedButton } from 'material-ui';
import PageWithBar from '../../components/PageWithBar';

export default React.createClass({
  render() {
    return (
      <PageWithBar style={this.props.style}>
        <h1>Hello Chat</h1>
        <RaisedButton label="Go to a conversation" onTouchTap={() => pageNavigateTo('chat', '/conversations/3829')} />
        <RaisedButton label="Go to another conversation" onTouchTap={() => pageNavigateTo('chat', '/conversations/3893')} />
      </PageWithBar>
    );
  }
});
