import { Form, Select, DatePicker } from "antd";
import calender from "../../../../Assets/images/button-select-date.svg";
import dropdownIcon from "../../../../Assets/images/material-icons-black-arrow-drop-down.svg";
import React, { Fragment } from "react";
import messages from "../message";
import moment from "moment";

const Option = Select.Option;
const FormItem = Form.Item;
const MedicationFormElement = ({
  medicine,
  getFieldDecorator,
  products,
  formatMessage,
  selectedItems
}) => {
  let productId = "";
  let uptoDate = "";
  if (medicine) {
    const { product_id = "", upto = "" } = medicine;
    productId = product_id;
    uptoDate = moment(upto);
  }

  const openCalendar = e => {
    e.preventDefault();

    // window.document
    //   .getElementsByClassName("ant-calendar-picker-input")[1]
    //   .click();
  };

  // const children = products.filter(product => {
  //   return !selectedItems.includes(product._id);
  // });

  // const selectedProduct = products.filter(product => {
  //   return product._id === productId;
  // });

  // const selectedProductName = selectedProduct[0] ? selectedProduct[0].name : "";

  const options = [];
  // const option = children.forEach(product => {
  //   options.push(
  //     <Option key={product._id} value={product._id}>
  //       {product.name}{" "}
  //     </Option>
  //   );
  // });

  return (
    <Fragment>
      <div className="mt10">
        {!formatMessage && (
          <div className="fontsize12 label-color  mb8">
            {formatMessage(messages.drugName)}
          </div>
        )}
        <FormItem>
          {getFieldDecorator(`medicine[{index}].product_id`, {
            initialValue: productId
          })(
            <Select placeholder={formatMessage(messages.drugName)}>
              {options}
            </Select>
          )}
        </FormItem>
      </div>
      <div>
        <FormItem>
          {getFieldDecorator(`medicine[{index}].often`, {
            // initialValue: Often
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
        <FormItem>
          {!formatMessage && (
            <div className="fontsize12 label-color  mb8">
              {formatMessage(messages.medicationgivenuntil)}
            </div>
          )}{" "}
          {getFieldDecorator(`medicine.upto`, {
            initialValue: uptoDate
          })(
            <DatePicker
              showToday={false}
              placeholder={formatMessage(messages.medicationgivenuntil)}
            />
          )}
          <img
            alt=""
            className="calendar"
            onClick={openCalendar}
            src={calender}
            // key={index}
          />
        </FormItem>
      </div>
    </Fragment>
  );
};

export default MedicationFormElement;
