import React from 'react';
import { connect } from 'react-redux';
import PageRouter, { Route } from '../components/PageRouter';
import ChatIndex from './Chat/ChatIndex';
import ChatConversation from './Chat/ChatConversation';

var Chat = React.createClass({

  render() {

    return (
      <PageRouter history={this.props.routerHistroy}>
        <Route path="/" handler={ChatIndex} />
        <Route path="/conversations/:cid" handler={ChatConversation} />
      </PageRouter>
    );
  }
});

export default connect(state => ({
  routerHistroy: state.pageRouter.chatHistory
}))(Chat);
