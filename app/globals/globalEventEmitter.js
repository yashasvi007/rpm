const { EventEmitter } = require("events");

const globalConstants = require("./globalContants");
const Log = require("../../libs/log")("globalEventEmitter");

let totalRegisterEvents = [globalConstants.BOOKING_REQUEST_STATUS_PENDING_USER];
totalRegisterEvents.push(globalConstants.BOOKING_REQUEST_SUBMITTED_USER);
totalRegisterEvents.push(globalConstants.BOOKING_REQUEST_SUBMITTED_MANAGER);

totalRegisterEvents.push(globalConstants.BOOKING_REQUEST_STATUS_APPROVED_USER);
totalRegisterEvents.push(
  globalConstants.BOOKING_REQUEST_STATUS_APPROVED_PROVIDER
);

totalRegisterEvents.push(globalConstants.BOOKING_REQUEST_STATUS_COMPLETED_USER);
totalRegisterEvents.push(
  globalConstants.BOOKING_REQUEST_STATUS_COMPLETED_PROVIDER
);

totalRegisterEvents.push(globalConstants.BOOKING_REQUEST_STATUS_REJECTED_USER);
totalRegisterEvents.push(
  globalConstants.BOOKING_REQUEST_STATUS_REJECTED_PROVIDER
);

var GlobalEventEmitter = (function() {
  var _eventInstanceObject;

  return {
    getInstance: function() {
      if (!_eventInstanceObject) {
        _eventInstanceObject = new EventEmitter();
      }
      return _eventInstanceObject;
    }
  };
})();

var globalEventObj = GlobalEventEmitter.getInstance();
var globalSubscribers = {};
var globalSubscribersName = {};

totalRegisterEvents.forEach(function(registerEventName) {
  globalSubscribers[registerEventName] = [];
  globalSubscribersName[registerEventName] = [];
  globalEventObj.on(registerEventName, function(data) {
    globalSubscribers[registerEventName].forEach(function(subscriberFun) {
      if (data) {
        subscriberFun(data);
      } else {
        subscriberFun();
      }
    });
  });
});

class Exporter {
  /*
   * Note : Callback function must be added using following Pattern
   *        globalEventObj.addSubscribers('test' , 'functionName' , functionName.bind(this));
   */
  get getInstance() {
    return GlobalEventEmitter.getInstance;
  }

  addSubscribers(eventName, functionName, callbackFun) {
    Log.debug("Subscriber " + eventName + " added to globalEventEmitter");
    if (globalSubscribers[eventName]) {
      if (typeof callbackFun === "function") {
        var isFuntionAlreadyThere = false;
        globalSubscribersName[eventName].forEach(function(functionNameAlready) {
          if (functionNameAlready === functionName) {
            isFuntionAlreadyThere = true;
          }
        });
        if (!isFuntionAlreadyThere) {
          globalSubscribers[eventName].push(callbackFun);
          globalSubscribersName[eventName].push(functionName);
        }
      }
    } else {
    }
  }

  subscribersList() {
    return globalSubscribersName;
  }

  subscribersListByEventName(eventName) {
    return globalSubscribersName[eventName];
  }
}

module.exports = new Exporter();
