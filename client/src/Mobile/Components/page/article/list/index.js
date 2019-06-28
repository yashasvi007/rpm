import React, { Component } from "react";
import { Select, Tabs, Row, Col } from "antd";
import { injectIntl } from "react-intl";
import GoBack from "../../../../../Assets/images/ico-back.svg";
import RecommendedArticles from "./recommendedArticles";
import FavoritesArticles from "./favoritesArticles";
import messages from "./message";
import { ARTICLES, ALL_SORT_BY } from "../../../../../constant";
import DownArrow from "../../../../../Assets/images/material-icons-black-arrow-drop-down.svg";
import "./style.less";
const { Option } = Select;
const { TabPane } = Tabs;

class Article extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTab: "Recommended",
      recommendedArticles: [],
      favoriteArticles: [],
      sortBy: ""
    };
  }

  pushFilteredArticles = articles => {
    let recommendedArticles = [];
    let favoriteArticles = [];
    articles.map(article => {
      if (!article.isFavourite) {
        recommendedArticles.push(article);
      } else {
        favoriteArticles.push(article);
      }
    });
    this.setState({ recommendedArticles, favoriteArticles });
  };

  componentDidMount() {
    //Fetch articles api
    const { fetchArticles } = this.props;
    fetchArticles();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.articles !== prevProps.articles) {
      let articlesObject = this.props.articles;
      articlesObject = Object.values(articlesObject);
      this.pushFilteredArticles(articlesObject);
    }
  }

  handleGoBack = e => {
    e.preventDefault();
    const { history } = this.props;
    history.goBack();
  };
  handleOnClickArticle = id => {
    // this.props.history.push(`/article/${id}`);
  };

  handleOnTabChange = key => {
    if (key === ARTICLES.RECOMMENDED) {
      this.setState({ currentTab: ARTICLES.RECOMMENDED });
    } else {
      this.setState({ currentTab: ARTICLES.FAVOURITES });
    }
  };

  render() {
    const {
      intl: { formatMessage }
    } = this.props;

    const { currentTab, recommendedArticles, favoriteArticles } = this.state;

    const { handleOnClickArticle, handleGoBack } = this;
    return (
      <div className="articles">
        <div className="articles-content">
          <Row gutter={8}>
            <Col xs={12} xm={12} md={6} lg={6}>
              <div className="">
                <div className="fontsize22 dark bold">Articles</div>
              </div>
            </Col>
            <Col xs={12} xm={12} md={6} lg={6}>
              <div className="sortBy flex align-items-center mr8">
                <div className="fontsize14 bold dark pl8 ">
                  {formatMessage(messages.sortBy)}
                </div>
                <Select
                  optionFilterProp="children"
                  suffixIcon={
                    <img alt="" src={DownArrow} className="arrow-img" />
                  }
                  defaultValue="Date Added"
                  className="flex align-items-center flex-1"
                  onChange={this.handleSortBy}
                >
                  <Option key="1">{formatMessage(messages.dateAdded)}</Option>
                  <Option key="2">{formatMessage(messages.popular)}</Option>
                  <Option key="3">{formatMessage(messages.name)}</Option>
                </Select>
              </div>
            </Col>
          </Row>
          <div className="mt40">
            <Tabs
              className={"tabstitle fontsize14 w100"}
              defaultActiveKey="Recommended"
              tabBarStyle={{
                color: "#7f888d",
                fontFamily: "AvenirNext-Medium"
              }}
              activeKey={currentTab}
              onChange={this.handleOnTabChange}
            >
              <TabPane
                tab={`Recommended (${recommendedArticles.length})`}
                key="Recommended"
                className={"tabscontent flex"}
              >
                <Row gutter={8} className="w100">
                  <RecommendedArticles
                    {...this.props}
                    handleOnClick={handleOnClickArticle}
                    recommendedArticles={recommendedArticles}
                  />
                </Row>
              </TabPane>
              <TabPane
                tab={`Favourites (${favoriteArticles.length})`}
                key="Favourites"
                className={"tabscontent flex"}
              >
                <Row gutter={8} className="w100">
                  <FavoritesArticles
                    {...this.props}
                    handleOnClick={handleOnClickArticle}
                    favoriteArticles={favoriteArticles}
                  />
                </Row>
              </TabPane>
            </Tabs>
          </div>
        </div>

        <div className="articles-footer g-footer">
          <div className="flex justify-content-space-between h100 full-width">
            <div className="flex align-items-center">
              <div className="back mr8">
                <img
                  alt=""
                  src={GoBack}
                  className="back clickable"
                  onClick={handleGoBack}
                />
              </div>
              <div className="ml8 mr4 dark fontsize12">
                {formatMessage(messages.articleTitle)}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default injectIntl(Article);
