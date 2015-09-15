import React from 'react';
import { Styles } from 'material-ui';
import FixedDataTable, { Table, Column } from 'fixed-data-table';

var periodHeight = 60;
var periodPadding = 2;
var courseTableWeekHead = 36;

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

var CourseTableWeekHead = React.createClass({

  getInitialState() {
    return {
      scrollLeft: 0
    };
  },

  updateScrollLeft(scrollLeft) {
    if (this.state.scrollLeft != scrollLeft) this.setState({ scrollLeft: scrollLeft });
  },

  getStyleFor(day = 1) {
    var width = '18%';
    if (day == this.props.activeDay) {
      width = '28%';
    }

    return {
      display: 'inline-block',
      position: 'relative',
      width: width,
      height: courseTableWeekHead,
      backgroundColor: '#fff'
    };
  },

  getDecorateFor(day = 1) {
    var decorates = [];

    if (day == this.props.activeDay) {
      decorates.push(
        <div style={{
            position: 'absolute',
            backgroundColor: '#ddd',
            left: 0,
            right: 0,
            height: 3,
            bottom: 1
          }}>
        </div>
      );
    }

    return decorates;
  },

  render() {
    return (
      <div style={{
          position: 'absolute',
          top: 0,
          width: '100%',
          height: courseTableWeekHead,
          overflow: 'hidden'
        }}>

        <div style={{
            position: 'absolute',
            left: '12%',
            right: 0,
            backgroundColor: '#fff',
            textAlign: 'center',
            lineHeight: courseTableWeekHead + 'px',
            opacity: '.8',
            transform: `translateX(-${this.state.scrollLeft}px)`,
            WebkitTransform: `translateX(-${this.state.scrollLeft}px)`
          }}>
          <div style={this.getStyleFor(1)} onTouchTap={this.handleTouchTap.bind(this, 1)}>
            週一
            {this.getDecorateFor(1)}
          </div>
          <div style={this.getStyleFor(2)} onTouchTap={this.handleTouchTap.bind(this, 2)}>
            週二
            {this.getDecorateFor(2)}
          </div>
          <div style={this.getStyleFor(3)} onTouchTap={this.handleTouchTap.bind(this, 3)}>
            週三
            {this.getDecorateFor(3)}
          </div>
          <div style={this.getStyleFor(4)} onTouchTap={this.handleTouchTap.bind(this, 4)}>
            週四
            {this.getDecorateFor(4)}
          </div>
          <div style={this.getStyleFor(5)} onTouchTap={this.handleTouchTap.bind(this, 5)}>
            週五
            {this.getDecorateFor(5)}
          </div>
          <div style={this.getStyleFor(6)} onTouchTap={this.handleTouchTap.bind(this, 6)}>
            週六
            {this.getDecorateFor(6)}
          </div>
          <div style={this.getStyleFor(7)} onTouchTap={this.handleTouchTap.bind(this, 7)}>
            週日
            {this.getDecorateFor(7)}
          </div>
        </div>

        <div style={{
            position: 'relative',
            width: '12%',
            height: courseTableWeekHead,
            backgroundColor: '#fff'
          }}>
        </div>
      </div>
    );
  },

  handleTouchTap(i) {
    if (this.props.handleChange) {
      this.props.handleChange(i);
    }
  }
});

var CourseTableColumn = React.createClass({

  getDefaultProps() {
    return {
      events: []
    };
  },

  getInitialState() {
    return {};
  },

  getStyle() {
    var width = '18%';
    var backgroundColor = 'transparent';
    if (this.props.active) width = '28%';
    if (this.props.head) {
      backgroundColor = 'rgba(255,255,255, .32)';
    }

    return {
      position: 'relative',
      width: width,
      height: periodHeight * Object.keys(this.props.periods).length + courseTableWeekHead,
      display: 'inline-block',
      boxSizing: 'border-box',
      borderRight: '1px solid rgba(220,220,220, .8)',
      backgroundColor: backgroundColor,
      ...this.props.style
    };
  },

  getPeriodMarks() {
    var periodCount = Object.keys(this.props.periods).length;
    var marks = [];

    for (let i=1; i<=periodCount; i++) {
      marks.push(
        <div style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: (i - 1) * periodHeight + periodPadding + courseTableWeekHead,
            height: periodHeight - periodPadding * 2,
            backgroundColor: 'rgba(200,200,200, .05)',
            overflow: 'hidden',
            whiteSpace: 'normal'
          }}>
        </div>
      );
    }

    if (this.props.head) {
      for (let i=1; i<=periodCount; i++) {
        let period = this.props.periods[i];

        let periodStartTime = period.time.split('-')[0];

        marks.push(
          <div style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: (i - 1) * periodHeight + courseTableWeekHead,
              paddingTop: periodHeight / 6,
              textAlign: 'center',
              lineHeight: `${periodHeight / 3}px`,
              opacity: '.8'
            }}>
            {period.code}
            <div style={{
                fontSize: 12,
                opacity: '.8'
              }}>
              {periodStartTime}
            </div>
          </div>
        );
      }
    }

    this.periodMarks = marks;
    return marks;
  },

  getEventElements() {
    if (this.props.head) return null;
    return this.props.events.map( (event) => {
      var eventInfos = [];

      if (event.location) eventInfos.push(event.location);
      if (event.subtitle) eventInfos.push(event.subtitle);
      if (event.description) eventInfos.push(event.description);

      eventInfos = eventInfos.map( (info) => <div style={{ padding: '4px 8px 0' }}>{info}</div> )

      var color = (event.color || Styles.Colors.blueGrey500);
      var colorRGB = hexToRgb(color);
      var colorRGBString = `${colorRGB.r}, ${colorRGB.g}, ${colorRGB.b}`;

      return (
        <div style={{
            position: 'absolute',
            left: periodPadding,
            right: periodPadding,
            top: (event.periodOrderFirst - 1) * periodHeight + courseTableWeekHead + periodPadding,
            height: (event.periodLength) * periodHeight - periodPadding * 2,
            backgroundColor: color,
            color: '#fff',
            overflow: 'hidden',
            whiteSpace: 'normal',
            fontSize: '12.99px'
          }}>
          <div style={{
              padding: '8px 8px 0',
              fontWeight: 'bold'
            }}>
            {event.title}
          </div>
          {eventInfos}
          <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: 10,
              backgroundImage: `-webkit-linear-gradient(top, rgba(${colorRGBString}, 0) 0%, rgba(${colorRGBString}, 1)  90%)`,
            }}>
          </div>
        </div>
      );
    });
  },

  render() {
    var periodMarks = this.getPeriodMarks();
    var eventElements = this.getEventElements();

    return (
      <div
        onTouchTap={this.props.onTouchTap}
        style={this.getStyle()}>
        {periodMarks}
        {periodMarks}
        {eventElements}
      </div>
    );
  }
});

