import React, { Component, Fragment } from "react";
import LinesEllipsis from "react-lines-ellipsis";

import { injectIntl } from "react-intl";
import moment from "moment";

import Header from "./header";
import messages from "./message";

import like from "../../../../../Assets/images/ico_like.svg";
import liked from "../../../../../Assets/images/ico_liked.svg";
import shareIcon from "../../../../../Assets/images/share.svg";
import ArticleShare from "../../../../Containers/Modal/articleShare";
import "./style.less";

class ArticleDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps, prevState) {
    const { articleId: prevArticleId } = prevProps;
    const { articleId } = this.props;
    if (articleId !== prevArticleId) {
      this.fetchData();
    }
  }

  formatMessage = data => this.props.intl.formatMessage(data);

  fetchData = async () => {
    const { fetchData } = this.props;
    try {
      const response = await fetchData();
      const { status } = response;
      if (status) {
        this.setState({ loading: false });
      }
    } catch (err) {}
  };

  getTitle = () => {
    const { article } = this.props;
    const { title, timeToRead, createdAt, views = [], isFavourite } = article;
    const { onShare, onLike } = this;
    const date = moment(createdAt).format("DD MMM YYYY");
    const readTime = `${timeToRead} min read`;
    let viewCount = `${views.length} views`;

    return (
      <Fragment>
        <div className="flex justify-content-space-between pb16 article-title">
          <div className="flex column">
            <div className="bold fontsize22 dark">
              <LinesEllipsis
                text={title}
                maxLine="2"
                ellipsis="..."
                trimRight
                basedOn="letters"
              />
            </div>
            <div className="flex align-items-center">
              <div className="fontsize12 subdued mr4">{date}</div>
              <div className="dot silver mr4" />
              <div className="fontsize12 subdued mr4">{readTime}</div>
              <div className="dot silver mr4" />
              <div className="fontsize12 subdued mr4">{viewCount}</div>
            </div>
          </div>
          <div className="mr8 ml8 flex justify-content-end">
            <div className="like mr8">
              <img
                alt=""
                onClick={onLike}
                src={!isFavourite ? like : liked}
                className="like clickable"
              />
            </div>
            <div className="share">
              <img
                alt=""
                src={shareIcon}
                className="share clickable"
                onClick={onShare}
              />
            </div>
          </div>
          <div className="pb16 vl" />
        </div>
        <ArticleShare />
      </Fragment>
    );
  };

  getDescription = () => {
    const { article: { description } = {} } = this.props;
    return <div className="dark fontsize14 mt8 mb8">{description}</div>;
  };

  getSource = () => {
    const { article: { url } = {} } = this.props;
    return (
      <div className="mt30 mb16 pb16 flex">
        <div className=" subdued mr4 ">
          {this.formatMessage(messages.source)}
        </div>
        <div className="flex-1">
          <a className="dark medium full-width word-break-break-all" href={url}>
            {url}
          </a>
        </div>
      </div>
    );
  };

  onShare = e => {
    e.preventDefault();
    const { shareArticle } = this.props;
    shareArticle();
  };

  onLike = e => {
    e.preventDefault();
    const { makeFavouriteUnfavourite } = this.props;
    makeFavouriteUnfavourite();
  };

  viewShareWith = e => {
    e.preventDefault();
    const { shareWith } = this.props;
    shareWith();
  };

  render() {
    const { loading } = this.state;
    const { getTitle, getDescription, getSource, viewShareWith } = this;
    const { article = {}, users = {}, currentUser = {} } = this.props;
    return (
      <Fragment>
        {loading === false && (
          <div className="article">
            <div className="article-content">
              {getTitle()}
              {getDescription()}
              {getSource()}
            </div>
            <div className="article-footer g-footer">
              <Header
                article={article}
                shareWith={viewShareWith}
                users={users}
                currentUser={currentUser}
              />
            </div>
          </div>
        )}
      </Fragment>
    );
  }
}

export default injectIntl(ArticleDetails);
