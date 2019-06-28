import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { Dropdown, Menu, Icon } from "antd";
import { GLOBAL_MODALS, USER_CATEGORY } from "../../../constant";
import messages from "./message";

class AddButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      should_rotate: false
    };
  }

  handleAddButtonClick = () => {
    this.setState((prevState, props) => {
      return { should_rotate: !prevState.should_rotate };
    });
  };
  render() {
    const {
      intl: { formatMessage },
      category,
      openModal
    } = this.props;
    const { should_rotate } = this.state;

    const CareCoachAddmenu = (
      <Menu>
        <Menu.Item
          onClick={e => {
            openModal(GLOBAL_MODALS.EVENT_MODAL);
            this.handleAddButtonClick();
          }}
        >
          {formatMessage(messages.newAppointment)}
        </Menu.Item>

        <Menu.Item
          onClick={e => {
            openModal(GLOBAL_MODALS.PATIENT_MODAL);
            this.handleAddButtonClick();
          }}
        >
          {formatMessage(messages.newPatient)}
        </Menu.Item>

        <Menu.Item
          onClick={e => {
            openModal(GLOBAL_MODALS.DOCTOR_MODAL);
            this.handleAddButtonClick();
          }}
        >
          {formatMessage(messages.newDoctor)}
        </Menu.Item>

        <Menu.Item
          onClick={e => {
            openModal(GLOBAL_MODALS.ADVERSE_EVENTS);
            this.handleAddButtonClick();
          }}
        >
          {formatMessage(messages.reportAdverseEvent)}
        </Menu.Item>
      </Menu>
    );

    const PatientAddmenu = (
      <Menu>
        <Menu.Item
          onClick={e => {
            openModal(GLOBAL_MODALS.EVENT_MODAL);
            this.handleAddButtonClick();
          }}
        >
          {formatMessage(messages.newAppointment)}
        </Menu.Item>

        <Menu.Item
          onClick={e => {
            openModal(GLOBAL_MODALS.ADVERSE_EVENTS);
            this.handleAddButtonClick();
          }}
        >
          {formatMessage(messages.reportAdverseEvent)}
        </Menu.Item>
      </Menu>
    );

    let currentAddMenu;
    switch (category) {
      case USER_CATEGORY.CARE_COACH:
        currentAddMenu = CareCoachAddmenu;
        break;
      case USER_CATEGORY.PATIENT:
        currentAddMenu = PatientAddmenu;
        break;
      case USER_CATEGORY.DOCTOR:
        currentAddMenu = PatientAddmenu;
        break;
      default:
        break;
    }

    return (
      <Dropdown
        overlay={currentAddMenu}
        onVisibleChange={this.handleAddButtonClick}
        trigger={["click"]}
      >
        <div className="dashboard_add_button flex align-items-center justify-content-center">
          <Icon
            type="plus"
            rotate={should_rotate ? "45" : "0"}
            style={{ fontSize: "24px" }}
          />
        </div>
      </Dropdown>
    );
  }
}

export default injectIntl(AddButton);
