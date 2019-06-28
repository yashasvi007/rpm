import React, { Component, Fragment } from "react";
import { Route, Switch } from "react-router-dom";
import { path } from "../../constant";
import ArticleDetails from "../../Containers/page/article/details";
import BlankState from "../../Containers/BlankState";
import AppHeader from "../../Containers/Header";
import Article from "../../Containers/page/article/list";

const ArticleDetailsComp = props => {
  const { match: { params: { articleId } = {} } = {} } = props;
  if (articleId) {
    return <ArticleDetails articleId={articleId} />;
  }
  return <BlankState />;
};

export default class ArticleRoutes extends Component {
  render() {
    return (
      <Fragment>
        <AppHeader />
        <Switch>
          <Route exact path={path.ARTICLE.ROOT} component={Article} />
          <Route
            exact
            path={path.ARTICLE.DETAILS}
            component={ArticleDetailsComp}
          />

          <Route path="" component={BlankState} />
        </Switch>
      </Fragment>
    );
  }
}
