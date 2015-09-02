import React from 'react';
import { connect } from 'react-redux';
import { appPageNavigate, appPageBack } from '../actions/appPageActions';

var Link = React.createClass({

  propTypes: {
    href: React.PropTypes.string.isRequired
  },

  handleClick() {
    if (this.props.href == 'back') {
      this.props.dispatch(appPageBack(this.props.appTabIndex));
    } else {
      this.props.dispatch(appPageNavigate(this.props.href));
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
