import React, { Component } from "react";
import { Modal, Button, Table } from "antd";
import { injectIntl } from "react-intl";
import forIn from "lodash-es/forIn";

import { doRequest } from "../../../Helper/network";
import { User } from "../../../Helper/urls";
import { REQUEST_TYPE } from "../../../constant";
import messages from "./message";

const Json2csvParser = require("json2csv").Parser;
const fileDownload = require("js-file-download");

class HistoricalMedicationData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      medicationPromise: null,
      medication: null,
      noData: false
    };
  }
  componentDidUpdate() {
    const { medication, medicationPromise, noData } = this.state;
    if (this.props.show && !medicationPromise) {
      const url = User.getHistoricalMedicationDataURL(this.props.patientId);
      this.setState({
        medicationPromise: doRequest({
          method: REQUEST_TYPE.GET,
          url: url
        })
      });
    } else if (
      this.props.show &&
      !(medication || noData) &&
      Promise.resolve(medicationPromise) === medicationPromise
    ) {
      medicationPromise.then(response => {
        if (response.payload.message !== "No Medication") {
          const medication = this.parseMedication(
            response.payload.data.medications
          );
          this.setState({ medication: medication.reverse() });
        } else {
          this.setState({ noData: true });
        }
      });
    } else if (!this.props.show && medication) {
      this.setState({
        medicationPromise: null,
        medication: null,
        noData: false
      });
    }
  }

  parseMedication = medication => {
    let parsedMedication = medication.map(med => {
      let i = 1;
      const newMed = {};
      forIn(med, (value, key) => {
        if (key !== "updatedAt") {
          Object.assign(newMed, { [`med${i}`]: value });
          i = i + 1;
        }
      });
      Object.assign(newMed, { updatedAt: med.updatedAt });
      return newMed;
    });
    parsedMedication = parsedMedication.filter(
      medication => Object.keys(medication).length > 1
    );
    return parsedMedication;
  };

  formatMessage = data => this.props.intl.formatMessage(data);
  handleCancel = e => {
    if (e) {
      e.preventDefault();
    }
    const { close } = this.props;
    close();
  };

  handleDownloadAsCSV = e => {
    e.preventDefault();
    const { medication } = this.state;

    const noOfMedicines = medication.map(datum => {
      return Object.keys(datum).length;
    });
    const noOfColumns = Math.max(...noOfMedicines);
    let header = ["UpdatedAt"];
    for (let i = 1; i < noOfColumns; i++) {
      header = header.concat(["Product", "Often", "Upto"]);
    }

    let flatMedication = medication.map(med => {
      const singleMedication = { updatedAt: med.updatedAt };
      forIn(med, (value, key) => {
        if (key !== "updatedAt") {
          forIn(value, (v, k) => {
            Object.assign(singleMedication, { [`${key}.${k}`]: v });
          });
        }
      });
      return singleMedication;
    });
    const csvHeader = new Json2csvParser({ fields: header }).parse();
    const csvBody = new Json2csvParser({ header: false }).parse(flatMedication);
    const csv = csvHeader + "\n" + csvBody;
    fileDownload(csv, `${this.props.patientId}_medication.csv`);
  };

  footer = () => {
    const { requesting } = this.props;
    const { formatMessage, handleCancel, handleDownloadAsCSV } = this;
    return (
      <div className="flex align-items-center justify-content-end h72px mr24">
        <Button className="iqvia-btn cancel mr8" onClick={handleCancel}>
          {formatMessage(messages.close)}
        </Button>
        {this.state.noData ? (
          <Button
            className="iqvia-btn"
            type="primary"
            disabled
            loading={requesting}
            onClick={handleDownloadAsCSV}
          >
            {formatMessage(messages.download_csv)}
          </Button>
        ) : (
          <Button
            className="iqvia-btn"
            type="primary"
            loading={requesting}
            onClick={handleDownloadAsCSV}
          >
            {formatMessage(messages.download_csv)}
          </Button>
        )}
      </div>
    );
  };

  cols = num => {
    let columns = [
      {
        title: "Updated At",
        key: "updatedAt",
        dataIndex: "updatedAt",
        width: 70
      }
    ];
    for (let i = 1; i < num; i++) {
      columns.push({
        title: `Medicine ${i}`,
        key: `medicine${i}`,
        children: [
          {
            title: "Product",
            width: num === 1 ? 110 : 80,
            dataIndex: `med${i}.name`
          },
          {
            title: "Often",
            width: num === 1 ? 110 : 80,
            dataIndex: `med${i}.often`
          },
          {
            title: "Upto",
            width: num === 1 ? 110 : 80,
            dataIndex: `med${i}.upto`
          }
        ]
      });
    }
    return columns;
  };

  render() {
    const {
      show: visible,
      isError,
      intl: { formatMessage }
    } = this.props;

    const { medication, noData } = this.state;
    const { handleCancel, footer } = this;

    const modalProps = {
      visible: visible || isError,
      title: formatMessage(messages.historical_medication_data),
      okButtonProps: {},
      onCancel: handleCancel,
      wrapClassName: "global-modal full-height",
      destroyOnClose: true,
      bodyStyle: { height: "100%" },
      width: "100%",
      footer: footer()
    };

    if (!visible) {
      return null;
    }
    if (noData) {
      return (
        <Modal {...modalProps}>
          <div className="pl40 pr40">Nothing to show</div>
        </Modal>
      );
    }
    if (!medication) {
      return <div>Loader</div>;
    }

    const data = medication;

    const noOfMedicines = data.map(datum => {
      return Object.keys(datum).length;
    });

    const noOfColumns = Math.max(...noOfMedicines);
    const columns = this.cols(noOfColumns);
    return (
      <Modal {...modalProps}>
        <div className="pl40 pr40">
          <Table
            size="small"
            bordered={true}
            scroll={{ x: noOfColumns * 330 }}
            className="medication-table"
            dataSource={data}
            columns={columns}
          />
        </div>
      </Modal>
    );
  }
}

export default injectIntl(HistoricalMedicationData);
