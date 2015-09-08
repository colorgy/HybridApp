const isBrowser = typeof window !== 'undefined';

import React from 'react';

import { Utils, Mixins, Styles, Overlay, Paper, Menu } from 'material-ui';

let { KeyCode } = Utils;
let { StylePropable, WindowListenable } = Mixins;
let { AutoPrefix, Transitions } = Styles;

let openNavEventHandler = null;


let LeftNav = React.createClass({

  mixins: [StylePropable, WindowListenable],

  contextTypes: {
    muiTheme: React.PropTypes.object,
  },

  propTypes: {
    className: React.PropTypes.string,
    disableSwipeToOpen: React.PropTypes.bool,
    docked: React.PropTypes.bool,
    header: React.PropTypes.element,
    menuItems: React.PropTypes.array.isRequired,
    onChange: React.PropTypes.func,
    onNavOpen: React.PropTypes.func,
    onNavClose: React.PropTypes.func,
    openRight: React.PropTypes.bool,
    selectedIndex: React.PropTypes.number,
    menuItemClassName: React.PropTypes.string,
    menuItemClassNameSubheader: React.PropTypes.string,
    menuItemClassNameLink: React.PropTypes.string,
  },

  windowListeners: {
    'keyup': '_onWindowKeyUp',
    'resize': '_onWindowResize',
  },

  getDefaultProps() {
    return {
      disableSwipeToOpen: false,
      docked: true,
    };
  },

  getInitialState() {
    this._maybeSwiping = false;
    this._touchStartX = null;
    this._touchStartY = null;
    this._swipeStartX = null;

    return {
      open: this.props.docked,
      swiping: null,
    };
  },

  componentDidMount() {
    this._updateMenuHeight();
    this._enableSwipeHandling();
  },

  componentDidUpdate() {
    this._updateMenuHeight();
    this._enableSwipeHandling();
  },

  componentWillUnmount() {
    this._disableSwipeHandling();
  },

  toggle() {
    this.setState({ open: !this.state.open });
    return this;
  },

  close() {
    this.setState({ open: false });
    if (this.props.onNavClose) this.props.onNavClose();
    return this;
  },

  open() {
    this.setState({ open: true });
    if (this.props.onNavOpen) this.props.onNavOpen();
    return this;
  },

  getThemePalette() {
    return this.context.muiTheme.palette;
  },

  getTheme() {
    return this.context.muiTheme.component.leftNav;
  },

  getStyles() {
    let x = this._getTranslateMultiplier() * (this.state.open ? 0 : this._getMaxTranslateX());
    let touchTriggerWidth = 24;
    if (this.props.disableOpenTouchTrigger) touchTriggerWidth = 0;
    let styles = {
      root: {
        height: '100%',
        width: this.getTheme().width,
        position: 'fixed',
        zIndex: 10,
        left: 0,
        top: 0,
        transform: 'translate3d(' + x + 'px, 0, 0)',
        transition: !this.state.swiping && Transitions.easeOut(),
        backgroundColor: this.getTheme().color,
        overflow: 'hidden',
      },
      menu: {
        overflowY: 'auto',
        overflowX: 'hidden',
        height: '100%',
        borderRadius: '0',
      },
      menuItem: {
        height: this.context.muiTheme.spacing.desktopLeftNavMenuItemHeight,
        lineHeight: this.context.muiTheme.spacing.desktopLeftNavMenuItemHeight + 'px',
      },
      rootWhenOpenRight: {
        left: 'auto',
        right: 0,
      },
      touchTrigger: {
        zIndex: 99999,
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: (this.state.open ? 'auto' : 0),
        right: (this.state.open ? 0 : 'auto'),
        width: (this.state.open ? `calc(100% - ${this.getTheme().width}px)` : touchTriggerWidth)
      }
    };

    styles.menuItemLink = this.mergeAndPrefix(styles.menuItem, {
      display: 'block',
      textDecoration: 'none',
      color: this.getThemePalette().textColor,
    });
    styles.menuItemSubheader = this.mergeAndPrefix(styles.menuItem, {
      overflow: 'hidden',
    });

    return styles;
  },

  render() {
    let selectedIndex = this.props.selectedIndex;
    let overlay;

    let styles = this.getStyles();
    if (!this.props.docked) {
      overlay = (
        <Overlay
          ref="overlay"
          show={this.state.open || !!this.state.swiping}
          transitionEnabled={!this.state.swiping}
          onTouchTap={this._onOverlayTouchTap}
        />
      );
    }

    return (
      <div className={this.props.className} ref="container">
        <div ref="touchTrigger" className="trigger touch-trigger" style={this.mergeAndPrefix(styles.touchTrigger)} onTouchTap={this._onOverlayTouchTap}>
        </div>
        {overlay}
        <Paper
          ref="clickAwayableElement"
          zDepth={2}
          rounded={false}
          transitionEnabled={!this.state.swiping}
          style={this.mergeAndPrefix(
            styles.root,
            this.props.openRight && styles.rootWhenOpenRight,
            this.props.style)}>
            {this.props.header}
            <Menu
              ref="menuItems"
              style={this.mergeAndPrefix(styles.menu)}
              zDepth={0}
              menuItems={this.props.menuItems}
              menuItemStyle={this.mergeAndPrefix(styles.menuItem)}
              menuItemStyleLink={this.mergeAndPrefix(styles.menuItemLink)}
              menuItemStyleSubheader={this.mergeAndPrefix(styles.menuItemSubheader)}
              menuItemClassName={this.props.menuItemClassName}
              menuItemClassNameSubheader={this.props.menuItemClassNameSubheader}
              menuItemClassNameLink={this.props.menuItemClassNameLink}
              selectedIndex={selectedIndex}
              onItemTap={this._onMenuItemClick} />
        </Paper>
      </div>
    );
  },

  _updateMenuHeight() {
    if (this.props.header) {
      let container = React.findDOMNode(this.refs.clickAwayableElement);
      let menu = React.findDOMNode(this.refs.menuItems);
      let menuHeight = container.clientHeight - menu.offsetTop;
      menu.style.height = menuHeight + 'px';
    }
  },

  _onMenuItemClick(e, key, payload) {
    if (this.props.onChange && this.props.selectedIndex !== key) {
      this.props.onChange(e, key, payload);
    }
    if (!this.props.docked) this.close();
  },

  _onOverlayTouchTap() {
    this.close();
  },

  _onWindowKeyUp(e) {
    if (e.keyCode === KeyCode.ESC &&
        !this.props.docked &&
        this.state.open) {
      this.close();
    }
  },

  _onWindowResize() {
    this._updateMenuHeight();
  },

  _getMaxTranslateX() {
    return this.getTheme().width + 10;
  },

  _getTranslateMultiplier() {
    return this.props.openRight ? 1 : -1;
  },

  _enableSwipeHandling() {
    if (!this.props.docked) {
      React.findDOMNode(this.refs.container).addEventListener('touchstart', this._onTouchTriggerTouchStart);
      if (!openNavEventHandler) {
        openNavEventHandler = this._onTouchTriggerTouchStart;
      }
    } else {
      this._disableSwipeHandling();
    }
  },

  _disableSwipeHandling() {
    document.body.removeEventListener('touchstart', this._onTouchTriggerTouchStart);
    if (openNavEventHandler === this._onTouchTriggerTouchStart) {
      openNavEventHandler = null;
    }
  },

  _onTouchTriggerTouchStart(e) {
    if (!this.state.open &&
         (openNavEventHandler !== this._onTouchTriggerTouchStart ||
          this.props.disableSwipeToOpen)
       ) {
      return;
    }

    let touchStartX = e.touches[0].pageX;
    let touchStartY = e.touches[0].pageY;

    this._maybeSwiping = true;
    this._touchStartX = touchStartX;
    this._touchStartY = touchStartY;

    React.findDOMNode(this.refs.container).addEventListener('touchmove', this._onTriggerTouchMove);
    React.findDOMNode(this.refs.container).addEventListener('touchend', this._onTriggerTouchEnd);
    React.findDOMNode(this.refs.container).addEventListener('touchcancel', this._onTriggerTouchEnd);
  },

  _setPosition(translateX) {
    let leftNav = React.findDOMNode(this.refs.clickAwayableElement);
    leftNav.style[AutoPrefix.single('transform')] =
      'translate3d(' + (this._getTranslateMultiplier() * translateX) + 'px, 0, 0)';
    this.refs.overlay.setOpacity(1 - translateX / this._getMaxTranslateX());
  },

  _getTranslateX(currentX) {
    return Math.min(
             Math.max(
               this.state.swiping === 'closing' ?
                 this._getTranslateMultiplier() * (currentX - this._swipeStartX) :
                 this._getMaxTranslateX() - this._getTranslateMultiplier() * (this._swipeStartX - currentX),
               0
             ),
             this._getMaxTranslateX()
           );
  },

  _onTriggerTouchMove(e) {
    let currentX = e.touches[0].pageX;
    let currentY = e.touches[0].pageY;

    let dXAbs = Math.abs(currentX - this._touchStartX);

    if (this.swipeDXAbs1) {
      let dt = (new Date()) - this.swipeT1
      this.swipeDXAbsT = (dXAbs - this.swipeDXAbs1) / dt;
      console.log(this.swipeDXAbsT)
    } else {
      this.swipeDXAbsT = 0;
    }
    this.swipeDXAbs1 = dXAbs;
    this.swipeT1 = (new Date());

    if (this.state.swiping) {
      e.preventDefault();
      this._setPosition(this._getTranslateX(currentX));
    }
    else if (this._maybeSwiping) {
      let dYAbs = Math.abs(currentY - this._touchStartY);
      // If the user has moved his thumb 4 pixels in either direction,
      // we can safely make an assumption about whether he was intending
      // to swipe or scroll.
      let threshold = 2;

      if (dXAbs > threshold && dYAbs <= threshold * 16) {
        this._swipeStartX = currentX;
        this.setState({
          swiping: this.state.open ? 'closing' : 'opening',
        });
        this._setPosition(this._getTranslateX(currentX));
      }
      else if (dXAbs <= threshold && dYAbs > threshold * 16) {
        this._onTriggerTouchEnd();
      }
    }
  },

  _onTriggerTouchEnd(e) {
    this.swipeDXAbs1 = null;
    this.swipeT1 = null;

    if (this.state.swiping) {
      let currentX = e.changedTouches[0].pageX;
      let translateRatio = this._getTranslateX(currentX) / this._getMaxTranslateX();

      this._maybeSwiping = false;
      let swiping = this.state.swiping;
      this.setState({
        swiping: null,
      });

      if (this.swipeDXAbsT > 1.2) {
        if (this.state.open) {
          translateRatio = 1;
        } else {
          translateRatio = 0;
        }
      }

      // We have to open or close after setting swiping to null,
      // because only then CSS transition is enabled.
      if (translateRatio > 0.5) {
        if (swiping === 'opening') {
          this._setPosition(this._getMaxTranslateX());
        } else {
          this.close();
        }
      }
      else {
        if (swiping === 'opening') {
          this.open();
        } else {
          this._setPosition(0);
        }
      }
    }
    else {
      this._maybeSwiping = false;
    }

    React.findDOMNode(this.refs.container).removeEventListener('touchmove', this._onTriggerTouchMove);
    React.findDOMNode(this.refs.container).removeEventListener('touchend', this._onTriggerTouchEnd);
    React.findDOMNode(this.refs.container).removeEventListener('touchcancel', this._onTriggerTouchEnd);
  },

});

module.exports = LeftNav;
