import React, { Component, Fragment } from "react";
import TwilioVideo from "../../Containers/Twilio/twilioVideo";
import TwilioChat from "../../Containers/Twilio/twilioChat";
import "./styles.less";

class RemoteConsulting extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showChatBox: false
    };
    this.hideChat = this.hideChat.bind(this);
    this.showChat = this.showChat.bind(this);
  }
  hideChat() {
    this.setState({ showChatBox: false });
  }

  showChat() {
    this.setState({ showChatBox: true });
  }

  componentDidMount() {
    document.getElementById("root").classList.add("root-height");
  }

  render() {
    const { loggedInUser, users } = this.props;
    const user = users[loggedInUser] ? users[loggedInUser] : {};
    const { basicInfo: { category } = {} } = user;
    //const category = this.props.users[loggedInUser].basicInfo.category;

    return (
      <Fragment>
        <div className="twilio-container">
          <div className="twilio-video ">
            <TwilioVideo
              category={category}
              showChatBox={this.state.showChatBox}
              showChat={this.showChat}
              hideChat={this.hideChat}
              {...this.props}
            />
          </div>
          <div
            className={
              this.state.showChatBox ? "twilio-chat" : "twilio-chat-invisible"
            }
          >
            <TwilioChat
              showChatBox={this.state.showChatBox}
              hideChat={this.hideChat}
              {...this.props}
            />
          </div>
        </div>
      </Fragment>
    );
  }
}

export default RemoteConsulting;
