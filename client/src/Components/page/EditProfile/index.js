import React, { Component } from "react";
import set from "lodash-es/set";
import get from "lodash-es/get";
import forIn from "lodash-es/forIn";
import { Form, Layout } from "antd";
import { injectIntl } from "react-intl";
import AppHeader from "../../../Containers/Header";
import EditForm from "./common/editForm";
import ErrorComponent from "../../CommonError";
import SetUpStep from "../../../Containers/page/profileSetup/SetUpStep";
import { path, USER_CATEGORY } from "../../../constant";
import "./style.less";
import AddPatient from "../../../Containers/AddPatient/addPatient";
import AddDoctor from "../../../Containers/AddDoctor/addDoctor";

class EditProfile extends Component {
  constructor(props) {
    super(props);
    this.gotoDashBoard = this.gotoDashBoard.bind(this);
    this.onSave = this.onSave.bind(this);
    this.EditForm = Form.create()(EditForm);
    this.gotoMyProfile = this.gotoMyProfile.bind(this);
    this.state = { openAddPatient: false, openAddDoctor: false };
    this.AddPatientForm = Form.create()(AddPatient);
    this.AddDoctorForm = Form.create()(AddDoctor);
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    if (id) {
      this.props.getData(id);
    } else {
      this.props.getData();
    }
  }

  clearMsg = e => {
    const { clearMsg } = this.props;
    clearMsg();
    // e.preventDefault();
    this.setState({
      data_save_done: false,
      success_msg: null
    });
  };

  clearError = e => {
    const { cleanOtpState } = this.props;
    cleanOtpState();
    e.preventDefault();
    this.setState({
      error_msg: null
    });
  };

  onSave(fields) {
    const { cleanOtpState, user_data = {}, hospitals_data = {} } = this.props;
    cleanOtpState();
    let formData = {};
    const { basicInfo = {} } = user_data;
    forIn(fields, (value, key) => {
      set(formData, key, value);
    });
    if (basicInfo.category === USER_CATEGORY.DOCTOR) {
      const hospitalId = get(formData, "hospitals[0]", "");
      if (hospitalId !== "" && hospitals_data !== {}) {
        const hospitalName = hospitals_data[hospitalId].name;
        set(formData, "work.organizationName", hospitalName);
      }
    }
    set(formData, "userId", basicInfo._id);
    this.props.updateUser(formData);
  }

  gotoMyProfile(e) {
    e.preventDefault();
    this.props.history.push(path.MY_PROFILE);
  }

  openAddPatientModal = e => {
    e.preventDefault();
    this.state.openAddPatient
      ? this.setState({ openAddPatient: false })
      : this.setState({ openAddPatient: true });
  };

  openAddDoctorModal = e => {
    e.preventDefault();
    this.state.openAddDoctor
      ? this.setState({ openAddDoctor: false })
      : this.setState({ openAddDoctor: true });
  };

  gotoDashBoard() {
    this.props.history.push(path.DASHBOARD.HOME);
  }

  // goToChangePassword = () => {
  //   this.props.history.push(path.CHANGE_PASSWORD);
  // };

  setFieldsError = errors => {
    if (errors) {
      const { setFields } = this.EditForm;
      let fieldsError = {};
      forIn(errors, (value, key) => {
        fieldsError[key] = {
          value: value.value,
          errors: [new Error("invalid value for field")]
        };
      });
      setFields(fieldsError);
    }
  };

  handleGoBack = e => {
    e.preventDefault();
    const { history } = this.props;
    history.goBack();
  };

  render() {
    const { match: { params: { id } = {} } = {} } = this.props;

    const {
      user_data,
      care_coaches,
      case_doctors,
      medicals_data,
      hospitals_data,
      //success_msg,
      is_profile_error,
      //is_profile_saved,
      profile_error,
      isLoading = true
    } = this.props;
    if (isLoading) {
      return <AppHeader />;
    }

    const { isProfileCompleted } = user_data;

    const { handleGoBack } = this;

    const isSetUpStep = isProfileCompleted;
    const { EditForm, AddPatientForm, AddDoctorForm } = this;
    const { basicInfo = {} } = user_data;
    const { category } = basicInfo;

    const editingOtherUser = id ? true : false;

    // const menu = (
    //   <Menu>
    //     <Menu.Item>
    //       <a onClick={this.openAddPatientModal}>Add Patient</a>
    //     </Menu.Item>
    //     <Menu.Item>
    //       <a onClick={this.openAddDoctorModal}>Add Doctor</a>
    //     </Menu.Item>
    //     <Menu.Item>
    //       <a onClick={this.gotoMyProfile}>
    //         {formatMessage(messages.myProfile)}
    //       </a>
    //     </Menu.Item>
    //   </Menu>
    // );
    const fieldsError = this.props.error
      ? this.props.error.fieldError
        ? this.props.error.fieldsError
        : null
      : null;

    return (
      <Layout
        className={"edit_form_page_wrapper"}
        style={{ backgroundColor: "white" }}
      >
        <AppHeader />
        {this.state.openAddPatient && (
          <AddPatientForm
            handleCancel={this.openAddPatientModal}
            visible={this.state.openAddPatient}
          />
        )}

        {this.state.openAddDoctor && (
          <AddDoctorForm {...this.props} visible={this.state.openAddDoctor} />
        )}

        {!isSetUpStep && category === USER_CATEGORY.PATIENT && (
          <SetUpStep className="iqvia-step" />
        )}

        <EditForm
          {...this.props}
          userData={user_data}
          medicalsData={medicals_data}
          careCoaches={care_coaches}
          hospitals={hospitals_data}
          caseDoctors={case_doctors}
          onSave={this.onSave}
          gotoDashBoard={this.gotoDashBoard}
          gotoChangePassword={this.goToChangePassword}
          customFieldsError={fieldsError}
          editingOtherUser={editingOtherUser}
          handleGoBack={handleGoBack}
        />

        {/* <CommonMessage /> */}

        {is_profile_error && (
          <ErrorComponent msg={profile_error.message} close={this.clearMsg} />
        )}
      </Layout>
    );
  }
}

export default injectIntl(EditProfile);
