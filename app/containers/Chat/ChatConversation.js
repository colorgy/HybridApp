import React from 'react';
import { pageNavigateTo, pageNavigateBack } from '../../components/PageRouter';
import { RaisedButton } from 'material-ui';
import PageWithBar from '../../components/PageWithBar';

export default React.createClass({
  render() {
    return (
      <PageWithBar hasBack style={this.props.style} title={this.props.cid}>
        This is conversation {this.props.cid}!
        <RaisedButton label="Go Back" onTouchTap={() => pageNavigateBack()} />
      </PageWithBar>
    );
  }
});