var CourseTable = React.createClass({

  getDefaultProps() {
    return {
      periods: [],
      events: []
    };
  },

  getInitialState() {
    return {
      activeColumn: ((new Date()).getDay() == 0) ? 7 : (new Date()).getDay()
    };
  },

  getStyle(style = {}, mixPropStyle = true) {
    var propStyle = {};
    if (mixPropStyle) propStyle = this.props.style;
    return {
      backgroundColor: '#fdfdfd',
      position: 'relative',
      width: '100%',
      top: 0,
      bottom: 0,
      ...propStyle,
      ...style,
      whiteSpace: 'nowrap',
      overflow: 'auto'
    };
  },

  getPeriodsObject(key = 'order') {
    return this.props.periods.reduce(function(object, period, i) {
      object[period[key]] = period;
      return object;
    }, {});
  },

  getEventsForDay(day) {
    var periodsObject = this.getPeriodsObject('order');
    return this.props.events.filter( (event) => (event.periodOrder && event.day == day) ).map( (event) => {
      if (typeof event.periodOrder === 'object') {
        let periodOrderLast = event.periodOrder.length - 1;
        event.periodOrderFirst = event.periodOrder[0];
        event.periodLength = event.periodOrder[periodOrderLast] - event.periodOrder[0] + 1;
      } else {
        event.periodOrderFirst = event.periodOrder;
        event.periodLength = 1;
      }
      return event;
    });
  },

  render() {
    var periodsObject = this.getPeriodsObject('order');

    return (
      <div style={this.getStyle({ WebkitOverflowScrolling: 'auto' })} ref="table" onScroll={this.handleScroll}>
        <div style={this.getStyle({ WebkitOverflowScrolling: 'touch', position: 'absolute' }, false)} ref="scrollableArea" onScroll={this.handleScroll}>

          <CourseTableColumn head ref="timeHead" periods={periodsObject}  style={{
              width: '12%',
              position: 'absolute'
            }} />

          <div style={{
              display: 'inline-block',
              width: '12%'
            }}>
          </div>

          <div style={{
              display: 'inline-block',
              width: '88%',
              overflowX: 'auto'
            }}>
            <CourseTableColumn periods={periodsObject} events={this.getEventsForDay(1)} active={this.state.activeColumn == 1} onTouchTap={this.changeActiveColumn.bind(this, 1)} />
            <CourseTableColumn periods={periodsObject} events={this.getEventsForDay(2)} active={this.state.activeColumn == 2} onTouchTap={this.changeActiveColumn.bind(this, 2)} />
            <CourseTableColumn periods={periodsObject} events={this.getEventsForDay(3)} active={this.state.activeColumn == 3} onTouchTap={this.changeActiveColumn.bind(this, 3)} />
            <CourseTableColumn periods={periodsObject} events={this.getEventsForDay(4)} active={this.state.activeColumn == 4} onTouchTap={this.changeActiveColumn.bind(this, 4)} />
            <CourseTableColumn periods={periodsObject} events={this.getEventsForDay(5)} active={this.state.activeColumn == 5} onTouchTap={this.changeActiveColumn.bind(this, 5)} />
            <CourseTableColumn periods={periodsObject} events={this.getEventsForDay(6)} active={this.state.activeColumn == 6} onTouchTap={this.changeActiveColumn.bind(this, 6)} />
            <CourseTableColumn periods={periodsObject} events={this.getEventsForDay(7)} active={this.state.activeColumn == 7} onTouchTap={this.changeActiveColumn.bind(this, 7)} />
          </div>
        </div>
        <CourseTableWeekHead ref="weekHead" activeDay={this.state.activeColumn} handleChange={this.changeActiveColumn} />
      </div>
    );
  },

  changeActiveColumn(i) {
    this.setState({ activeColumn: i })
  },

  handleScroll(e) {
    var target = e.target;
    if (target.scrollLeft || !target.scrollTop) this.refs.weekHead.updateScrollLeft(target.scrollLeft);
  },

  componentDidMount() {
    // React.findDOMNode(this.refs.scrollableArea).scrollTop = 0;
  }
});

export default CourseTable;
