import React, { Component } from "react";
import { Modal, Button, Form, Select, DatePicker } from "antd";
import { injectIntl } from "react-intl";
import moment from "moment";
import "../style.less";
import messages from "./message";
import calendar from "../../../Assets/images/button-select-date.svg";
import dropdownIcon from "../../../Assets/images/material-icons-black-arrow-drop-down.svg";

const FormItem = Form.Item;
const Option = Select.Option;
const EDIT = "EDIT";
const UserID = "userId";

function disabledDate(current) {
  // Can not select days after today
  return current && current < moment().endOf("day");
}

class Medication extends Component {
  handleCancel = e => {
    if (e) {
      e.preventDefault();
    }
    const { close } = this.props;
    close();
  };

  openCalendar = e => {
    e.preventDefault();
    window.document
      .getElementsByClassName("ant-calendar-picker-input")[0]
      .click();
  };

  handleRemove = e => {
    if (e) {
      e.preventDefault();
    }
    const { removeMedication, patientId: userId, productId } = this.props;
    removeMedication(productId, userId);
    const { close } = this.props;
    close();
  };

  handleSubmit = e => {
    e.preventDefault();
    const { addMedication, close } = this.props;
    // const { selectedDays } = this.state;
    const { patientId: userId } = this.props;

    this.props.form.validateFields((err, values) => {
      //
      if (!err) {
        addMedication(values, userId);
      }
    });

    close();
  };

  formatMessage = data => this.props.intl.formatMessage(data);

  footer = () => {
    const { requesting, purpose } = this.props;
    const { formatMessage, handleCancel, handleRemove } = this;
    return (
      <div
        className={`flex align-items-center ${
          purpose === EDIT
            ? "justify-content-space-between"
            : "justify-content-end"
        }  h72px mr24 ml24`}
      >
        {purpose === EDIT && (
          <Button
            className="iqvia-btn warning remove"
            type="primary"
            loading={requesting}
            onClick={handleRemove}
          >
            {formatMessage(messages.remove)}
          </Button>
        )}
        <div className="flex align-items-center justify-content-end">
          <Button className="iqvia-btn cancel mr8" onClick={handleCancel}>
            {formatMessage(messages.cancel)}
          </Button>
          <Button
            type="primary iqvia-btn"
            htmlType="submit"
            onClick={this.handleSubmit}
          >
            {formatMessage(messages.submit)}
          </Button>
        </div>
      </div>
    );
  };

  render() {
    const {
      show: visible,
      isError,
      intl: { formatMessage },
      products_data,
      medications_data,
      productId: toBeEdited,
      patientId: id,
      purpose,
      productIds = []
    } = this.props;
    let productId = "";
    let Often = "";
    let uptoDate = moment();

    if (visible === false) {
      return null;
    }

    // let productsData = [];
    // if (products_data) {
    //   productsData = Object.values(products_data);
    // }
    const { getFieldDecorator } = this.props.form;
    let selectedItems = [];
    // (
    //   "================aslmfpamspf",
    // medications_data,
    // id,
    // medications_data[id]
    //   toBeEdited
    // );

    let updateAt = "";
    let totalMedicine = [];
    let index = [];
    if (medications_data.hasOwnProperty(id)) {
      const medication = medications_data[id];

      if (medication.hasOwnProperty(UserID)) {
        //
        const { medicine: medicines } = medication;
        const { updatedAt, ...medicine } = medicines;
        updateAt = updatedAt;

        selectedItems = Object.keys(medicine);
        // ("++++++++++++++++++++medicine+++++",selectedItems, medicine )

        if (purpose === EDIT) {
          if (selectedItems.length > 0) {
            // (
            //   "++++++++++++++++++++medicine+++++",
            //   selectedItems,
            //   medicine[toBeEdited]
            // );
            totalMedicine = selectedItems.length;
            index = selectedItems.indexOf(toBeEdited);

            const { often = "", upto = "" } = medicine[toBeEdited];
            productId = toBeEdited;
            Often = often;
            uptoDate = moment(upto);
            selectedItems = [];
            // (
            //   "===============---------------------**********",
            //   medicine,
            // medications_data[id],
            // productId,
            // often
            // upto
            // );
          }
        }
      }
    }

    const options = productIds
      .filter(val => {
        if (selectedItems.includes(val)) {
          return false;
        } else {
          return true;
        }
      })
      .map(product => {
        const productDetail = products_data[product] || {};
        return (
          <Option key={product} value={product}>
            {productDetail.name}
          </Option>
        );
      });

    const updatedOnDate = moment(updateAt).format("L");

    const updatedOnTime = moment(updateAt).format("LT");

    const { handleCancel, footer, openCalendar } = this;
    const title =
      purpose === EDIT
        ? formatMessage(messages.updatemedication)
        : formatMessage(messages.addmedication);

    const modalProps = {
      visible: visible || isError,
      title: title,
      okButtonProps: {},
      onCancel: handleCancel,
      wrapClassName: "global-modal full-height",
      destroyOnClose: true,
      bodyStyle: { height: "100%" },
      width: "480px",
      footer: footer()
    };
    return (
      <Modal {...modalProps}>
        <div className="pl48 pr24">
          {purpose === EDIT && (
            <div className="fontsize12 label-color mb16">
              <span className="fontsize14 bold dark mr8">
                {formatMessage(messages.medicine)} {index + 1}{" "}
                {formatMessage(messages.of)} {totalMedicine}
              </span>{" "}
              {formatMessage(messages.lastmedicatedon)} {updatedOnDate},{" "}
              {updatedOnTime}
            </div>
          )}
          <Form className="event-form">
            <div className="mt10">
              <div className="fontsize12 label-color  mb8">
                {formatMessage(messages.drugName)}
              </div>
              <FormItem>
                {getFieldDecorator(`product_id`, {
                  initialValue: productId
                })(
                  <Select
                    placeholder={formatMessage(messages.drugName)}
                    suffixIcon={<img alt="" src={dropdownIcon} />}
                    disabled={purpose === EDIT}
                  >
                    {options}
                  </Select>
                )}
              </FormItem>
            </div>
            <FormItem label={formatMessage(messages.dosageInterval)}>
              {getFieldDecorator(`often`, {
                initialValue: Often
              })(
                <Select
                  placeholder={formatMessage(messages.howOften)}
                  suffixIcon={<img alt="" src={dropdownIcon} />}
                >
                  <Option key="Daily Once">DailyOnce</Option>
                  <Option key="Weekly Twice">WeeklyTwice</Option>
                </Select>
              )}
            </FormItem>
            <div className="fontsize12 label-color  mb8">
              {formatMessage(messages.medicationgivenuntil)}
            </div>
            <div className="flex-1 flex row align-items-end iqvia-date-picker">
              <div className="full-width ">
                <FormItem>
                  {getFieldDecorator(`upto`, {
                    initialValue: uptoDate
                  })(
                    <DatePicker
                      format="DD/MM/YYYY, ddd"
                      showToday={false}
                      className="full-width"
                      suffixIcon={null}
                      disabledDate={disabledDate}
                      placeholder={formatMessage(messages.medicationgivenuntil)}
                    />
                  )}
                  <img
                    alt=""
                    className="calendar"
                    onClick={openCalendar}
                    src={calendar}
                  />
                </FormItem>
              </div>
            </div>
          </Form>
        </div>
      </Modal>
    );
  }
}

export default Form.create()(injectIntl(Medication));
