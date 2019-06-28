import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import { Form, Input } from "antd";
// import { Tags } from "../../../../Helper/tagify";
import TagInput from "../../../Common/tag";
import { BASICFIELD, PATIENTDASHBOARD, MODE } from "../../../../../constant";
import messages from "../message";

//fields

const isBlank = data => {
  return data.length === 0 ? true : false;
};

class Basic extends Component {
  getTags = (data = []) => {
    let content = [];

    data.forEach((value, index) => {
      if (!isBlank(value)) {
        content.push(
          <span className="iqvia-tag mr8 tag-edit" key={index}>
            {value}
          </span>
        );
      }
    });
    return content;
  };

  render() {
    const {
      basicCondition,
      mode,
      intl: { formatMessage },
      pageIs
    } = this.props;

    let chiefComplaint = "";
    let allergies = "";
    let surgeriesOrFracture = "";
    let others = "";
    if (basicCondition) {
      const {
        chiefComplaint: disease = "",
        allergies: allergy = "",
        surgeriesOrFracture: surgeries = "",
        others: otherCondition = ""
      } = basicCondition;
      chiefComplaint = disease;
      allergies = allergy;
      surgeriesOrFracture = surgeries;
      others = otherCondition;
    }
    let allergiesTags = [];
    let surgeriesOrFractureTags = [];
    let othersTags = [];
    if (allergies) {
      allergiesTags = this.getTags(allergies.split(","));
    }
    if (surgeriesOrFracture) {
      surgeriesOrFractureTags = this.getTags(surgeriesOrFracture.split(","));
    }
    if (others) {
      othersTags = this.getTags(others.split(","));
    }
    //

    const { getFieldDecorator } = this.props.form;
    if (mode === MODE.READ) {
      return (
        <Fragment>
          <div className="basic patient-medical-tab-content">
            {pageIs === PATIENTDASHBOARD && (
              <div className="mt40">
                <span className="fontsize16 medium dark">Basic Details</span>
                <div className="medication-horizontal-line mb16" />
              </div>
            )}
            <div className="flex align-items-center basicField">
              <div className="basicInfo fontsize14 label-color">
                {formatMessage(messages.ChiefComplaint)}
              </div>
              <div className="fontsize14 dark">{chiefComplaint}</div>
            </div>

            <div className="flex align-items-center basicField">
              {allergiesTags.length === 0 ? (
                <div className={"fontsize14 pt8 label-color"}>
                  {formatMessage(messages.noAllergies)}
                </div>
              ) : (
                <div className="flex align-items-center">
                  <div className="basicInfo fontsize14 label-color ">
                    {formatMessage(messages.Allergies)}
                  </div>
                  <div className="flex align-items-center ">
                    <div className="fontsize14 pt8 label-color">
                      {allergiesTags}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex align-items-center basicField">
              {surgeriesOrFractureTags.length === 0 ? (
                <div className={"fontsize14 pt8 label-color"}>
                  {formatMessage(messages.noSurgeries)}
                </div>
              ) : (
                <div className="flex align-items-center">
                  <div className="basicInfo fontsize14 label-color">
                    {formatMessage(messages.SurgeriesOrFractures)}
                  </div>
                  <div className="flex align-items-center">
                    <div className="fontsize14 pt8 label-color">
                      {surgeriesOrFractureTags}
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex align-items-center basicField">
              {othersTags.length === 0 ? (
                <div className={"fontsize14 pt8 label-color"}>
                  {formatMessage(messages.noOtherCondition)}
                </div>
              ) : (
                <div className="flex align-items-center">
                  <div className={"basicInfo fontsize14 label-color"}>
                    {formatMessage(messages.otherCondition)}
                  </div>
                  <div className="flex align-items-center ">
                    <div className="fontsize14 pt8 label-color">
                      {othersTags}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Fragment>
      );
    }
    return (
      <div className="basic patient-medical-tab-content">
        <Form>
          <div className="mt10">
            <Form.Item label={formatMessage(messages.ChiefComplaint)}>
              {getFieldDecorator(BASICFIELD.CHIEF_COMPLAINT, {
                initialValue: chiefComplaint
              })(<Input className="BasicInput" />)}
            </Form.Item>
          </div>
          <div className="mt20 BasicInput">
            <div className="content-space-between pb5">
              <label className={"label-color fontsize12"}>
                {formatMessage(messages.Allergies)}
              </label>
              <div className={"subdued fontsize12"}>
                {formatMessage(messages.useComma)}
              </div>
            </div>
            <TagInput
              initialValue={
                allergies && allergies !== null && allergies !== ""
                  ? allergies.split(",")
                  : []
              }
              getFieldDecorator={getFieldDecorator}
              fieldName={BASICFIELD.ALLERGIES}
            />
          </div>
          <div className="mt20 BasicInput">
            <div className="content-space-between pb5">
              <label className={"label-color fontsize12"}>
                {formatMessage(messages.SurgeriesOrFractures)}
              </label>
              <div className={"subdued fontsize12"}>
                {formatMessage(messages.useComma)}
              </div>
            </div>
            <TagInput
              initialValue={
                surgeriesOrFracture &&
                surgeriesOrFracture !== null &&
                surgeriesOrFracture !== ""
                  ? surgeriesOrFracture.split(",")
                  : []
              }
              getFieldDecorator={getFieldDecorator}
              fieldName={BASICFIELD.SURGERIES_OR_FRACTURE}
            />
          </div>
          <div className="mt20 BasicInput">
            <div className="content-space-between pb5">
              <label className={"label-color fontsize12"}>
                {formatMessage(messages.otherCondition)}
              </label>
              <div className={"subdued fontsize12"}>
                {formatMessage(messages.useComma)}
              </div>
            </div>
            <TagInput
              initialValue={
                others && others !== null && others !== ""
                  ? others.split(",")
                  : []
              }
              getFieldDecorator={getFieldDecorator}
              fieldName={BASICFIELD.OTHERS}
            />
          </div>
        </Form>
      </div>
    );
  }
}

const BasicForm = Form.create()(injectIntl(Basic));

export default BasicForm;
