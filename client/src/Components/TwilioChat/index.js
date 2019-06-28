import React, { Component, Fragment } from "react";
import { Form, Input, Button, Avatar } from "antd";
import dateFns from "date-fns";
import Chat from "twilio-chat";
import CloseChatIcon from "../../Assets/images/ico-vc-message-close.png";
import "./style.less";

class ChatForm extends Component {
  constructor() {
    super();
    this.state = {
      newMessage: ""
    };
  }

  onMessageChanged = event => {
    this.setState({ newMessage: event.target.value });
  };

  sendMessage = event => {
    event.preventDefault();
    if (this.state.newMessage.length > 0) {
      const message = this.state.newMessage;
      this.setState({ newMessage: "" });
      this.props.channel.sendMessage(message);
    }
  };
  render() {
    return (
      <Form
        onSubmit={this.sendMessage}
        className="chat-form"
        //style={{ position: "absolute", bottom: 0, left: 72, width: 264 }}
      >
        <div className="form-input">
          <Input
            type="text"
            value={this.state.newMessage}
            onChange={this.onMessageChanged}
            placeholder="Write message..."
            //style={{ height: 40, fontSize: 14, paddingRight: 48 }}
          />
        </div>
        <div className="form-button">
          <Button htmlType="submit">Send</Button>
        </div>
      </Form>
    );
  }
}

class TwilioChat extends Component {
  constructor(props) {
    super(props);
    this.ChatForm = Form.create()(ChatForm);
    this.state = {
      token: "",
      chatReady: false,
      messages: [],
      messagesLoading: true,
      newMessage: ""
    };
    this.channelName = "test";
  }

  scrollToBottom = () => {
    const chatEndElement = document.getElementById("chatEnd");
    chatEndElement.focus();
    chatEndElement.scrollIntoView({ behavior: "smooth" });
  };

  componentDidMount() {
    this.getToken();
    this.scrollToBottom();
  }

  getToken = async () => {
    const {
      match: {
        params: { roomId }
      },
      fetchChatAccessToken,
      loggedInUser
    } = this.props;
    this.channelName = roomId ? roomId : "test";
    fetchChatAccessToken(loggedInUser).then(result => {
      this.setState((prevState, props) => {
        return {
          token: props.twilio.chatToken
        };
      }, this.initChat);
    });
  };

  initChat = () => {
    this.chatClient = new Chat(this.state.token);
    this.chatClient.initialize().then(this.clientInitiated.bind(this));
  };

  clientInitiated = () => {
    this.setState({ chatReady: true }, () => {
      this.chatClient
        .getChannelByUniqueName(this.channelName)
        .then(channel => {
          if (channel) {
            return (this.channel = channel);
          }
        })
        .catch(err => {
          if (err.body.code === 50300) {
            return this.chatClient.createChannel({
              uniqueName: this.channelName
            });
          }
        })
        .then(channel => {
          this.channel = channel;
          window.channel = channel;
          if (channel.state.status !== "joined") {
            return this.channel.join();
          } else {
            return this.channel;
          }
        })
        .then(() => {
          this.channel.getMessages().then(this.messagesLoaded);
          this.channel.on("messageAdded", this.messageAdded);
        });
    });
  };

  messagesLoaded = messagePage => {
    this.setState(
      { messagesLoading: false, messages: messagePage.items },
      this.scrollToBottom
    );
  };

  messageAdded = message => {
    this.setState((prevState, props) => ({
      messages: [...prevState.messages, message]
    }));
  };

  componentDidUpdate(prevProps, prevState) {
    this.scrollToBottom();
  }

  logOut = event => {
    event.preventDefault();
    this.setState({
      token: "",
      chatReady: false,
      messages: []
    });
    this.chatClient.shutdown();
    this.channel = null;
  };

  renderMessages() {
    const { loggedInUser, users } = this.props;
    return this.state.messages.length > 0
      ? this.state.messages.map((message, index) => {
          const user = users[message.state.author]
            ? users[message.state.author]
            : {};
          const { basicInfo: { profilePicLink: profilePic } = {} } = user;
          return (
            <Fragment key={message.state.sid}>
              {message.state.author !== loggedInUser ? (
                <div className="chat-messages">
                  <div className="chat-avatar">
                    <span className="twilio-avatar">
                      <Avatar src={profilePic} />
                    </span>
                    <div className="chat-text">{message.state.body}</div>
                  </div>
                  <div className="chat-time start">
                    {dateFns.format(message.state.timestamp, "H:mm")}
                  </div>
                </div>
              ) : (
                <div className="chat-messages end">
                  {" "}
                  <div className="chat-text end">{message.state.body}</div>
                  <div className="chat-time">
                    {dateFns.format(message.state.timestamp, "H:mm")}
                  </div>
                  {/* <div className="chat-avatar left">
                  <Avatar src={profilePic} />
                </div> */}
                </div>
              )}
            </Fragment>
          );
        })
      : "";
  }

  render() {
    const { ChatForm } = this;
    return (
      <Fragment>
        <div className="twilio-chat-container">
          <div className="twilio-chat-body">
            {this.renderMessages()}
            <div id="chatEnd" style={{ float: "left", clear: "both" }} />
          </div>
        </div>

        <div className="twilio-chat-footer">
          <div className="footer-left">
            <img
              src={CloseChatIcon}
              className="back-image"
              onClick={this.props.hideChat}
              alt="chatImg"
            />
          </div>
          <div className="footer-right">
            <ChatForm messages={this.messages} channel={this.channel} />
          </div>
        </div>
      </Fragment>
    );
  }
}

export default TwilioChat;
