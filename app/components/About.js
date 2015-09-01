import React from 'react';
import PageWithNav from './PageWithNav';

export default React.createClass({
  render() {
    return (
      <PageWithNav style={this.props.style}>
        <p>About us.</p>
      </PageWithNav>
    );
  }
});
