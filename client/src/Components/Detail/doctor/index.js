import React, { Component, Fragment } from "react";
import { Row, Col } from "antd";
import ProfileHeader from "./profileHeader";
import DoctorDetail from "./doctorDetail";
import Calendar from "../../../Containers/calendar";
import AppointmentsHistory from "../../../Containers/AppointmentsHistory";
import { ENTITY } from "../../../constant";

import "../style.less";

class DoctorProfile extends Component {
  componentDidMount() {
    const { id } = this.props;
    this.props.fetchDoctor(id);
    this.props.fetchDoctorHospitals(id);
    this.props.fetchAppointmentsHistory(id);
  }

  onEditProfile = () => {
    const { history, id } = this.props;
    history.push(`/${ENTITY.DOCTOR}/${id}/edit`);
  };

  handleGoBack = e => {
    e.preventDefault();
    const { history } = this.props;
    history.goBack();
  };

  render() {
    const { is_loading } = this.props;
    const { onEditProfile, handleGoBack } = this;
    if (is_loading) {
      return null;
    }
    return (
      <Fragment>
        <div className="patient-profile">
          <div className="profile">
            <ProfileHeader {...this.props} handleGoBack={handleGoBack} />
            <div className="profile-detail">
              <Row>
                <Col className="Detail" md={3}>
                  <DoctorDetail
                    {...this.props}
                    handleEditProfile={onEditProfile}
                  />
                </Col>
                <Col md={6} className="Calender">
                  <Calendar {...this.props} />
                </Col>
                <Col md={3} className="Appointments-History">
                  <AppointmentsHistory {...this.props} />
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

export default DoctorProfile;
