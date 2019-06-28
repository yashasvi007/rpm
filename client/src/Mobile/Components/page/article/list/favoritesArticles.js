import React, { Component, Fragment } from "react";
import ArticleCard from "../../../../Containers/Cards/article";

class FavoriteArticles extends Component {
  render() {
    const { favoriteArticles = [] } = this.props;

    return (
      <Fragment>
        {favoriteArticles.map(article => {
          const { _id } = article;
          return <ArticleCard key={_id} id={_id} />;
        })}
      </Fragment>
    );
  }
}

export default FavoriteArticles;
