import { defineMessages } from "react-intl";

const messages = defineMessages({
  articleTitle: {
    id: "Article.dashboard.article",
    description: "Dashboard Article title",
    defaultMessage: "Dashboard"
  },
  sortBy: {
    id: "Article.dashboard.sortBy",
    description: "Article sortBy title",
    defaultMessage: "Sort By"
  },
  dateAdded: {
    id: "Article.dashboard.sort.dateAdded",
    description: "Article Sort by DateAdded",
    defaultMessage: "Date Added"
  },
  name: {
    id: "Article.dashboard.sort.name",
    description: "Article sort by name",
    defaultMessage: "Name"
  },
  popular: {
    id: "Article.dashboard.sort.popular",
    description: "Article sort by popularity",
    defaultMessage: "Most Popular"
  }
});

export default messages;
