'use strict';

const RSVP = require('rsvp');

const iniquest = {
  run: function(state, ...args) {
    return state.routes.slice().reverse().reduce((initialState, route) => {
      initialState.self = route.handler.prepareForRequest
        ? route.handler.prepareForRequest(...args) || null
        : null;

      return { child: RSVP.hash(initialState) };
    }, {}).child;
  },

  InitialChildState: {
    initialChildState() {
      return this.props.initialState ? this.props.initialState.child : {};
    }
  },

  InitialStateFromProps: {
    componentWillMount() {
      if (!this.props.initialState || !this.props.initialState.self) {
        return;
      }

      this.setState(this.props.initialState.self);
    }
  }
};

module.exports = iniquest;
