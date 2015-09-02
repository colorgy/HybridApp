import React from 'react';
import { pageNavigateTo, pageNavigateBack } from '../../components/PageRouter';
import { RaisedButton } from 'material-ui';

export default React.createClass({
  render() {
    return (
      <div>
        This is conversation {this.props.cid}!
        <RaisedButton label="Go Back" onTouchTap={() => pageNavigateBack()} />
      </div>
    );
  }
});
