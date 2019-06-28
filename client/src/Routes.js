import React, { Component, Fragment } from "react";
import Footer from "./Containers/Footer";

function asyncComponent(getComponent) {
  class AsyncComponent extends Component {
    static Component = null;
    state = { Component: AsyncComponent.Component };

    componentWillMount() {
      if (!this.state.Component) {
        getComponent().then(Component => {
          AsyncComponent.Component = Component;
          this.setState({ Component });
        });
      }
    }
    render() {
      const { Component } = this.state;
      if (Component) {
        return <Component {...this.props} />;
      }
      return null;
    }
  }
  return AsyncComponent;
}

const Global = asyncComponent(() =>
  import("./Routes/global").then(module => module.default)
);
const Auth = asyncComponent(() =>
  import("./Containers/Auth").then(module => module.default)
);

export default class Routes extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    //

    const { onAppStart } = this.props;
    onAppStart();
  }

  render() {
    const { authenticated, unauthorizedError } = this.props;
    if (authenticated !== true && authenticated !== false) {
      return <div>Loading</div>;
    }

    return (
      <Fragment>
        {authenticated === true ? (
          <Auth
            unauthorizedError={unauthorizedError}
            authRedirection={this.props.authRedirection}
          />
        ) : (
          <Global />
        )}
        <Footer />
      </Fragment>
    );
  }
}
