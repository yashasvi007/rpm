import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import { IntlProvider, addLocaleData } from "react-intl";
import arLocaleData from "react-intl/locale-data/ar";
import esLocaleData from "react-intl/locale-data/es";
import hiLocalData from "react-intl/locale-data/hi";
import { composeWithDevTools } from "redux-devtools-extension";
import allReducers from "./modules";
import translations from "./i18n/locales";

import "./styles/index.less";

window.CALENDAR_SYNC = process.env.CALENDAR_SYNC;

const Mobile = lazy(() =>
  import(/* webpackChunkName: "MobileWrapper" */ "./Mobile/AppWrapper")
);
const Desktop = lazy(() =>
  import(/* webpackChunkName: "DesktopWrapper" */ "./AppWrapper")
);

let store;
if (process.env.NODE_ENV === "development") {
  store = createStore(allReducers, composeWithDevTools(applyMiddleware(thunk)));
} else {
  store = createStore(allReducers, applyMiddleware(thunk));
}

addLocaleData(arLocaleData);
addLocaleData(esLocaleData);
addLocaleData(hiLocalData);
//fecth locale
const locale = window.location.search.replace("?locale=", "") || "en";
const messages = translations[locale];
//
const sw = window.screen.width;
console.log("window.screen.width ===============>", window.screen.width);

ReactDOM.render(
  <Provider store={store}>
    <IntlProvider locale={locale} key={locale} messages={messages}>
      <Suspense fallback={<div>Loading</div>}>
        {sw > 1023 ? <Desktop /> : <Mobile />}
        {/*{<Mobile />}*/}
      </Suspense>
    </IntlProvider>
  </Provider>,
  document.getElementById("root")
);
// registerServiceWorker();
