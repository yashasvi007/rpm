import React from "react";
import { Table } from "antd";
import moment from "moment";
import { injectIntl } from "react-intl";
import messages from "../../message";
import forIn from "lodash-es/forIn";

class AdverseEvent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    console.log("this.props of adverse event-----", this.props);
  }

  getDataSource = () => {
    const {
      adverseEvent = [],
      products = {},
      intl: { formatMessage }
    } = this.props;

    return adverseEvent.map(value => {
      const {
        _id,
        details: { on, description, medications = [], severity, docs }
      } = value;
      const medicine = medications[0] || {};
      let medicineTag = [];
      //
      forIn(medicine, (value, key) => {
        const { product_id } = value;
        const productDetail = products[product_id] || {};
        //
        const { name } = productDetail;
        medicineTag.push(<div key={key}>{name} </div>);
      });

      return {
        key: _id,
        dateTime: (
          <div className="table-coloumn">
            {moment(on).format("DD/MM/YYYY LT")}
          </div>
        ),
        severity: (
          <div className="table-coloumn">
            {formatMessage(messages[severity])}
          </div>
        ),
        medicationTaken: (
          <div className="table-coloumn black">{medicineTag}</div>
        ),
        description: (
          <div className="table-coloumn description">
            {description}
            {docs.length > 0 ? (
              <div
                className="dark bold adverse-event-image-link"
                onClick={() => this.handleOpenModal(_id)}
              >
                View Images
              </div>
            ) : (
              ""
            )}
          </div>
        )
      };
    });
  };

  handleOpenModal = adverseEventId => {
    const { openAdverseEventImageModal, userId } = this.props;
    openAdverseEventImageModal(userId, adverseEventId);
  };

  getColumn() {
    return [
      {
        title: "Date & Time",
        dataIndex: "dateTime",
        key: "dateTime",
        className: "bg-white-10"
      },
      {
        title: "Medication Taken",
        dataIndex: "medicationTaken",
        key: "medicationTaken",
        className: "bg-white-10"
      },
      {
        title: "Severity",
        dataIndex: "severity",
        key: "severity",
        className: "bg-white-10"
      },
      {
        title: "Description",
        dataIndex: "description",
        key: "description",
        className: "bg-white-10"
      }
    ];
  }

  render() {
    const { getDataSource, getColumn } = this;
    return (
      <Table
        size="small"
        className="adverse-event-table patient-medical-tab-content"
        dataSource={getDataSource()}
        locale={{ emptyText: "No adverse events reported" }}
        columns={getColumn()}
      />
    );
  }
}

export default injectIntl(AdverseEvent);
