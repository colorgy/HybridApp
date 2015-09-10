import React from 'react';
import { Tabs, Tab, Styles } from 'material-ui';
let { Spacing } = Styles;

let ThemeManager = new Styles.ThemeManager();
let { Colors } = Styles;

var getAppTabHeight = function () {
  return Spacing.desktopKeylineIncrement - 20 + 'px';
}

var AppTabTabButtons = React.createClass({

  contextTypes: {
    router: React.PropTypes.func
  },

  childContextTypes: {
    muiTheme: React.PropTypes.object,
  },

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    }
  },

  componentWillMount() {
    ThemeManager.setTheme(ThemeManager.types.DARK);
    ThemeManager.setPalette({
      primary1Color: Colors.grey100,
      accent1Color: Colors.deepOrangeA200
    });
  },

  render() {
    return (
      <Tabs initialSelectedIndex={0}>
        {this.props.children}
      </Tabs>
    );
  }
});

var AppTab = React.createClass({

  getDefaultProps() {
    return {
      onTabChange: null
    };
  },

  getInitialState() {
    return {
      currentTab: this.getTabs()[0].props.name
    };
  },

  componentWillMount() {
    if (this.props.onTabChange) this.props.onTabChange(this.state.currentTab);
  },

  getTabs() {
    window.t = this
    if (!Array.isArray(this.props.children)) {
      return [this.props.children];
    } else {
      return this.props.children;
    }
  },

  getTabStyle(tabName) {
    var display = 'none';
    if (this.state.currentTab == tabName) var display = 'block';

    return {
      display: display,
      height: '100%'
    }
  },

  getContent() {
    return this.getTabs().map( (tab) => {
      var Handler = tab.props.handler;
      return (
        <div key={tab.props.name} style={this.getTabStyle(tab.props.name)}>
          <Handler />
        </div>
      );
    });
  },

  getTabButtons() {
    return this.getTabs().map( (tab, i) => {
      let style = { color: Styles.Colors.grey900 };
      return (
        <Tab
          key={tab.props.name}
          index={i}
          label={tab.props.displayedName}
          style={style}
          onActive={this.handleTabButtonClick.bind(this, tab.props.name)} />
      );
    });
  },

  handleTabButtonClick(tabName) {
    this.setState({ currentTab: tabName }, () => {
      if (this.props.onTabChange) this.props.onTabChange(this.state.currentTab);
    });
  },

  render() {
    return (<div style={{ height: '100%' }}>
      {this.getContent()}

      <div style={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          borderTop: 'solid 1px ' + Styles.Colors.grey300
        }}>
        <AppTabTabButtons>
          {this.getTabButtons()}
        </AppTabTabButtons>
      </div>
    </div>);
  }
});

var AppTabTab = React.createClass({

  render() {
    return (<div>This should not be rendered!</div>);
  }
});

export default AppTab;
export { AppTabTab as Tab, getAppTabHeight };
