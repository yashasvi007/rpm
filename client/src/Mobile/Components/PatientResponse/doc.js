import React, { Fragment, Component } from "react";
import {
  Page,
  PDFDownloadLink,
  Text,
  View,
  Document,
  StyleSheet
} from "@react-pdf/renderer";
import filter from "lodash-es/filter";
import { OPTION_TYPE } from "../../../constant";
const styles = StyleSheet.create({
  page: { backgroundColor: "white" },
  header: {
    width: "100%",
    fontFamily: "AvenirNext-Regular",
    fontSize: "16pt"
  },
  heading: {
    fontFamily: "AvenirNext-Regular",
    fontSize: "12pt"
  },
  content: {
    fontFamily: "AvenirNext-Regular",
    fontSize: "14pt",
    marginBottom: "14pt",
    marginTop: "16pt",
    marginLeft: "24pt"
  },
  question: {
    marginTop: "12pt"
  },
  section: { color: "white", textAlign: "center", margin: 30 }
});

let LOADING = true;

class Doc extends Component {
  generateResponsePdf = () => {
    const {
      questions,
      response,
      users,
      match: { params: { participantId } = {} } = {}
      //medicalsData = {}
    } = this.props;

    const user = users && participantId ? users[participantId] : null;
    // const medicalDetails =
    //   medicalsData && participantId ? medicalsData[participantId] : null;
    // const complaint =
    //   medicalDetails && medicalDetails.basicCondition
    //     ? medicalDetails.basicCondition.chiefComplaint
    //     : null;

    let userDetails = [];
    userDetails.push(
      <View style={styles.header}>
        <View>
          <Text>Name :{user.basicInfo.name}</Text>
          <Text style={{ marginTop: "16pt" }}>Response :</Text>
        </View>
      </View>
    );

    let result = [];
    result.push(userDetails);

    questions.forEach((question, index) => {
      const qid = question._id;
      const answer = filter(response, function(answer) {
        return answer.questionId === qid;
      });

      if (answer.length > 0) {
        if (answer[0].type === OPTION_TYPE.TEXT) {
          result.push(
            <Fragment key={question._id}>
              <Text key={question._id} style={styles.question}>
                Q{index + 1} {question.statement}
              </Text>
              <Text key={question._id}>{answer[0].response}</Text>
            </Fragment>
          );
        } else if (answer[0].type === OPTION_TYPE.RADIO) {
          result.push(
            <Fragment key={question._id}>
              <Text key={question._id} style={styles.question}>
                Q{index + 1} {question.statement}
              </Text>
              <Text key={question._id}>
                {`${answer[0].response.id}. ${answer[0].response.value}`}{" "}
              </Text>
            </Fragment>
          );
        } else if (answer[0].type === OPTION_TYPE.CHECKBOX) {
          const checkboxResponse = answer[0].response;
          let checkbox = [];
          for (const response in checkboxResponse) {
            const checkboxAnswer = checkboxResponse[response];

            checkbox.push(
              <Text id={checkboxAnswer.id} key={question._id}>
                {`${checkboxAnswer.id}. ${checkboxAnswer.value}`}{" "}
              </Text>
            );
          }
          result.push(
            <Fragment key={question._id}>
              <Text style={styles.question} key={question._id}>
                Q{index + 1} {question.statement}
              </Text>
              <Text>{checkbox}</Text>
            </Fragment>
          );
        }
      }
    });
    // let trial = [];
    // trial.push(<Fragment>{result}</Fragment>);

    return (
      <Document>
        <Page style={styles.page}>
          <View style={styles.content}>{result}</View>
        </Page>
      </Document>
    );
  };

  createDocument = () => (
    <Document
      onRender={() => {
        //  LOADING = false;
      }}
    >
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text>Section #1</Text>
        </View>
        <View style={styles.section}>
          <Text>Section #2</Text>
        </View>
      </Page>
    </Document>
  );

  componentDidMount() {}

  componentWillMount() {
    //
  }

  componentDidUpdate() {
    //
  }

  componentWillReceiveProps() {
    //
  }

  shouldComponentUpdate(nextProps, nextState, nextContext) {
    //
    return !LOADING;
  }

  render() {
    const {
      surveyTitle,
      users,
      match: { params: { participantId } = {} } = {}
    } = this.props;
    const user = users && participantId ? users[participantId] : null;
    const { basicInfo: { name = "" } = {} } = user;
    return (
      <PDFDownloadLink
        document={this.generateResponsePdf()}
        fileName={`${surveyTitle}_${name}_response.pdf`}
      >
        {({ blob, url, loading, error }) => "Download Response"}
      </PDFDownloadLink>
    );
  }
}

export default Doc;
// export default () => {
//   //return <div>pdf</div>;
//   return (
//     <PDFViewer>
//       <Document>
//         <Page>
//           <View>
//             <Text>Section #1</Text>
//           </View>
//         </Page>
//       </Document>
//     </PDFViewer>
//   );
// };
