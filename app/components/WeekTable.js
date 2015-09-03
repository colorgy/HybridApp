import React from 'react';
import { Styles } from 'material-ui';
import FixedDataTable, { Table, Column } from 'fixed-data-table';

var hourHeight = 60;

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

var periods = JSON.parse('[  {    "code": "D",    "order": 15,    "time": "21:10-22:00",    "id": 15,    "_type": "ntust_period_data"  },  {    "code": "C",    "order": 14,    "time": "20:10-21:05",    "id": 14,    "_type": "ntust_period_data"  },  {    "code": "B",    "order": 13,    "time": "19:20-20:10",    "id": 13,    "_type": "ntust_period_data"  },  {    "code": "A",    "order": 12,    "time": "18:25-19:15",    "id": 12,    "_type": "ntust_period_data"  },  {    "code": "10",    "order": 11,    "time": "17:30-18:20",    "id": 11,    "_type": "ntust_period_data"  },  {    "code": "9",    "order": 10,    "time": "16:30-17:20",    "id": 10,    "_type": "ntust_period_data"  },  {    "code": "8",    "order": 9,    "time": "15:30-16:20",    "id": 9,    "_type": "ntust_period_data"  },  {    "code": "7",    "order": 8,    "time": "14:20-15:10",    "id": 8,    "_type": "ntust_period_data"  },  {    "code": "6",    "order": 7,    "time": "13:20-14:10",    "id": 7,    "_type": "ntust_period_data"  },  {    "code": "5",    "order": 6,    "time": "12:20-13:10",    "id": 6,    "_type": "ntust_period_data"  },  {    "code": "4",    "order": 5,    "time": "11:20-12:10",    "id": 5,    "_type": "ntust_period_data"  },  {    "code": "3",    "order": 4,    "time": "10:20-11:10",    "id": 4,    "_type": "ntust_period_data"  },  {    "code": "2",    "order": 3,    "time": "09:10-10:00",    "id": 3,    "_type": "ntust_period_data"  },  {    "code": "1",    "order": 2,    "time": "08:10-09:00",    "id": 2,    "_type": "ntust_period_data"  },  {    "code": "0",    "order": 1,    "time": "07:10-08:00",    "id": 1,    "_type": "ntust_period_data"  }]');

var events = [
  { day: 1, periodOrder: 1, title: '微積分', location: 'TR-212', subtitle: '授課教師：安安' },
  { day: 2, periodOrder: [2, 3], title: '微積分', location: 'TR-212', subtitle: '授課教師：安安' },
  { day: 1, periodOrder: 3, title: '物理', location: 'TR-212', subtitle: '授課教師：安安' },
  { day: 4, periodOrder: [4, 5], title: '物理', location: 'TR-212', subtitle: '授課教師：安安' },
  { day: 3, startAt: '09:10', endAt: '12:00', title: '看電影', location: '威秀影城', subtitle: '找學妹', color: '#ef6c00' },
  { day: 5, startAt: '10:30', endAt: '15:00', title: '小週末約會', location: '九份', description: '一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩一直玩', color: '#388e3c' },
];

