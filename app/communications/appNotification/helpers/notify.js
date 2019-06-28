let stream = require("getstream");
class Notifier {
  constructor(payload) {
    this.key = process.config.getstream.API_KEY;
    this.secretKey = process.config.getstream.API_SECRET;
    this.payload = payload;
    this.stream = stream;
  }

  connect() {
    try {
      console.log("payload at connect", this.payload);
      this.client = this.stream.connect(this.key, this.secretKey);
      this.userToken = this.client.createUserToken(
        this.payload.participantOne.toString()
      );
      console.log("token", this.userToken);
      return this;
    } catch (err) {
      console.log("err", err);
    }
  }

  getUserToken(userId) {
    try {
      this.client = this.stream.connect(this.key, this.secretKey);
      return this.client.createUserToken(userId);
    } catch (err) {
      throw err;
    }
  }

  async sendNotification() {
    try {
      let data =
        arguments && arguments[0]
          ? arguments[0]
          : Object.assign({}, this.payload);

      console.log("notification payload", data);
      let feed = this.client.feed(
        "timeline",
        data.sendTo == "participantOne"
          ? data.participantOne.toString()
          : data.participantTwo.toString()
      );
      feed.addActivity(data).then(
        res => {
          console.log("response", res);
        },
        function(err) {
          console.log("error at addactivity", err);
        }
      );
    } catch (err) {
      console.log("Error", err);
    }
  }

  async updateNotification() {
    try {
    } catch (err) {
      console.log(err);
    }
  }

  async deleteNotification() {
    try {
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = data => new Notifier(data);
