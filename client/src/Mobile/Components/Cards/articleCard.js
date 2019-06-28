import React from "react";
import moment from "moment";
import Col from "antd/es/grid/col";

import { withRouter } from "react-router-dom";
import LinesEllipsis from "react-lines-ellipsis";
import "./style.less";
import like from "../../../Assets/images/ico_like.svg";
import liked from "../../../Assets/images/ico_liked.svg";
import { getArticleDetailURL } from "../../../Helper/appUrl/article";
const ArticleCard = props => {
  const {
    title,
    description,
    views,
    timeToRead,
    isFavourite,
    createdAt,
    _id
  } = props.articleData;

  const { makeFavouriteUnfavourite, history } = props;
  const onCardClick = e => {
    e.preventDefault();
    history.push(getArticleDetailURL(_id));
  };
  const viewsCount = views ? views.length : 0;

  return (
    <Col key={_id} xs={12} sm={12} md={6} lg={6}>
      <div className="article-card mr16 mb16">
        <div className="card-content">
          <div className="flex justify-content-space-between">
            <div
              className="fontsize14 bold dark mb8 mr8 clickable"
              onClick={onCardClick}
            >
              <LinesEllipsis
                text={title}
                maxLine="1"
                ellipsis="..."
                trimRight
                basedOn="letters"
              />
            </div>
            <div
              className="icon-fevourite clickable"
              onClick={e => {
                e.stopPropagation();
                makeFavouriteUnfavourite();
              }}
            >
              <img
                alt=""
                src={!isFavourite ? like : liked}
                className="fevourite-icons"
              />
            </div>
          </div>
          <div>
            <LinesEllipsis
              text={description}
              maxLine="2"
              ellipsis="..."
              trimRight
              basedOn="letters"
            />
          </div>
          <div className="fontsize12 label-color mt8">
            {moment(createdAt).format("DD/MM/YYYY")}
            <span className="pull-right">
              {timeToRead} min read <span className="dot dark ml5 mr5 mt8" />{" "}
              {viewsCount} views
            </span>
          </div>
        </div>
      </div>
    </Col>
  );
};

export default withRouter(ArticleCard);
