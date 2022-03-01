/*
 * ATTENTION: An "eval-source-map" devtool has been used.
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file with attached SourceMaps in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
(() => {
var exports = {};
exports.id = "pages/_app";
exports.ids = ["pages/_app"];
exports.modules = {

/***/ "./pages/_app.js":
/*!***********************!*\
  !*** ./pages/_app.js ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/globals.css */ \"./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _hedviginsurance_hanalytics_client__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @hedviginsurance/hanalytics-client */ \"@hedviginsurance/hanalytics-client\");\n/* harmony import */ var _hedviginsurance_hanalytics_client__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_hedviginsurance_hanalytics_client__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\nconst getHAnalyticsConfig = ()=>({\n        httpHeaders: {},\n        endpointURL: \"https://hanalytics-staging.herokuapp.com\",\n        context: {\n            locale: \"sv-SE\",\n            app: {\n                name: \"NextJSExample\",\n                namespace: \"staging\",\n                version: \"1.0.0\",\n                build: \"3000\"\n            },\n            device: {\n                id: \"STORE_THE_UUID\"\n            },\n            session: {\n                id: \"AN_ID\"\n            }\n        },\n        onSend: (event)=>{\n        /// send to google analytics or other tracking partner here\n        }\n    })\n;\nfunction MyApp({ Component , pageProps  }) {\n    return(/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_hedviginsurance_hanalytics_client__WEBPACK_IMPORTED_MODULE_2__.HAnalyticsProvider, {\n        getConfig: ()=>getHAnalyticsConfig()\n        ,\n        bootstrapExperiments: pageProps.experimentsBootstrap,\n        children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n            ...pageProps\n        }, void 0, false, {\n            fileName: \"/Users/sampettersson/dev/hAnalytics/examples/next.js/pages/_app.js\",\n            lineNumber: 36,\n            columnNumber: 7\n        }, this)\n    }, void 0, false, {\n        fileName: \"/Users/sampettersson/dev/hAnalytics/examples/next.js/pages/_app.js\",\n        lineNumber: 32,\n        columnNumber: 5\n    }, this));\n}\nMyApp.getInitialProps = async (appctx)=>{\n    const experimentsBootstrap = await (0,_hedviginsurance_hanalytics_client__WEBPACK_IMPORTED_MODULE_2__.bootstrapExperiments)(getHAnalyticsConfig);\n    return {\n        pageProps: {\n            experimentsBootstrap\n        }\n    };\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MyApp);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLmpzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQThCO0FBSWE7QUFFM0MsS0FBSyxDQUFDRSxtQkFBbUIsUUFBVSxDQUFDO1FBQ2xDQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO1FBQ2ZDLFdBQVcsRUFBRSxDQUEwQztRQUN2REMsT0FBTyxFQUFFLENBQUM7WUFDUkMsTUFBTSxFQUFFLENBQU87WUFDZkMsR0FBRyxFQUFFLENBQUM7Z0JBQ0pDLElBQUksRUFBRSxDQUFlO2dCQUNyQkMsU0FBUyxFQUFFLENBQVM7Z0JBQ3BCQyxPQUFPLEVBQUUsQ0FBTztnQkFDaEJDLEtBQUssRUFBRSxDQUFNO1lBQ2YsQ0FBQztZQUNEQyxNQUFNLEVBQUUsQ0FBQztnQkFDUEMsRUFBRSxFQUFFLENBQWdCO1lBQ3RCLENBQUM7WUFDREMsT0FBTyxFQUFFLENBQUM7Z0JBQ1JELEVBQUUsRUFBRSxDQUFPO1lBQ2IsQ0FBQztRQUNILENBQUM7UUFDREUsTUFBTSxHQUFHQyxLQUFLLEdBQUssQ0FBQztRQUNsQixFQUEyRDtRQUM3RCxDQUFDO0lBQ0gsQ0FBQzs7U0FFUUMsS0FBSyxDQUFDLENBQUMsQ0FBQ0MsU0FBUyxHQUFFQyxTQUFTLEVBQUMsQ0FBQyxFQUFFLENBQUM7SUFDeEMsTUFBTSw2RUFDSG5CLGtGQUFrQjtRQUNqQm9CLFNBQVMsTUFBUWxCLG1CQUFtQjs7UUFDcENELG9CQUFvQixFQUFFa0IsU0FBUyxDQUFDRSxvQkFBb0I7OEZBRW5ESCxTQUFTO2VBQUtDLFNBQVM7Ozs7Ozs7Ozs7O0FBRzlCLENBQUM7QUFFREYsS0FBSyxDQUFDSyxlQUFlLFVBQVVDLE1BQU0sR0FBSyxDQUFDO0lBQ3pDLEtBQUssQ0FBQ0Ysb0JBQW9CLEdBQUcsS0FBSyxDQUFDcEIsd0ZBQW9CLENBQUNDLG1CQUFtQjtJQUMzRSxNQUFNLENBQUMsQ0FBQztRQUFDaUIsU0FBUyxFQUFFLENBQUM7WUFBQ0Usb0JBQW9CO1FBQUMsQ0FBQztJQUFDLENBQUM7QUFDaEQsQ0FBQztBQUVELGlFQUFlSixLQUFLLEVBQUMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9oYW5hbHl0aWNzLWV4YW1wbGUvLi9wYWdlcy9fYXBwLmpzP2UwYWQiXSwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFwiLi4vc3R5bGVzL2dsb2JhbHMuY3NzXCI7XG5pbXBvcnQge1xuICBIQW5hbHl0aWNzUHJvdmlkZXIsXG4gIGJvb3RzdHJhcEV4cGVyaW1lbnRzLFxufSBmcm9tIFwiQGhlZHZpZ2luc3VyYW5jZS9oYW5hbHl0aWNzLWNsaWVudFwiO1xuXG5jb25zdCBnZXRIQW5hbHl0aWNzQ29uZmlnID0gKCkgPT4gKHtcbiAgaHR0cEhlYWRlcnM6IHt9LFxuICBlbmRwb2ludFVSTDogXCJodHRwczovL2hhbmFseXRpY3Mtc3RhZ2luZy5oZXJva3VhcHAuY29tXCIsXG4gIGNvbnRleHQ6IHtcbiAgICBsb2NhbGU6IFwic3YtU0VcIixcbiAgICBhcHA6IHtcbiAgICAgIG5hbWU6IFwiTmV4dEpTRXhhbXBsZVwiLFxuICAgICAgbmFtZXNwYWNlOiBcInN0YWdpbmdcIixcbiAgICAgIHZlcnNpb246IFwiMS4wLjBcIixcbiAgICAgIGJ1aWxkOiBcIjMwMDBcIixcbiAgICB9LFxuICAgIGRldmljZToge1xuICAgICAgaWQ6IFwiU1RPUkVfVEhFX1VVSURcIixcbiAgICB9LFxuICAgIHNlc3Npb246IHtcbiAgICAgIGlkOiBcIkFOX0lEXCIsXG4gICAgfSxcbiAgfSxcbiAgb25TZW5kOiAoZXZlbnQpID0+IHtcbiAgICAvLy8gc2VuZCB0byBnb29nbGUgYW5hbHl0aWNzIG9yIG90aGVyIHRyYWNraW5nIHBhcnRuZXIgaGVyZVxuICB9LFxufSk7XG5cbmZ1bmN0aW9uIE15QXBwKHsgQ29tcG9uZW50LCBwYWdlUHJvcHMgfSkge1xuICByZXR1cm4gKFxuICAgIDxIQW5hbHl0aWNzUHJvdmlkZXJcbiAgICAgIGdldENvbmZpZz17KCkgPT4gZ2V0SEFuYWx5dGljc0NvbmZpZygpfVxuICAgICAgYm9vdHN0cmFwRXhwZXJpbWVudHM9e3BhZ2VQcm9wcy5leHBlcmltZW50c0Jvb3RzdHJhcH1cbiAgICA+XG4gICAgICA8Q29tcG9uZW50IHsuLi5wYWdlUHJvcHN9IC8+XG4gICAgPC9IQW5hbHl0aWNzUHJvdmlkZXI+XG4gICk7XG59XG5cbk15QXBwLmdldEluaXRpYWxQcm9wcyA9IGFzeW5jIChhcHBjdHgpID0+IHtcbiAgY29uc3QgZXhwZXJpbWVudHNCb290c3RyYXAgPSBhd2FpdCBib290c3RyYXBFeHBlcmltZW50cyhnZXRIQW5hbHl0aWNzQ29uZmlnKTtcbiAgcmV0dXJuIHsgcGFnZVByb3BzOiB7IGV4cGVyaW1lbnRzQm9vdHN0cmFwIH0gfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IE15QXBwO1xuIl0sIm5hbWVzIjpbIkhBbmFseXRpY3NQcm92aWRlciIsImJvb3RzdHJhcEV4cGVyaW1lbnRzIiwiZ2V0SEFuYWx5dGljc0NvbmZpZyIsImh0dHBIZWFkZXJzIiwiZW5kcG9pbnRVUkwiLCJjb250ZXh0IiwibG9jYWxlIiwiYXBwIiwibmFtZSIsIm5hbWVzcGFjZSIsInZlcnNpb24iLCJidWlsZCIsImRldmljZSIsImlkIiwic2Vzc2lvbiIsIm9uU2VuZCIsImV2ZW50IiwiTXlBcHAiLCJDb21wb25lbnQiLCJwYWdlUHJvcHMiLCJnZXRDb25maWciLCJleHBlcmltZW50c0Jvb3RzdHJhcCIsImdldEluaXRpYWxQcm9wcyIsImFwcGN0eCJdLCJzb3VyY2VSb290IjoiIn0=\n//# sourceURL=webpack-internal:///./pages/_app.js\n");

/***/ }),

/***/ "./styles/globals.css":
/*!****************************!*\
  !*** ./styles/globals.css ***!
  \****************************/
/***/ (() => {



/***/ }),

/***/ "@hedviginsurance/hanalytics-client":
/*!*****************************************************!*\
  !*** external "@hedviginsurance/hanalytics-client" ***!
  \*****************************************************/
/***/ ((module) => {

"use strict";
module.exports = require("@hedviginsurance/hanalytics-client");

/***/ }),

/***/ "react/jsx-dev-runtime":
/*!****************************************!*\
  !*** external "react/jsx-dev-runtime" ***!
  \****************************************/
/***/ ((module) => {

"use strict";
module.exports = require("react/jsx-dev-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__("./pages/_app.js"));
module.exports = __webpack_exports__;

})();