var WeekTableWeekHead = React.createClass({

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
      height: '36px',
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
          height: '36px',
          overflow: 'hidden'
        }}>

        <div style={{
            position: 'absolute',
            left: '12%',
            right: 0,
            backgroundColor: '#fff',
            textAlign: 'center',
            lineHeight: '36px',
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
            height: '36px',
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

var WeekTableColumn = React.createClass({

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
      height: hourHeight * 24,
      display: 'inline-block',
      boxSizing: 'border-box',
      borderRight: '1px solid rgba(220,220,220, .8)',
      backgroundColor: backgroundColor,
      ...this.props.style
    };
  },

  getHourMarks() {
    if (this.hourMarks) return this.hourMarks;
    var marks = [];

    if (this.props.head) {
      var periodCount = Object.keys(this.props.periods).length;
      var periodsStartHour = 23.0;
      var periodsEndHour = 0.0;

      for (let i=1; i<=periodCount; i++) {
        let period = this.props.periods[i];

        let periodStartTime = period.time.split('-')[0];
        let periodEndTime = period.time.split('-')[1];
        let startHour = parseInt(periodStartTime.split(':')[0]) + parseInt(periodStartTime.split(':')[1]) / 60;
        let endHour = parseInt(periodEndTime.split(':')[0]) + parseInt(periodEndTime.split(':')[1]) / 60;

        if (periodsStartHour > startHour) periodsStartHour = startHour;
        if (periodsEndHour < endHour) periodsEndHour = endHour;

        marks.push(
          <div style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: startHour * hourHeight,
              paddingTop: hourHeight / 6,
              textAlign: 'center',
              lineHeight: `${hourHeight / 3}px`,
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

      for (let i=1; i<24; i++) {
        if (i > periodsStartHour - 1 && i < periodsEndHour + 1) continue;

        var label = `${i}:00`

        marks.push(
          <div style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: i * hourHeight - 8,
              fontSize: 12,
              lineHeight: '16px',
              textAlign: 'center',
              whiteSpace: 'normal',
              opacity: '.8'
            }}>
            {label}
          </div>
        );
      }

    }

    for (let i=hourHeight; i<(hourHeight*24); i+=hourHeight) {
      marks.push(
        <div style={{
            position: 'absolute',
            right: -2,
            top: i,
            width: 3,
            height: 3,
            backgroundColor: 'rgba(220,220,220, .8)',
            borderRadius: 100
          }}>
        </div>
      );
    }

    this.hourMarks = marks;
    return marks;
  },

  getEventElements() {
    if (this.props.head) return null;
    return this.props.events.map( (event) => {
      var startHour = parseInt(event.startAt.split(':')[0]) + parseInt(event.startAt.split(':')[1]) / 60;
      var endHour = parseInt(event.endAt.split(':')[0]) + parseInt(event.endAt.split(':')[1]) / 60;

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
            left: 0,
            right: 0,
            top: startHour * hourHeight,
            height: (endHour - startHour) * hourHeight,
            backgroundColor: color,
            color: '#fff',
            overflow: 'hidden',
            whiteSpace: 'normal'
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

  getPeriodMarks() {
    if (this.periodMarks) return this.periodMarks;

    var periodMarks = [];

    var periodCount = Object.keys(this.props.periods).length;

    for (let i=1; i<=periodCount; i++) {
      let period = this.props.periods[i];
      let periodStartTime = period.time.split('-')[0];
      let startHour = parseInt(periodStartTime.split(':')[0]) + parseInt(periodStartTime.split(':')[1]) / 60;
      periodMarks.push(
        <div style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: startHour * hourHeight,
            borderBottom: '1px dotted rgba(220,220,220, .8)'
          }}>
        </div>
      );
    }

    this.periodMarks = periodMarks;
    return periodMarks;
  },

  render() {
    var hourMarks = this.getHourMarks();
    var eventElements = this.getEventElements();
    var periodMarks = this.getPeriodMarks();

    return (
      <div
        onTouchTap={this.props.onTouchTap}
        style={this.getStyle()}>
        {periodMarks}
        {hourMarks}
        {eventElements}
      </div>
    );
  }
});

var WeekTable = React.createClass({

  getDefaultProps() {
    return {
      periods: periods,
      events: events
    };
  },

  getInitialState() {
    return {
      activeColumn: (new Date()).getDay()
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
    return periods.reduce(function(object, period, i) {
      object[period[key]] = period;
      return object;
    }, {});
  },

  getEventsForDay(day) {
    var periodsObject = this.getPeriodsObject('order');
    return this.props.events.filter( (event) => (event.day == day) ).map( (event) => {
      if (event.periodOrder) {
        if (typeof event.periodOrder === 'object') {
          var periodOrderLast = event.periodOrder.length - 1;
          var startPeriodTime = periodsObject[event.periodOrder[0]].time.split('-');
          event.startAt = startPeriodTime[0];
          var endPeriodTime = periodsObject[event.periodOrder[periodOrderLast]].time.split('-');
          event.endAt = endPeriodTime[1];
        } else {
          var periodTime = periodsObject[event.periodOrder].time.split('-');
          event.startAt = periodTime[0];
          event.endAt = periodTime[1];
        }
      }
      return event;
    });
  },

  render() {
    var periodsObject = this.getPeriodsObject('order');

    return (
      <div style={this.getStyle({ WebkitOverflowScrolling: 'auto' })} ref="table" onScroll={this.handleScroll}>
        <div style={this.getStyle({ WebkitOverflowScrolling: 'touch', position: 'absolute' }, false)} ref="scrollableArea" onScroll={this.handleScroll}>

          <WeekTableColumn head ref="timeHead" periods={periodsObject}  style={{
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
            <WeekTableColumn periods={periodsObject} events={this.getEventsForDay(1)} active={this.state.activeColumn == 1} onTouchTap={this.changeActiveColumn.bind(this, 1)} />
            <WeekTableColumn periods={periodsObject} events={this.getEventsForDay(2)} active={this.state.activeColumn == 2} onTouchTap={this.changeActiveColumn.bind(this, 2)} />
            <WeekTableColumn periods={periodsObject} events={this.getEventsForDay(3)} active={this.state.activeColumn == 3} onTouchTap={this.changeActiveColumn.bind(this, 3)} />
            <WeekTableColumn periods={periodsObject} events={this.getEventsForDay(4)} active={this.state.activeColumn == 4} onTouchTap={this.changeActiveColumn.bind(this, 4)} />
            <WeekTableColumn periods={periodsObject} events={this.getEventsForDay(5)} active={this.state.activeColumn == 5} onTouchTap={this.changeActiveColumn.bind(this, 5)} />
            <WeekTableColumn periods={periodsObject} events={this.getEventsForDay(6)} active={this.state.activeColumn == 6} onTouchTap={this.changeActiveColumn.bind(this, 6)} />
            <WeekTableColumn periods={periodsObject} events={this.getEventsForDay(7)} active={this.state.activeColumn == 7} onTouchTap={this.changeActiveColumn.bind(this, 7)} />
          </div>
        </div>
        <WeekTableWeekHead ref="weekHead" activeDay={this.state.activeColumn} handleChange={this.changeActiveColumn} />
      </div>
    );
  },

  changeActiveColumn(i) {
    this.setState({ activeColumn: i })
  },

  handleScroll(e) {
    var target = e.target;
    window.target = target;
    if (target.scrollLeft || !target.scrollTop) this.refs.weekHead.updateScrollLeft(target.scrollLeft);
  },

  componentDidMount() {
    React.findDOMNode(this.refs.scrollableArea).scrollTop = hourHeight * 7;
  }
});

export default WeekTable;
