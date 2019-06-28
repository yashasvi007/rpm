import React, { Fragment } from "react";
import { injectIntl } from "react-intl";
import { withRouter } from "react-router-dom";

import messages from "./message";
import GoBack from "../../../../../Assets/images/ico-back.svg";
import usrDp from "../../../../../Assets/images/ico-placeholder-userdp.svg";
import { getPatientDetailURL } from "../../../../../Helper/appUrl/patient";

import ArticleShare from "../../../../Containers/Modal/articleShareWith";

const getUser = props => {
  const { data, onClick } = props;
  const { basicInfo: { _id, profilePicLInk = usrDp } = {} } = data;
  return (
    <div className="clickable usr ml4 mr4" key={_id} onClick={onClick(_id)}>
      <img className="usr" alt="usr" src={profilePicLInk} />
    </div>
  );
};

const ArticleDetailHeader = props => {
  const {
    article = {},
    intl: { formatMessage },
    history,
    shareWith,
    currentUser: { basicInfo: { _id: currentUserId } = {} } = {},
    users = {}
  } = props;
  const { title, participants = {} } = article;
  const sharedWith = Object.keys(participants) || [];

  const handleUserClick = id => e => {
    e.stopPropagation();
    history.push(getPatientDetailURL(id));
  };

  let userList = [];
  for (let i = 0; i < 2 && i < sharedWith.length; i++) {
    const userId = sharedWith[i];
    const data = users[userId] || {};
    if (userId !== currentUserId) {
      userList.push(getUser({ data, onClick: handleUserClick }));
    }
  }

  if (userList.length + 1 < sharedWith.length) {
    userList.push(
      <div
        className="flex align-items-center justify-content-center clickable more slate-grey medium fontsize10 ml4 mr4"
        key={"more"}
        onClick={shareWith}
      >{`+${sharedWith.length - 1 - userList.length}`}</div>
    );
  }

  return (
    <Fragment>
      <div className="flex justify-content-space-between h100 full-width">
        <div className="flex align-items-center">
          <div className="back mr8">
            <img
              alt=""
              src={GoBack}
              className="back clickable"
              onClick={history.goBack}
            />
          </div>
          <div className="ml8 mr4 dark fontsize12">
            {formatMessage(messages.dashboard)}
          </div>
          {/* <div className="dot dark ml4 mr4" />
            <div className=" ml4 mr8 dark fontsize12">
              {formatMessage(messages.allArticles)}
            </div>
            <div className="ml8 mr8 dark fontsize18 medium">{title}</div> */}
        </div>

        {userList.length > 0 && (
          <div
            className="flex align-items-center dark fontsize12"
            onClick={shareWith}
          >
            <div className="mr8 ml8">{formatMessage(messages.sharedWith)}</div>
            {userList}
          </div>
        )}
      </div>
      <ArticleShare />
    </Fragment>
  );
};

export default withRouter(injectIntl(ArticleDetailHeader));
