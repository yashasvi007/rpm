import React, { Fragment, Component } from "react";
import moment from "moment";
import {
  Document,
  Page,
  Text,
  View,
  Font,
  StyleSheet,
  PDFDownloadLink
} from "@react-pdf/renderer";
import isEmpty from "lodash-es/isEmpty";
import config from "../../../../config";

import "../../style.less";
import messages from "../message";

// ('__dirname', __dirname)
Font.register(
  `${config.BASE_URL}/static/media/AvenirNext-Regular.1f1c6c50.ttf`,
  { family: "AvenirNext-Regular" }
);

const styles = StyleSheet.create({
  medicine: {
    color: "#2b3a42",
    fontFamily: "AvenirNext-Regular",
    fontSize: "14pt",
    fontWeight: " 600"
  },
  lastUpadate: {
    color: "#aab0b3",
    fontFamily: "AvenirNext-Regular",
    fontSize: "12pt",
    marginLeft: "16cm"
  },
  heading: {
    color: "#7f888d",
    fontFamily: "AvenirNext-Regular",
    fontSize: "12pt"
  },
  content: {
    color: "#2b3a42",
    fontFamily: "AvenirNext-Regular",
    fontSize: "14pt",
    marginBottom: "14pt"
  },
  horizontalLine: {
    height: "4pt",
    background: "rgba(212, 215, 217, 0.3)"
  },
  starting: {
    margin: "16pt 0 0 0"
  }
});

let LOADING = true;

export default class Medication extends Component {
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    //
    return !LOADING;
  }

  generateResponse = () => {
    const {
      id,
      products_data: products,
      medications_data,
      intl: { formatMessage }
    } = this.props;

    const medications = !isEmpty(medications_data) ? medications_data[id] : {};

    let medication = [];
    // let updatedAt ="";

    if (medications.hasOwnProperty("userId")) {
      const { medicine } = medications;
      medication = medicine;
    }

    const { updatedAt, ...medicines } = medication;

    const medicationId = medication ? Object.keys(medicines) : [];
    const total = medications ? Object.keys(medicines).length : 0;

    return (
      <Document>
        <Page>
          {medicationId.map((id, index) => {
            if (id) {
              const medicine = medicines[id];
              const { product_id, often, upto } = medicine;
              const medicatedTill = moment(upto).format("L");

              const daysLeftForMedication =
                moment().diff(upto, "days", false) * -1;

              let productsData = [];
              if (products) {
                productsData = Object.values(products);
              }
              const product = productsData.filter(product => {
                return product._id === product_id;
              });

              const updatedOnDate = moment(updatedAt).format("L");

              const updatedOnTime = moment(updatedAt).format("LT");

              const { name, volume: { strength } = {} } = product[0];
              return (
                <Fragment key={index}>
                  <View style={{ marginLeft: "24pt" }}>
                    <Text style={[styles.starting, { marginTop: "24pt" }]}>
                      <Text style={styles.medicine}>
                        {formatMessage(messages.medicine)} {index + 1} of{" "}
                        {total}
                      </Text>
                      <Text style={styles.lastUpadate}>
                        {`   ${formatMessage(messages.lastmedicatedon)}`}{" "}
                        {updatedOnDate},{updatedOnTime}
                      </Text>
                    </Text>
                    <Text style={styles.horizontalLine} />
                    <Text style={styles.heading}>
                      {formatMessage(messages.drugName)}
                    </Text>
                    <Text style={styles.content}>
                      {name} {strength}mg
                    </Text>
                    <Text style={styles.content}>{often}</Text>
                    <Text style={styles.heading}>
                      {formatMessage(messages.medicationgivenuntil)}
                    </Text>
                    <Text style={styles.content}>
                      {medicatedTill},{" "}
                      {daysLeftForMedication > 0
                        ? `${daysLeftForMedication} ${formatMessage(
                            messages.daysremaining
                          )}`
                        : `Expired`}{" "}
                    </Text>
                  </View>
                </Fragment>
              );
            }
            return null;
          })}
        </Page>
      </Document>
    );
  };

  render() {
    const {
      user_data: {
        basicInfo: { name }
      }
    } = this.props;
    return (
      <PDFDownloadLink
        document={this.generateResponse()}
        fileName={`${name}-medication.pdf`}
      >
        {({ blob, url, loading, error }) =>
          loading ? "Loading document..." : "Download Medication"
        }
      </PDFDownloadLink>
    );
  }
}

export const Output = props => {
  return (
    <Document>
      <Medication {...props} />
    </Document>
  );
};

// ReactPDF.render(<Output />, `${__dirname}/output.pdf`);
