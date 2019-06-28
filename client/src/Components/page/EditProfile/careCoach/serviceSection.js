import React, { Component } from "react";
import { Form, List, Checkbox } from "antd";
import { Element } from "react-scroll";
import { injectIntl } from "react-intl";
import messages from "../message";
const FormItem = Form.Item;

//fields
const MEDICAL_SERVICES = "services.medicalServices";
const NURSING = "services.homeHealthCare.nursing";
const PHYSICAL_THERAPY = "services.homeHealthCare.physicalTherapy";
const OCCUPATIONAL_THERAPY = "services.homeHealthCare.occupationalTherapy";
const SPEECH_PATHOLOGY = "services.homeHealthCare.speechPathology";
const MEDICAL_COUNSELLING = "services.homeHealthCare.medicalCounselling";
const HEALTH_AIDE = "services.homeHealthCare.healthAide";
const CARDIAC_CARE = "services.specialCare.cardiacCare";
const DIABETES_CARE = "services.specialCare.diabetesCare";
const SMOKING_CESSATION = "services.specialCare.smokingCessation";
const RESPITE_CARE = "services.nonMedicalServices.respiteCare";
const HOME_MAKING = "services.nonMedicalServices.homemaking";

class ServiceSection extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      intl: { formatMessage }
    } = this.props;

    const { getFieldDecorator } = this.props.form;

    const {
      medicalServices = false,
      homeHealthCare = {},
      specialCare = {},
      nonMedicalServices = {}
    } = this.props.userData.services;

    const homeHealthCareServices = [
      {
        key: NURSING,
        title: formatMessage(messages.nursingTitle),
        value: homeHealthCare.nursing || false,
        subtitle: formatMessage(messages.nursing)
      },
      {
        key: PHYSICAL_THERAPY,
        title: formatMessage(messages.physicalTherapyTitle),
        value: homeHealthCare.physicalTherapy || false,
        subtitle: formatMessage(messages.physicalTherapy)
      },
      {
        key: OCCUPATIONAL_THERAPY,
        title: formatMessage(messages.occupationalTherapyTitle),
        value: homeHealthCare.occupationalTherapy || false,
        subtitle: formatMessage(messages.occupationalTherapy)
      },
      {
        key: SPEECH_PATHOLOGY,
        title: formatMessage(messages.speechAndLanguagePathologyTitle),
        value: homeHealthCare.speechPathology || false,
        subtitle: formatMessage(messages.speechAndLanguagePathology)
      },
      {
        key: MEDICAL_COUNSELLING,
        title: formatMessage(messages.medicalCounsellingTitle),
        value: homeHealthCare.medicalCounselling || false,
        subtitle: formatMessage(messages.medicalCounselling)
      },
      {
        key: HEALTH_AIDE,
        title: formatMessage(messages.healthAideTitle),
        value: homeHealthCare.healthAide || false,
        subtitle: formatMessage(messages.healthAide)
      }
    ];

    const specialCareValues = [
      {
        key: CARDIAC_CARE,
        title: formatMessage(messages.cardiacCareTitle),
        value: specialCare.cardiacCare || false,
        subtitle: formatMessage(messages.cardiacCare)
      },
      {
        key: DIABETES_CARE,
        title: formatMessage(messages.diabetesCareTitle),
        value: specialCare.diabetesCare || false,
        subtitle: formatMessage(messages.diabetesCare)
      },
      {
        key: SMOKING_CESSATION,
        title: formatMessage(messages.smokingCessationTitle),
        value: specialCare.smokingCessation || false,
        subtitle: formatMessage(messages.smokingCessation)
      }
    ];

    const nonMedicalService = [
      {
        key: RESPITE_CARE,
        title: formatMessage(messages.respiteCareTitle),
        value: nonMedicalServices.respiteCare || false,
        subtitle: formatMessage(messages.respiteCare)
      },
      {
        key: HOME_MAKING,
        title: formatMessage(messages.homemakingTitle),
        value: nonMedicalServices.homeMaking || false,
        subtitle: formatMessage(messages.homemaking)
      }
    ];

    let homeHealthCareServiceContent = [];

    homeHealthCareServices.forEach((data, index) => {
      homeHealthCareServiceContent.push(
        <div key={index} className="full-width">
          <div className="content-space-between full-width flex align-items-center settings">
            <FormItem className={"mb0"}>
              {getFieldDecorator(data.key, {
                rules: [],
                valuePropName: "checked",
                initialValue: data.value
              })(
                <Checkbox className={"calendar_sync_line settings-checkbox"}>
                  <div>
                    <div className="fontsize14 dark">{data.title}</div>
                    <div className="subdued fontsize12">{data.subtitle}</div>
                  </div>
                </Checkbox>
              )}
            </FormItem>
          </div>
        </div>
      );
    });

    let specialCareContent = [];

    specialCareValues.forEach((data, index) => {
      specialCareContent.push(
        <div key={index} className="full-width">
          <div className="content-space-between full-width flex align-items-center settings">
            <FormItem className={"mb0"}>
              {getFieldDecorator(data.key, {
                rules: [],
                valuePropName: "checked",
                initialValue: data.value
              })(
                <Checkbox className={"calendar_sync_line settings-checkbox"}>
                  <div>
                    <div className="fontsize14 dark">{data.title}</div>
                    <div className="subdued fontsize12">{data.subtitle}</div>
                  </div>
                </Checkbox>
              )}
            </FormItem>
          </div>
        </div>
      );
    });

    const nonMedicalServiceContent = [];
    nonMedicalService.forEach((data, index) => {
      nonMedicalServiceContent.push(
        <div key={index} className="full-width">
          <div className="content-space-between full-width flex align-items-center settings">
            <FormItem className={"mb0"}>
              {getFieldDecorator(data.key, {
                rules: [],
                valuePropName: "checked",
                initialValue: data.value
              })(
                <Checkbox className={"calendar_sync_line settings-checkbox"}>
                  <div>
                    <div className="fontsize14 dark">{data.title}</div>
                    <div className="subdued fontsize12">{data.subtitle}</div>
                  </div>
                </Checkbox>
              )}
            </FormItem>
          </div>
        </div>
      );
    });

    return (
      <div id="services">
        <Element name="services">
          <div className="bold mt40 pb16 fontsize18">
            {formatMessage(messages.services)}
          </div>
          <div className="full-width">
            <div className="content-space-between full-width flex align-items-center settings mt20">
              <FormItem className={"mb0"}>
                {getFieldDecorator(MEDICAL_SERVICES, {
                  rules: [],
                  valuePropName: "checked",
                  initialValue: medicalServices
                })(
                  <Checkbox className={"calendar_sync_line settings-checkbox"}>
                    <div>
                      <div className="fontsize14 dark">
                        {formatMessage(messages.medicalServices)}
                      </div>
                    </div>
                  </Checkbox>
                )}
              </FormItem>
            </div>
          </div>

          <div className="mt20">
            <h5>{formatMessage(messages.homeHealthCare)}</h5>
            <List
              span={24}
              bordered
              dataSource={homeHealthCareServiceContent}
              renderItem={item => <List.Item>{item}</List.Item>}
            />
          </div>
          <div className="mt20">
            <h5>{formatMessage(messages.specialCare)}</h5>
            <List
              span={24}
              bordered
              dataSource={specialCareContent}
              renderItem={item => <List.Item>{item}</List.Item>}
            />
          </div>
          <div className="mt20">
            <h5>{formatMessage(messages.nonMedicalServices)}</h5>
            <List
              span={24}
              bordered
              dataSource={nonMedicalServiceContent}
              renderItem={item => <List.Item>{item}</List.Item>}
            />
          </div>
        </Element>
      </div>
    );
  }
}

export default injectIntl(ServiceSection);
