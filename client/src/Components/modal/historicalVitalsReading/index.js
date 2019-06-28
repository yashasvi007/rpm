import React, { Component } from "react";
import { Modal, Button, Table } from "antd";
import { injectIntl } from "react-intl";
import forIn from "lodash-es/forIn";
import clone from "lodash-es/cloneDeep";
import isEqual from "lodash-es/isEqual";

import { doRequest } from "../../../Helper/network";
import { User } from "../../../Helper/urls";
import { REQUEST_TYPE, VITALFIELD } from "../../../constant";
import messages from "./message";

const Json2csvParser = require("json2csv").Parser;
const fileDownload = require("js-file-download");
const moment = require("moment");

class HistoricalVitalsReading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vitalsPromise: null,
      vitals: null
    };
  }
  componentDidUpdate(prevProps, prevState) {
    const { vitals, vitalsPromise } = this.state;
    const newProps = clone(this.props);
    if (this.props.show && !vitalsPromise && !isEqual(newProps, prevProps)) {
      const url = User.getHistoricalVitalsReadingURL(this.props.patientId);
      this.setState({
        vitalsPromise: doRequest({
          method: REQUEST_TYPE.GET,
          url: url
        })
      });
    } else if (
      this.props.show &&
      !vitals &&
      Promise.resolve(vitalsPromise) === vitalsPromise
    ) {
      vitalsPromise.then(response => {
        const vitals = this.parseVitals(response.payload.data.vitals);
        this.setState({ vitals });
      });
    } else if (!this.props.show && vitals) {
      this.setState({ vitalsPromise: null, vitals: null });
    }
  }

  parseVitals = vitals => {
    let parsedVitals = vitals.map(vital => {
      const {
        temperatureUnit,
        temperature,
        respirationRate,
        pulse,
        bloodPressure,
        updatedAt
      } = vital;
      let temperatureValInC, temperatureValInF;
      if (temperatureUnit === VITALFIELD.TEMPERATURE_UNIT_C) {
        temperatureValInF = Math.round(temperature * (9 / 5) + 32);
        temperatureValInC = temperature;
      }
      if (temperatureUnit === VITALFIELD.TEMPERATURE_UNIT_F) {
        temperatureValInF = temperature;
        temperatureValInC = Math.round((temperature - 32) * (5 / 9));
      }
      const newTemp =
        temperatureValInC && temperatureValInF
          ? `${temperatureValInC}/${temperatureValInF}`
          : undefined;
      return {
        updatedAt: updatedAt ? moment(updatedAt).format("DD-MM-YYYY") : "",
        temperature: newTemp,
        respirationRate,
        pulse,
        bloodPressure
      };
    });
    parsedVitals = parsedVitals.reverse();
    const suffix = {
      updatedAt: "",
      temperature: "℃/℉",
      respirationRate: "breathe per minute",
      pulse: "bpm",
      bloodPressure: "systolic/diastolic in mmHg"
    };
    const header = {
      updatedAt: "Updated At",
      temperature: "Temperature",
      respirationRate: "Respiration Rate",
      pulse: "Pulse",
      bloodPressure: "Blood Pressure"
    };
    parsedVitals.unshift(suffix);
    let columns = [];
    forIn(header, (value, key) => {
      columns.push({
        title: value,
        key: key,
        dataIndex: key
      });
    });
    parsedVitals = parsedVitals.filter(vitals => {
      const { temperature, respirationRate, pulse, bloodPressure } = vitals;
      return temperature && respirationRate && pulse && bloodPressure;
    });
    return { dataSource: parsedVitals, columns };
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
    const { vitals } = this.state;
    const { dataSource, columns } = vitals;
    const columnKeys = columns.map(column => {
      return column.title;
    });
    const csvHeader = new Json2csvParser({ fields: columnKeys }).parse();
    const csvBody = new Json2csvParser({ header: false }).parse(dataSource);
    const csv = csvHeader + "\n" + csvBody;
    fileDownload(csv, `${this.props.patientId}_vitals.csv`);
  };

  footer = () => {
    const { requesting } = this.props;
    const { formatMessage, handleCancel, handleDownloadAsCSV } = this;
    return (
      <div className="flex align-items-center justify-content-end h72px mr24">
        <Button className="iqvia-btn cancel mr8" onClick={handleCancel}>
          {formatMessage(messages.close)}
        </Button>
        <Button
          className="iqvia-btn"
          type="primary"
          loading={requesting}
          onClick={handleDownloadAsCSV}
        >
          {formatMessage(messages.download_csv)}
        </Button>
      </div>
    );
  };

  render() {
    const {
      show: visible,
      isError,
      intl: { formatMessage }
    } = this.props;

    const { vitals } = this.state;
    const { handleCancel, footer } = this;

    const modalProps = {
      visible: visible || isError,
      title: formatMessage(messages.historical_vitals_reading),
      okButtonProps: {},
      onCancel: handleCancel,
      wrapClassName: "global-modal full-height",
      destroyOnClose: true,
      bodyStyle: { height: "100%" },
      width: "700px",
      footer: footer()
    };

    if (!visible) {
      return null;
    }
    if (!vitals) {
      return <div>Loader</div>;
    }

    const { dataSource, columns } = vitals;

    return (
      <Modal {...modalProps}>
        <div className="pl40 pr40">
          <Table
            size="small"
            className="history-table vitals-history-table"
            dataSource={dataSource}
            columns={columns}
          />
        </div>
      </Modal>
    );
  }
}

export default injectIntl(HistoricalVitalsReading);
