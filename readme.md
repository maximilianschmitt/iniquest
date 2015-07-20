# iniquest

A lightweight (~30 LOC) library to help with async data fetching before rendering with [react-router](https://github.com/rackt/react-router).

## Installation

```
$ npm i iniquest -S
```

## Usage

Below is an example of how you could use iniquest with express. For a more detailed example, that also demonstrates acting on `POST`-requests, check out [maximilianschmitt/full-stack-react](https://github.com/maximilianschmitt/full-stack-react).

### server.js

```javascript
const routes = (
  <Route handler={App}>
    <Route name="home" path="/" handler={Home} />
    <Route name="ip" path="/ip" handler={Ip} />
  </Route>
);

app.use(function(req, res, next) {
  Router.run(routes, req.path, function(Handler, state) {
    iniquest
      .run(state, req).then(initialState => {
        res.send(React.renderToString(<Handler initialState={initialState} />));
      })
      .catch(next);
  });
});
```

### app-component.js

Here, `RouteHandler` will be the `Ip` component below if the user navigates to `/ip`.

```javascript
class App extends React.Component {
  render() {
    return (
      <div className="app">
        <RouteHandler initialState={this.initialChildState()} />
      </div>
    );
  }
}

mixin.onClass(App, iniquest.InitialChildState);
```

### ip-component.js

```javascript
class Ip extends React.Component {
  render() {
    return <div>Your ip is: {this.state.ip}</div>;
  }
}

mixin.onClass(Ip, iniquest.InitialStateFromProps);

// implement prepareForRequest on a RouteHandler
// to make an async request before rendering
Ip.prepareForRequest = function(req) {
  return fetch('http://ip.jsontest.com').then(res => res.data);
};
```

## Todo

1. Add ability for parent `RouteHandler`s to pass params to the `prepareForRequest` of a child `RouteHandler`, maybe like this:
    ```javascript
    Component.prepareChildForRequest(initialState, childRoute) : opts
    Component.prepareForRequest(req, opts) : initialState
    ```

2. Find a simple solution so that (1) can optionally run `prepareForRequest`-calls in parallel if `opts` for the child's preparation are not dependent on the parent's `prepareForRequest`
