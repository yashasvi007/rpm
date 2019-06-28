import { Card, Checkbox } from "antd";
import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Col from "antd/es/grid/col";
import defaultProfilePic from "../../../Assets/images/ico-placeholder-userdp.svg";
import errorIcon from "../../../Assets/images/ico-err.svg";
import { USER_STATUS, ENTITY } from "../../../constant";
import "./style.less";

class PatientCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false
    };
  }

  onChange = () => {
    let {
      showDischargeBarToggle,
      onPatientCardSelect,
      onPatientCardDeselect
    } = this.props;
    this.setState(
      prevState => {
        return { checked: !prevState.checked };
      },
      () => {
        const { checked } = this.state;
        checked
          ? onPatientCardSelect(this.props.data.id)
          : onPatientCardDeselect(this.props.data.id);
        showDischargeBarToggle();
      }
    );
  };

  isChecked = id => {
    const { patientDischargedList } = this.props;
    if (patientDischargedList) {
      return patientDischargedList.indexOf(id) !== -1;
    } else if (
      this.props.selectedPatient &&
      this.props.selectedPatient.indexOf(id) !== -1
    ) {
      return true;
    } else {
      return false;
    }
  };

  cardClicked = () => {
    const { data, handleOnClick, surveyId } = this.props;
    if (surveyId && handleOnClick) {
      handleOnClick(surveyId, data.id);
    }
  };

  openPatient = () => {
    const { data, handleOnClick } = this.props;
    if (handleOnClick) {
      this.props.history.push(`/${ENTITY.PATIENT}/${data.id}`);
    }
  };

  componentDidUpdate(prevProps, prevState, snapshot) {
    if (prevProps.uncheckAll !== this.props.uncheckAll) {
      if (this.props.uncheckAll) {
        this.setState({ checked: false });
      }
    }
  }

  render() {
    const { data, checkbox, disabled, wantCheckBox = true } = this.props;
    // console.log("this.state.checked ----", this.props.selectedPatient);
    return (
      <Col key={this.state.checked} xs={12} sm={12} md={6} lg={6}>
        <Card
          className={`m patient-mobile ${
            data.type &&
            data.type === USER_STATUS.ENROLLED &&
            this.state.checked
              ? "selected"
              : ""
          }`}
          onClick={this.cardClicked}
          key={this.state.checked}
        >
          <div className="">
            <div className="flex align-items-center">
              <img
                alt=""
                src={data.profilePicLink || defaultProfilePic}
                className="patientDp mr16"
              />
              <div
                className={`${
                  data.type && data.type === USER_STATUS.DISCHARGED
                    ? "subdued"
                    : "dark"
                } patientInfo clickable`}
                onClick={this.openPatient}
              >
                {data.title
                  ? data.title.length < 13
                    ? data.title
                    : data.title.substr(0, 13) + "..."
                  : ""}{" "}
                ({data.age} {data.gender})
              </div>
              {data.checkbox && wantCheckBox ? (
                <div className="selectPatient">
                  <Checkbox
                    onChange={this.onChange}
                    checked={checkbox ? checkbox : this.isChecked(data.id)}
                    disabled={disabled}
                  />
                </div>
              ) : (
                ""
              )}
              {data.type && data.type === USER_STATUS.INACTIVE ? (
                <div className="selectPatient">
                  <img src={errorIcon} alt="Patient Not enrolled" />
                </div>
              ) : (
                ""
              )}
            </div>
            <div>
              <ul className="patients ">
                <li>
                  <span className="fontsize12 dark">{data.doctor}</span>
                </li>
                <li>
                  <span className="fontsize12 label-color">
                    {data.hospital}
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </Card>
      </Col>
    );
  }
}

export default withRouter(PatientCard);
