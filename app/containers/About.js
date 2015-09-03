import React from 'react';
import PageWithBar from '../components/PageWithBar';

export default React.createClass({
  render() {
    return (
      <PageWithBar style={this.props.style}>
        <p>About us.</p>
      </PageWithBar>
    );
  }
});
