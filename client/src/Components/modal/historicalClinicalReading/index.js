import React, { Component } from "react";
import { Modal, Button, Tabs, Table } from "antd";
import { injectIntl } from "react-intl";
import forIn from "lodash-es/forIn";

import { doRequest } from "../../../Helper/network";
import { User } from "../../../Helper/urls";
import { REQUEST_TYPE } from "../../../constant";
import messages from "./message";

const Json2csvParser = require("json2csv").Parser;
const fileDownload = require("js-file-download");
const moment = require("moment");

const flatter = ({ updatedAt, data }) => {
  const updatedOnDate = moment(updatedAt).format("L");
  const updatedOnTime = moment(updatedAt).format("LT");

  let flatObj = { date: `${updatedOnDate}, ${updatedOnTime}` };
  forIn(data, (value, key) => {
    forIn(value, (v, k) => {
      Object.assign(flatObj, { [`${key}.${k}`]: v });
    });
  });
  return flatObj;
};

const getSuffixRow = template => {
  let suffixRow = { date: " " };
  let headerRow = { date: "Date & Time" };
  forIn(template, (value, key) => {
    const header = value.label;
    if (value.content) {
      const suffix = value.content.suffix;
      forIn(value.content, (v, k) => {
        if (k !== "suffix") {
          Object.assign(headerRow, { [`${key}.${k}`]: `${header} ${v}` });
          Object.assign(suffixRow, { [`${key}.${k}`]: suffix });
        }
      });
    } else {
      Object.assign(headerRow, { [`${key}`]: `${header}` });
      Object.assign(suffixRow, { [`${key}`]: `${value.suffix}` });
    }
  });
  return { suffixRow, headerRow };
};

class HistoricalClinicalReading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clinicalReadingsAndTemplates: null,
      clinicalData: null,
      activeKey: "0",
      testTemplates: {}
    };
  }
  componentDidUpdate() {
    const { clinicalReadingsAndTemplates, clinicalData } = this.state;
    if (this.props.show && !clinicalReadingsAndTemplates) {
      const url = User.getHistoricalClinicalReadingURL(this.props.patientId);
      this.setState({
        clinicalReadingsAndTemplates: doRequest({
          method: REQUEST_TYPE.GET,
          url: url
        })
      });
    } else if (
      this.props.show &&
      !clinicalData &&
      Promise.resolve(clinicalReadingsAndTemplates) ===
        clinicalReadingsAndTemplates
    ) {
      clinicalReadingsAndTemplates.then(response => {
        this.setState({
          testTemplates: response.payload.data.clinicalTestTemplates
        });
        const clinicalData = this.getDataAndHeader(
          response.payload.data.clinicalReadings
        );
        this.setState({ clinicalData });
      });
    } else if (!this.props.show && clinicalData) {
      this.setState({
        clinicalReadingsAndTemplates: null,
        clinicalData: null,
        testTemplates: {}
      });
    }
  }
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
    const { clinicalData, activeKey } = this.state;
    const { dataSource, columns } = clinicalData[activeKey];
    const columnKeys = columns.map(column => {
      return column.title;
    });
    const csvHeader = new Json2csvParser({ fields: columnKeys }).parse();
    const csvBody = new Json2csvParser({ header: false }).parse(dataSource);
    const csv = csvHeader + "\n" + csvBody;
    fileDownload(csv, `${this.props.patientId}_clinical_readings.csv`);
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

  getDataAndHeader = clinicalReadings => {
    const allTests = Object.keys(clinicalReadings);
    const clinicalDataSet = allTests.map(test => {
      const { suffixRow, headerRow } = getSuffixRow(
        this.state.testTemplates[test].content
      );
      let listOfReading = [...clinicalReadings[test]];
      let dataSource = listOfReading.reverse().map(row => {
        return flatter(row);
      });
      dataSource.unshift(suffixRow);
      let columns = [];
      forIn(headerRow, (value, key) => {
        columns.push({
          title: value,
          key: key,
          dataIndex: key
        });
      });
      return { testName: test, dataSource, columns };
    });
    return clinicalDataSet;
  };

  onActiveKeyChange = activeKey => {
    this.setState({ activeKey });
  };

  render() {
    const {
      show: visible,
      isError,
      intl: { formatMessage }
    } = this.props;

    const { clinicalData } = this.state;
    const { handleCancel, footer } = this;

    const modalProps = {
      visible: visible || isError,
      title: formatMessage(messages.historical_clinical_reading),
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
    if (!clinicalData) {
      return <div>Loader</div>;
    }

    const allTests = Object.keys(clinicalData);
    return (
      <Modal {...modalProps}>
        <div className="pl40 pr40">
          <Tabs
            activeKey={this.state.activeKey}
            onChange={this.onActiveKeyChange}
          >
            {allTests.map((test, index) => {
              const { dataSource, columns, testName } = clinicalData[test];

              return (
                <Tabs.TabPane
                  className="test-tabs"
                  tab={testName}
                  key={index.toString()}
                >
                  <Table
                    size="small"
                    className="history-table"
                    dataSource={dataSource}
                    columns={columns}
                  />
                </Tabs.TabPane>
              );
            })}
          </Tabs>
        </div>
      </Modal>
    );
  }
}

export default injectIntl(HistoricalClinicalReading);
