import React from 'react';
import { connect } from 'react-redux';
import appTabSelector from '../selectors/appTabSelector';
import { appTabChange } from '../actions/appTabActions.js';
import { Tabs, Tab, Styles } from 'material-ui';

let ThemeManager = new Styles.ThemeManager();
let { Colors } = Styles;

var AppTabs = React.createClass({
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
    return this.tabs.map( (tab, i) => {
      let style = { color: Styles.Colors.grey900 };
      return (
        <Tab
          key={tab.route}
          index={i}
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
    this.props.dispatch(appTabChange(tab.props.index));
  }
});

export default connect(appTabSelector)(AppTabs);
