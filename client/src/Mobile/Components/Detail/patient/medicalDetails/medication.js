import React, { Component, Fragment } from "react";
import { injectIntl } from "react-intl";
import isEmpty from "lodash-es/isEmpty";
import MedicationDetail from "./medicationDetail";
import messages from "../message";

// function disabledDate(current) {
//   // Can not select days after today
//   return current && current < moment().endOf("day");
// }
// const UpdatedAt = "updatedAt";

class Medication extends Component {
  constructor(props) {
    super(props);
    this.state = {
      IsNew: true,
      selectedItems: []
    };
  }
  componentDidMount() {
    const { medications_data, id } = this.props;
    const medicines = medications_data[id] ? medications_data[id] : [];
    if (medicines.length > 0) {
      const { medicine } = medicines[0];
      const usedProduct = medicine.map(medicine => {
        return medicine.product_id;
      });
      this.setState({ selectedItems: usedProduct });
    }
  }
  handleChange = target => {
    //
    const { selectedItems } = this.state;
    const { target: { index, value } = {} } = target;
    //

    const items = [...selectedItems];
    //
    if (index === items.length) {
      items.push(value);
    } else {
      items[index] = value;
    }
    this.setState({ IsNew: false, selectedItems: items });
  };

  render() {
    const {
      products_data,
      medications_data,
      id,
      pageIs,
      //  mode,
      intl: { formatMessage }
    } = this.props;

    //const { selectedItems } = this.state;
    //
    // let productsData = [];
    // if (products_data) {
    //   productsData = Object.values(products_data);
    // }
    const medications = !isEmpty(medications_data) ? medications_data[id] : {};
    console.log("medications----------------------->", medications);
    let medication = [];
    // let updatedAt ="";
    if (medications.hasOwnProperty("userId")) {
      const { medicine } = medications;
      medication = medicine;
    }

    const { updatedAt, ...medicines } = medication;
    // console.log("medication", medication, updatedAt);

    const medicationId = medication ? Object.keys(medicines) : [];
    const TotalMedication = medications ? Object.keys(medicines).length : 0;

    //

    const medicationDetail = medicationId.map((id, index) => {
      // ("idddddddddddddddddd", id)
      if (id) {
        const medicine = medicines[id];
        //
        // console.log('medicine', medicine)
        return (
          <MedicationDetail
            medicine={medicine}
            index={index}
            total={TotalMedication}
            products={products_data}
            updatedAt={medicine.updateAt}
            formatMessage={formatMessage}
            key={index}
            pageIs={pageIs}
          />
        );
      }
      return null;
    });
    return (
      <Fragment>
        {medicationId.length > 0 ? (
          <div className="basic flex justify-content-start flex-wrap patient-medical-tab-content">
            {medicationDetail}
          </div>
        ) : (
          <div className="basic patient-medical-tab-content">
            {" "}
            {formatMessage(messages.noMedication)}
          </div>
        )}
      </Fragment>
    );
  }
}

const MedicationForm = injectIntl(Medication);

export default MedicationForm;
