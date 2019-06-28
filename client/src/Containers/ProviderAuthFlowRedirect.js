import React, { Component } from "react";
import { Route } from "react-router-dom";
import ProviderLogin from "../Components/ProviderLogin";
import ProviderHome from "../Components/ProviderHome";
import ConsultationScreen from "../Components/ConsultationScreen";

class ProviderAuthFlowRedirect extends Component {
  componentDidMount() {}

  render() {
    return (
      <div style={{ height: "100%" }}>
        <Route exact path="/provider/home" component={ProviderHome} />
        <Route exact path="/provider/login" component={ProviderLogin} />
        <Route
          exact
          path="/provider/consultationScreen"
          component={ConsultationScreen}
        />
      </div>
    );
  }
}

export default ProviderAuthFlowRedirect;
