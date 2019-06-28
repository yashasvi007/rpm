import React from "react";
import MemberLoginContainer from "../../Containers/MemberLogin";
import "./style.css";

const MemberLogin = () => {
  return (
    <div className="memberPageBackground">
      {/* <Route path="/" component={MemberLoginContainer} /> */}
      {/* <Route path="/home" component={MemberHome} /> */}
      <MemberLoginContainer />
    </div>
  );
};

export default MemberLogin;
