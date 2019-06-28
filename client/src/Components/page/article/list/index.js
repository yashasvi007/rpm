import React, { Component, Fragment } from "react";
import { Row, Select, Tabs, Layout } from "antd";
import { injectIntl } from "react-intl";
import GoBack from "../../../../Assets/images/ico-back.svg";
import AppHeader from "../../../../Containers/Header";
import RecommendedArticles from "./recommendedArticles";
import FavoritesArticles from "./favoritesArticles";
import messages from "./message";
import { ARTICLES, ALL_SORT_BY } from "../../../../constant";
import DownArrow from "../../../../Assets/images/material-icons-black-arrow-drop-down.svg";
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
    this.setState({ recommendedArticles, favoriteArticles }, () =>
      this.handleSortBy(ALL_SORT_BY.DATE_ADDED)
    );
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

  sortByDate(articles) {
    return articles.sort((a, b) => {
      if (a.createdAt < b.createdAt) {
        return 1;
      }
      if (a.createdAt > b.createdAt) {
        return -1;
      }
      return 0;
    });
  }

  sortByPopular(articles) {
    return articles.sort((a, b) => {
      if (a.views.length < b.views.length) {
        return 1;
      }
      if (a.views.length > b.views.length) {
        return -1;
      }
      return 0;
    });
  }

  sortByName(articles) {
    return articles.sort((a, b) => {
      if (a.title < b.title) {
        return -1;
      }
      if (a.title > b.title) {
        return 1;
      }
      return 0;
    });
  }

  handleSortBy = key => {
    switch (key) {
      case ALL_SORT_BY.DATE_ADDED:
        this.setState({
          recommendedArticles: this.sortByDate(this.state.recommendedArticles),
          favoriteArticles: this.sortByDate(this.state.favoriteArticles)
        });
        break;
      case ALL_SORT_BY.MOST_POPULAR:
        this.setState({
          recommendedArticles: this.sortByPopular(
            this.state.recommendedArticles
          ),
          favoriteArticles: this.sortByPopular(this.state.favoriteArticles)
        });
        break;
      case ALL_SORT_BY.NAME:
        this.setState({
          recommendedArticles: this.sortByName(this.state.recommendedArticles),
          favoriteArticles: this.sortByName(this.state.favoriteArticles)
        });
        break;
      default:
        break;
    }
  };

  render() {
    const {
      intl: { formatMessage }
    } = this.props;

    const { currentTab, recommendedArticles, favoriteArticles } = this.state;

    const { handleOnClickArticle } = this;
    return (
      <Layout>
        <AppHeader setTabDashboard={this.setTabDashboard} />
        <Row>
          <div className="article-header">
            <div className="back-location flex align-items-center">
              <img
                alt=""
                src={GoBack}
                className="backButton clickable mr8"
                onClick={this.handleGoBack}
              />
              <span className="previousLocation">
                {formatMessage(messages.articleTitle)}
              </span>
            </div>
          </div>
        </Row>
        <Row className="articles">
          <div className="article-content">
            <div className="flex align-items-center justify-content-space-between">
              <div className="fontsize22 dark bold">Articles</div>
              <div className="flex align-items">
                <div className="sortBy flex align-items-center mr8">
                  <div className="fontsize14 bold dark pl8 ">
                    {formatMessage(messages.sortBy)}
                  </div>
                  <Select
                    optionFilterProp="children"
                    suffixIcon={
                      <img alt="" src={DownArrow} className="arrow-img" />
                    }
                    defaultValue={formatMessage(messages.dateAdded)}
                    className="flex align-items-center"
                    onChange={this.handleSortBy}
                  >
                    <Option key={formatMessage(messages.dateAdded)}>
                      {formatMessage(messages.dateAdded)}
                    </Option>
                    <Option key={formatMessage(messages.popular)}>
                      {formatMessage(messages.popular)}
                    </Option>
                    <Option key={formatMessage(messages.name)}>
                      {formatMessage(messages.name)}
                    </Option>
                  </Select>
                </div>
              </div>
            </div>
          </div>
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
                <RecommendedArticles
                  {...this.props}
                  handleOnClick={handleOnClickArticle}
                  recommendedArticles={recommendedArticles}
                />
              </TabPane>
              <TabPane
                tab={`Favourites (${favoriteArticles.length})`}
                key="Favourites"
                className={"tabscontent flex"}
              >
                <FavoritesArticles
                  {...this.props}
                  handleOnClick={handleOnClickArticle}
                  favoriteArticles={favoriteArticles}
                />
              </TabPane>
            </Tabs>
          </div>
        </Row>
      </Layout>
    );
  }
}

export default injectIntl(Article);
