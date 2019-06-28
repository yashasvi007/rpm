import React from "react";
import moment from "moment";
import messages from "../message";

const PATIENTDASHBOARD = "patient-dashboard";
const MedicationDetail = ({
  medicine,
  index,
  total,
  products,
  updatedAt,
  formatMessage,
  pageIs
}) => {
  const { product_id, often, upto } = medicine;
  const medicatedTill = moment(upto).format("L");
  const daysLeftForMedication = moment().diff(upto, "days") * -1;

  let productsData = [];
  if (products) {
    productsData = Object.values(products);
  }
  const product = productsData.filter(product => {
    return product._id === product_id;
  });
  const updatedOnDate = moment(updatedAt);

  const { name, volume: { strength } = {} } = product[0];

  return (
    <div
      className={
        pageIs === PATIENTDASHBOARD
          ? "mt40 medication-details "
          : "medication-details"
      }
    >
      <div className="flex align-items-center mb8">
        <div className="fontsize14 dark bold">
          {formatMessage(messages.medicine)} {index + 1} of {total}
        </div>
        <div className="fontsize12 label-color ml8">
          {`${formatMessage(messages.lastmedicatedon)} ${updatedOnDate.format(
            "DD/MM/YYYY hh:mm A"
          )}`}
        </div>
      </div>
      {pageIs === PATIENTDASHBOARD && (
        <div className="medication-horizontal-line " />
      )}
      <div className="fontsize12 label-color">
        {formatMessage(messages.drugName)}
      </div>
      <div className="fontsize14 dark mb16">
        {name} {strength}mg
      </div>
      <div className="fontsize14 dark mb16">{often}</div>
      <div className="fontsize12 label-color">
        {formatMessage(messages.medicationgivenuntil)}
      </div>
      <div className="fontsize14 dark mb30">
        {medicatedTill},{" "}
        {daysLeftForMedication + 1 > 0
          ? `${daysLeftForMedication + 1} ${formatMessage(
              messages.daysremaining
            )}`
          : `Expired`}{" "}
      </div>
    </div>
  );
};

export default MedicationDetail;
