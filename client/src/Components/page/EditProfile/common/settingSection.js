import React, { Component } from "react";
import { List, Icon, Checkbox, Form } from "antd";
import { Element } from "react-scroll";
import { injectIntl } from "react-intl";
import moment from "moment";
import messages from "../message";

import { path, USER_CATEGORY } from "../../../../constant";
import config from "../../../../config";

const FormItem = Form.Item;

const SYNCED_CALENDAR = "settings.isCalendarSynced";
const SMS_ALERTS = "settings.preferences.smsAlerts";
const EMAIL_ALERTS = "settings.preferences.emailAlerts";
const PUSH_ALERTS = "settings.preferences.pushAlerts";
const REMINDERS_ALERTS = "settings.preferences.reminderAlerts";
const CONTENTFORM = "ContentForm";
const IDPROOF = "IdProof";

class SettingSection extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // openChangePassword = e => {
  //   e.preventDefault();
  //   this.props.gotoChangePassword();
  // };

  handleOpenChangePasswordModal = () => {
    const {
      openChangePassword,
      user_data: {
        basicInfo: { _id }
      }
    } = this.props;

    openChangePassword(_id);
  };

  openConsentForm = purpose => {
    // e.preventDefault();

    // this.props.history.push(path.CONSENT_FORM);
    const {
      openDocumentsVerification,
      user_data: {
        basicInfo: { _id }
      }
    } = this.props;

    openDocumentsVerification(_id, purpose);
  };

  openIdProof = e => {
    e.preventDefault();
    this.props.history.push(path.ID_PROOF);
  };

  render() {
    const {
      intl: { formatMessage },
      userData: { documents = {}, basicInfo: { category } = {} }
    } = this.props;
    const {
      isCalendarSynced = false,
      preferences = {}
    } = this.props.userData.settings;
    const {
      emailAlerts = false,
      pushAlerts = false,
      smsAlerts = false,
      reminderAlerts = false
    } = preferences;

    const { idProof = [], consentForm = [] } = documents;
    let idProofUploadDate;
    let consentFormUploadDate;

    const { uploadedOn: idProofUploadedOn } = idProof[0] || {};
    const { uploadedOn: consentFormUploadedOn } = consentForm[0] || {};

    if (idProofUploadedOn)
      idProofUploadDate = new moment(idProofUploadedOn).format(
        "DD/MM/YYYY hh:mm A"
      );
    if (consentFormUploadedOn)
      consentFormUploadDate = new moment(consentFormUploadedOn).format(
        "DD/MM/YYYY hh:mm A"
      );

    const { getFieldDecorator } = this.props.form;
    let accountsContent = [];
    accountsContent.push(
      <div
        key="1"
        className="content-space-between full-width flex align-items-center clickable"
        onClick={this.handleOpenChangePasswordModal}
      >
        <div>{formatMessage(messages.changePassword)}</div>
        <Icon type="caret-right" />
      </div>
    );
    if (config.CALENDAR_SYNC === true) {
      accountsContent.push(
        <div
          key="2"
          className="content-space-between full-width flex align-items-center settings"
        >
          <FormItem className={"mb0"}>
            {getFieldDecorator(SYNCED_CALENDAR, {
              valuePropName: "checked",
              initialValue: isCalendarSynced || false
            })(
              <Checkbox className={"calendar_sync_line settings-checkbox"}>
                <div className="fontsize14 dark">
                  {formatMessage(messages.calendarSynced)}
                </div>
              </Checkbox>
            )}
          </FormItem>
        </div>
      );
    }
    if (category === USER_CATEGORY.PATIENT) {
      accountsContent.push(
        <div
          key="3"
          onClick={e => this.openConsentForm(CONTENTFORM)}
          className="content-space-between full-width flex align-items-center"
        >
          <div className="full-width">
            <div>{formatMessage(messages.consentForm)}</div>
            <div className="fontsize12 cool-grey">{`${formatMessage(
              messages.uploadedOn
            )} ${consentFormUploadDate} `}</div>
          </div>
          <Icon type="caret-right" />
        </div>
      );

      accountsContent.push(
        <div
          key="4"
          onClick={e => this.openConsentForm(IDPROOF)}
          className="content-space-between full-width flex align-items-center"
        >
          <div className="full-width">
            <div>{formatMessage(messages.idProof)}</div>
            <div className="fontsize12 cool-grey">{`${formatMessage(
              messages.uploadedOn
            )} ${idProofUploadDate} `}</div>
          </div>
          <Icon type="caret-right" />
        </div>
      );
    }

    let notificationsContent = [];

    notificationsContent.push(
      <div key={1} className="full-width">
        <div className="content-space-between full-width flex align-items-center settings">
          <FormItem className={"mb0"}>
            {getFieldDecorator(SMS_ALERTS, {
              valuePropName: "checked",
              initialValue: smsAlerts || false
            })(
              <Checkbox className={" calendar_sync_line settings-checkbox"}>
                <div>
                  <div className="fontsize14 dark">
                    {formatMessage(messages.smsAlerts)}
                  </div>
                  <div className="subdued fontsize12">
                    {formatMessage(messages.smsWillBeSent)}
                  </div>
                </div>
              </Checkbox>
            )}
          </FormItem>
        </div>
      </div>
    );
    notificationsContent.push(
      <div key={2} className="full-width">
        <div className="content-space-between full-width flex align-items-center settings">
          <FormItem className={"mb0"}>
            {getFieldDecorator(EMAIL_ALERTS, {
              valuePropName: "checked",
              initialValue: emailAlerts || false
            })(
              <Checkbox className={" calendar_sync_line settings-checkbox"}>
                <div>
                  <div className="fontsize14 dark">
                    {formatMessage(messages.emailAlerts)}
                  </div>
                  <div className="subdued fontsize12">
                    {formatMessage(messages.emailWillBeSent)}
                  </div>
                </div>
              </Checkbox>
            )}
          </FormItem>
        </div>
      </div>
    );
    notificationsContent.push(
      <div key={3} className="full-width">
        <div className="content-space-between full-width flex align-items-center settings">
          <FormItem className={"mb0"}>
            {getFieldDecorator(PUSH_ALERTS, {
              valuePropName: "checked",
              initialValue: pushAlerts || false
            })(
              <Checkbox className={"calendar_sync_line settings-checkbox"}>
                <div>
                  <div className="fontsize14 dark">
                    {formatMessage(messages.pushAlerts)}
                  </div>
                  <div className="fontsize12 subdued">
                    {formatMessage(messages.pushWillBeSent)}
                  </div>
                </div>
              </Checkbox>
            )}
          </FormItem>
        </div>
      </div>
    );

    notificationsContent.push(
      <div key={4} className="full-width">
        <div className="content-space-between full-width flex align-items-center settings">
          <FormItem className={"mb0"}>
            {getFieldDecorator(REMINDERS_ALERTS, {
              valuePropName: "checked",
              initialValue: reminderAlerts || false
            })(
              <Checkbox className={"calendar_sync_line settings-checkbox"}>
                <div>
                  <div className="fontsize14 dark">
                    {formatMessage(messages.reminderAlerts)}
                  </div>
                  <div className="subdued fontsize12">
                    {formatMessage(messages.reminderWillBeSent)}
                  </div>
                </div>
              </Checkbox>
            )}
          </FormItem>
        </div>
      </div>
    );

    return (
      <div id="setting" className="mb180">
        <Element name="settings">
          <div className="bold mt40 pb16 fontsize18">
            {formatMessage(messages.settings)}
          </div>
          {this.props.showPassword && (
            <div>
              <div className={"fontsize16 dark medium pt24 mb5"}>
                {formatMessage(messages.account)}
              </div>
              <List
                span={24}
                bordered
                dataSource={accountsContent}
                renderItem={item => <List.Item>{item}</List.Item>}
              />
            </div>
          )}
          <div className="mt20">
            <div className={"fontsize16 dark medium mb5"}>
              {formatMessage(messages.notifications)}
            </div>
            <List
              span={24}
              bordered
              dataSource={notificationsContent}
              renderItem={item => <List.Item>{item}</List.Item>}
            />
          </div>
        </Element>
      </div>
    );
  }
}

export default injectIntl(SettingSection);
