import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Button, Checkbox, Modal, Icon } from "antd";
import { fetchMember, updateMemberConsent } from "../../Actions/memberActions";
import Header from "../../Components/Header";
import "./style.css";
import Footer from "../../Components/Footer";

class MemberHomeContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      redirect: false
    };

    this.onChange = this.onChange.bind(this);
    this.handleOk = this.handleOk.bind(this);
  }
  componentDidMount() {
    this.props.fetchMember();
  }
  handleOk() {
    if (this.state.checked) {
      this.props.updateMemberConsent(
        this.props.loggedInMemberData._id,
        this.state.checked
      );
    }
  }

  onChange(e) {
    this.setState({
      checked: e.target.checked
    });
  }
  render() {
    return (
      <div>
        {/* <div>
          <div className="pageHeader">
            <h1>Econsulting Application</h1>
          </div>
          <div className="welcomeMessage">
            {this.props.loggedInMemberData ? (
              <h3>Welcome {this.props.loggedInMemberData.firstName}</h3>
            ) : (
              ""
            )}
          </div>
        </div> */}
        {/* <Route
          path="/home/scheduleAppointment"
          component={ScheduleAppointment}
        /> */}
        <Header loggedInMemberData={this.props.loggedInMemberData} />
        <div className="memberFeatureDiv">
          <Modal
            title="Terms and Conditions"
            visible={
              this.props.loggedInMemberData
                ? !this.props.loggedInMemberData.hasConsented
                : null
            }
            footer={[
              <Button
                key="submit"
                type="primary"
                disabled={!this.state.checked}
                onClick={this.handleOk}
              >
                Submit
              </Button>
            ]}
          >
            <p>
              THIS IS A LEGALLY BINDING AGREEMENT between IQVIA (“IQVIA”, “we”
              or “us“), and you. BY CLICKING “I AGREE,” OR BY OTHERWISE SIGNING
              UP OR FOR AN ACCOUNT, OR BY ACCESSING OR USING THE IQVIA HCP Space
              (“Services”), YOU AGREE TO BE BOUND BY THESE TERMS OF USE AND
              DISCLAIMERS (“Terms”) AND ARE ENTERING INTO A FULLY BINDING
              AGREEMENT. NO HCP is eligible/permitted to be a member of HCP
              Space or even use the HCP Space if you are a resident of any of
              the following countries, Iran, Syria, Cuba, Crimea (Ukraine) and
              North Korea. Please read these Terms carefully, and do not sign up
              for an account or use the Services if you are unwilling or unable
              to be bound by these Terms. You and we are collectively referred
              to as the “Parties.”
            </p>
            <Checkbox checked={this.state.checked} onChange={this.onChange}>
              I agree to the above terms and conditions
            </Checkbox>
          </Modal>

          <div
            className="memberFeatureBox"
            onClick={e => {
              this.props.history.push("/member/search");
            }}
          >
            <div className="memberFeatureLabel">Schedule Appointment</div>
            <div>
              <Icon
                type="schedule"
                theme="outlined"
                style={{ color: "white", fontSize: 35 }}
              />
            </div>
          </div>
          <div
            className="memberFeatureBox"
            onClick={e => {
              this.props.history.push("/member/consultation");
            }}
          >
            <div className="memberFeatureLabel"> Consultation</div>
            <div>
              <Icon
                type="customer-service"
                theme="outlined"
                style={{ color: "white", fontSize: 35 }}
              />
            </div>
          </div>
          <div className="memberFeatureBox">
            <div className="memberFeatureLabel"> Appointment History</div>
            <div>
              <Icon
                type="file-text"
                theme="outlined"
                style={{ color: "white", fontSize: 35 }}
              />
            </div>
          </div>
        </div>
        <Footer />
        {/* <footer className="pageFooter">
          <div>
            <img src={IqviaLogo} className="iqviaFooterLogo" alt="logo" />
          </div>
          <div>
            <h3>
              Copyright
              <Icon
                type="copyright"
                theme="outlined"
                style={{ color: "rgba(255,255,255)", fontSize: 20 }}
              />{" "}
              2018 Econsulting Application
            </h3>
          </div>
        </footer> */}
      </div>
    );
  }
}

const mapStateToProps = ({ memberReducer }) => {
  return {
    loggedInMemberData: memberReducer.data
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    { fetchMember, updateMemberConsent }
  )(MemberHomeContainer)
);
