import React from 'react';
import { Tabs, Tab, Styles } from 'material-ui';

let ThemeManager = new Styles.ThemeManager();
let { Colors } = Styles;

export default React.createClass({
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

  style: {
    position: 'fixed',
    left: 0,
    right: 0,
    bottom: 0,
    borderTop: 'solid 1px ' + Styles.Colors.grey300
  },

  tabs: [
    { route: 'about', text: 'About' },
    { route: 'license', text: 'License' }
  ],

  getTabs() {
    return this.tabs.map( (tab) => {
      let style = { color: Styles.Colors.grey900 };
      return (
        <Tab
          key={tab.route}
          label={tab.text}
          route={tab.route}
          style={style}
          onActive={this._onTabActive} />
      );
    });
  },

  getSelectedIndex() {
    let selectedIndex = 0;

    for (let tab of this.tabs) {
      if (tab.route && this.context.router.isActive(tab.route)) break;
      selectedIndex++;
    }

    return selectedIndex;
  },

  render() {
    let tabs = this.getTabs();
    let selectedIndex = this.getSelectedIndex();

    return (
      <div style={this.style}>
        <Tabs initialSelectedIndex={selectedIndex}>
          {tabs}
        </Tabs>
      </div>
    );
  },

  _onTabActive(tab){
    this.context.router.transitionTo(tab.props.route);
  }
});
