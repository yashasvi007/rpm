import React, { Component, Fragment } from "react";
import ArticleCard from "../../../../Containers/cards/article";

class RecommendedArticles extends Component {
  render() {
    const { recommendedArticles = [] } = this.props;

    return (
      <Fragment>
        {recommendedArticles.map(article => {
          let { _id } = article;
          return <ArticleCard key={_id} id={_id} />;
        })}
      </Fragment>
    );
  }
}

export default RecommendedArticles;
