import PatientResponse from "../../Components/PatientResponse";
import { withRouter } from "react-router-dom";

import { connect } from "react-redux";

import { fetchPatient } from "../../modules/page/Patientprofile";

import {
  makeCitySelector,
  makeCountrySelector
} from "../../modules/countryCity/selector";
import { fetchSurveys, fetchSurveysById } from "../../modules/survey";

import { fetchQuestions } from "../../modules/page/createSurvey";
import { fetchSurveyTemplates } from "../../modules/surveyTemplate";
import { fetchPatientresponse } from "../../modules/page/patientResponse";
const mapStateToProps = state => {
  const {
    users,
    countryCities,
    surveytemplates,
    medicals,
    surveys,
    page: { patientResponse = {}, createSurvey = {} } = {}
  } = state;
  const getCity = makeCitySelector();
  const getCountry = makeCountrySelector();

  return {
    users,
    medicals_data: medicals,
    surveys,
    surveytemplates,
    questions: createSurvey.questions,
    countrySelector: id => getCountry(countryCities, id),
    citySelector: (countryId, cityId) =>
      getCity(countryCities, countryId, cityId),
    country_city: countryCities,
    patientResponse: patientResponse.response,
    completedOn: patientResponse.completedOn
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchQuestions: templateId => dispatch(fetchQuestions(templateId)),
    fetchSurveys: status => dispatch(fetchSurveys(status)),
    fetchSurveyTemplates: () => dispatch(fetchSurveyTemplates()),
    fetchPatient: userId => dispatch(fetchPatient(userId)),
    fetchPatientresponse: (surveyId, patientId) =>
      dispatch(fetchPatientresponse(surveyId, patientId)),
    fetchSurveysById: surveyId => dispatch(fetchSurveysById(surveyId))
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(PatientResponse)
);
