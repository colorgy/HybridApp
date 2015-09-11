import React from 'react';
import Tappable from 'react-tappable';
import { Card, CardHeader, CardTitle, CardText, CardActions, FlatButton, Checkbox, IconButton, SvgIcon } from 'material-ui';

export default React.createClass({

  getDetails() {
    var details = [];

    if (this.props.introduction) {
      details.push(<p key="introduction">課程簡介：{this.props.introduction}</p>);
    }

    if (this.props.url) {
      details.push(<p key="url">課程網址：{this.props.url}</p>);
    }

    if (this.props.prerequisites) {
      details.push(<p key="prerequisites">預備知識：{this.props.prerequisites}</p>);
    }

    if (this.props.website) {
      details.push(<p key="website">課程網站：{this.props.website}</p>);
    }

    if (this.props.studentsEnrolled) {
      details.push(<p key="studentsEnrolled">目前修課人數：{this.props.studentsEnrolled} 人</p>);
    }

    if (this.props.times) {
      details.push(<p key="times">上課時間：{this.props.times}</p>);
    }

    if (this.props.required === true || this.props.required === false) {
      details.push(<p key="required">必選修：{this.props.required ? '必修課' : '選修課'}</p>);
    }

    if (this.props.fullSemester === true || this.props.fullSemester === false) {
      details.push(<p key="fullSemester">課程長度：{this.props.fullSemester ? '全學期' : '半學期'}</p>);
    }

    if (this.props.credits) {
      details.push(<p key="credits">學分數：{this.props.credits}</p>);
    }

    return details;
  },

  render() {
    var lecturerName = '老師未知';
    if (this.props.lecturer) lecturerName = this.props.lecturer + ' 老師'

    var creditsInfo = [];
    if (this.props.required === true || this.props.required === false) {
      creditsInfo.push(this.props.required ? '必修' : '選修');
    }
    if (this.props.credits) {
      creditsInfo.push(this.props.credits + ' 學分');
    }
    creditsInfo = creditsInfo.join('－');

    return (
      <Card>
        <CardTitle title={this.props.name} subtitle={lecturerName} showExpandableButton={true} style={{ paddingRight: 52 }}>
          <div style={{
              display: 'flex',
              marginTop: 8,
              marginLeft: -4,
              marginRight: -4,
              opacity: 0.5,
              fontSize: 12 }}>
            <div style={{
                flex: 1,
                padding: 4,
                paddingLeft: 0,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
              <SvgIcon style={{ height: 16, marginBottom: -4 }}>
                <path d="M0 0h24v24H0z" fill="none"/>
                <path d="M17.63 5.84C17.27 5.33 16.67 5 16 5L5 5.01C3.9 5.01 3 5.9 3 7v10c0 1.1.9 1.99 2 1.99L16 19c.67 0 1.27-.33 1.63-.84L22 12l-4.37-6.16z"/>
              </SvgIcon>
              {this.props.code}
            </div>
            <div style={{
                flex: 1,
                padding: 4,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
              <SvgIcon style={{ height: 16, marginBottom: -4 }}>
                <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" fill-opacity=".9"/>
                <path d="M0 0h24v24H0z" fill="none"/>
                <path d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" fill-opacity=".9"/>
              </SvgIcon>
              {this.props.times}
            </div>
            <div style={{
                flex: 1,
                padding: 4,
                paddingRight: 0,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}>
              <SvgIcon style={{ height: 16, marginBottom: -4 }}>
                <path d="M0 0h24v24H0z" fill="none"/>
                <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
              </SvgIcon>
              {creditsInfo}
            </div>
          </div>
        </CardTitle>
        <CardText expandable={true}>
          {this.getDetails()}
        </CardText>
        <CardActions style={{ textAlign: 'right' }}>
          <FlatButton label="詳細資料" onTouchTap={this.handleDetailsClick} onClick={this.handleDetailsClick} />
          <FlatButton label={this.props.selected ? '移除' : '加入'} onTouchTap={this.handleActionsClick} onClick={this.handleActionsClick} />
        </CardActions>
      </Card>
    );
  },

  handleDetailsClick() {
    if (this.props.onDetailsClick) {
      this.props.onDetailsClick(this.props.code);
    } else {
      console.log(this.props.code);
    }
  },

  handleActionsClick() {
    if (this.props.selected) {
      if (this.props.onSelectRemove) {
        this.props.onSelectRemove(this.props.code);
      } else {
        console.log('SelectRemove: ' + this.props.code);
      }

    } else {
      if (this.props.onSelectAdd) {
        this.props.onSelectAdd(this.props.code);
      } else {
        console.log('SelectAdd: ' + this.props.code);
      }
    }
  }
});
