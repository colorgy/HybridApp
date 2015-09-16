import React from 'react';
import { connect } from 'react-redux';
import PageRouter, { Route } from '../components/PageRouter';
import AboutIndex from './About/AboutIndex';
import AboutUs from './About/AboutUs';
import AboutProjects from './About/AboutProjects';

 var About = React.createClass({
  render() {
    return (
      <PageRouter history={this.props.routerHistroy}>
        <Route path="/" handler={AboutIndex} />
        <Route path="/us" handler={AboutUs} />
        <Route path="/projects" handler={AboutProjects} />
        <Route path="/us/:hash" handler={AboutUs} />
        <Route path="/projects/:hash" handler={AboutProjects} />
      </PageRouter>
    );
  }
});

export default connect(state => ({
  routerHistroy: state.pageRouter.aboutHistory
}))(About);
