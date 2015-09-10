import React from 'react';
import { connect } from 'react-redux';
import { pageRouterNavigate, pageRouterBack } from '../actions/pageRouterActions';

var Link = React.createClass({

  propTypes: {
    href: React.PropTypes.string.isRequired
  },

  handleClick() {
    if (this.props.href == 'back') {
      this.props.dispatch(pageRouterBack(this.props.appTabIndex));
    } else {
      this.props.dispatch(pageRouterNavigate(this.props.href));
    }
  },

  render: function() {
    return (
      <a href="#" style={this.props.style} onClick={this.handleClick}>{this.props.children}</a>
    );
  }
});

module.exports = connect(state => ({
  appTabIndex: state.appTab.appTabIndex
}))(Link);
