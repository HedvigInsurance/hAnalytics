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
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export */ __webpack_require__.d(__webpack_exports__, {\n/* harmony export */   \"default\": () => (__WEBPACK_DEFAULT_EXPORT__)\n/* harmony export */ });\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-dev-runtime */ \"react/jsx-dev-runtime\");\n/* harmony import */ var react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../styles/globals.css */ \"./styles/globals.css\");\n/* harmony import */ var _styles_globals_css__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_styles_globals_css__WEBPACK_IMPORTED_MODULE_1__);\n/* harmony import */ var _hedviginsurance_hanalytics_client__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @hedviginsurance/hanalytics-client */ \"@hedviginsurance/hanalytics-client\");\n/* harmony import */ var _hedviginsurance_hanalytics_client__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_hedviginsurance_hanalytics_client__WEBPACK_IMPORTED_MODULE_2__);\n\n\n\nconst getHAnalyticsConfig = (userAgent)=>({\n        httpHeaders: {},\n        endpointURL: \"https://hanalytics-staging.herokuapp.com\",\n        context: {\n            locale: \"sv-SE\",\n            app: {\n                name: \"NextJSExample\",\n                namespace: \"staging\",\n                version: \"1.0.0\",\n                build: \"3000\"\n            },\n            device: {\n                id: \"STORE_THE_UUID\"\n            },\n            session: {\n                id: \"AN_ID\"\n            }\n        },\n        userAgent,\n        onEvent: (event)=>{\n            if (false) {}\n        }\n    })\n;\nfunction MyApp({ Component , pageProps  }) {\n    return(/*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.Fragment, {\n        children: [\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(_hedviginsurance_hanalytics_client__WEBPACK_IMPORTED_MODULE_2__.HAnalyticsProvider, {\n                getConfig: ()=>getHAnalyticsConfig(pageProps.userAgent)\n                ,\n                bootstrapExperiments: pageProps.experimentsBootstrap,\n                children: /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(Component, {\n                    ...pageProps\n                }, void 0, false, {\n                    fileName: \"/Users/sampettersson/dev/hAnalytics/examples/next.js/pages/_app.js\",\n                    lineNumber: 40,\n                    columnNumber: 9\n                }, this)\n            }, void 0, false, {\n                fileName: \"/Users/sampettersson/dev/hAnalytics/examples/next.js/pages/_app.js\",\n                lineNumber: 36,\n                columnNumber: 7\n            }, this),\n            /*#__PURE__*/ (0,react_jsx_dev_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxDEV)(\"div\", {\n                dangerouslySetInnerHTML: {\n                    __html: `\n          <script async src=\"https://www.googletagmanager.com/gtag/js?id=G-TGSXK2QHSD\"></script>\n          <script>\n            window.dataLayer = window.dataLayer || [];\n            function gtag(){dataLayer.push(arguments);}\n            gtag('js', new Date());\n          \n            gtag('config', 'G-TGSXK2QHSD');\n          </script>\n          `\n                }\n            }, void 0, false, {\n                fileName: \"/Users/sampettersson/dev/hAnalytics/examples/next.js/pages/_app.js\",\n                lineNumber: 42,\n                columnNumber: 7\n            }, this)\n        ]\n    }, void 0, true));\n}\nMyApp.getInitialProps = async ({ ctx  })=>{\n    const userAgent = ctx.req ? ctx.req.headers[\"user-agent\"] : navigator.userAgent;\n    const experimentsBootstrap = await (0,_hedviginsurance_hanalytics_client__WEBPACK_IMPORTED_MODULE_2__.bootstrapExperiments)(()=>getHAnalyticsConfig(userAgent)\n    );\n    return {\n        pageProps: {\n            experimentsBootstrap,\n            userAgent\n        }\n    };\n};\n/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MyApp);\n//# sourceURL=[module]\n//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiLi9wYWdlcy9fYXBwLmpzLmpzIiwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0FBQThCO0FBSWE7QUFFM0MsS0FBSyxDQUFDRSxtQkFBbUIsSUFBSUMsU0FBUyxJQUFNLENBQUM7UUFDM0NDLFdBQVcsRUFBRSxDQUFDLENBQUM7UUFDZkMsV0FBVyxFQUFFLENBQTBDO1FBQ3ZEQyxPQUFPLEVBQUUsQ0FBQztZQUNSQyxNQUFNLEVBQUUsQ0FBTztZQUNmQyxHQUFHLEVBQUUsQ0FBQztnQkFDSkMsSUFBSSxFQUFFLENBQWU7Z0JBQ3JCQyxTQUFTLEVBQUUsQ0FBUztnQkFDcEJDLE9BQU8sRUFBRSxDQUFPO2dCQUNoQkMsS0FBSyxFQUFFLENBQU07WUFDZixDQUFDO1lBQ0RDLE1BQU0sRUFBRSxDQUFDO2dCQUNQQyxFQUFFLEVBQUUsQ0FBZ0I7WUFDdEIsQ0FBQztZQUNEQyxPQUFPLEVBQUUsQ0FBQztnQkFDUkQsRUFBRSxFQUFFLENBQU87WUFDYixDQUFDO1FBQ0gsQ0FBQztRQUNEWCxTQUFTO1FBQ1RhLE9BQU8sR0FBR0MsS0FBSyxHQUFLLENBQUM7WUFDbkIsRUFBRSxFQUFFLEtBQTZCLEVBQUUsRUFFbEM7UUFDSCxDQUFDO0lBQ0gsQ0FBQzs7U0FFUUksS0FBSyxDQUFDLENBQUMsQ0FBQ0MsU0FBUyxHQUFFQyxTQUFTLEVBQUMsQ0FBQyxFQUFFLENBQUM7SUFDeEMsTUFBTTs7d0ZBRUR2QixrRkFBa0I7Z0JBQ2pCd0IsU0FBUyxNQUFRdEIsbUJBQW1CLENBQUNxQixTQUFTLENBQUNwQixTQUFTOztnQkFDeERGLG9CQUFvQixFQUFFc0IsU0FBUyxDQUFDRSxvQkFBb0I7c0dBRW5ESCxTQUFTO3VCQUFLQyxTQUFTOzs7Ozs7Ozs7Ozt3RkFFekJHLENBQUc7Z0JBQ0ZDLHVCQUF1QixFQUFFLENBQUM7b0JBQ3hCQyxNQUFNLEdBQUc7Ozs7Ozs7OztVQVNUO2dCQUNGLENBQUM7Ozs7Ozs7O0FBSVQsQ0FBQztBQUVEUCxLQUFLLENBQUNRLGVBQWUsVUFBVSxDQUFDLENBQUNDLEdBQUcsRUFBQyxDQUFDLEdBQUssQ0FBQztJQUMxQyxLQUFLLENBQUMzQixTQUFTLEdBQUcyQixHQUFHLENBQUNDLEdBQUcsR0FDckJELEdBQUcsQ0FBQ0MsR0FBRyxDQUFDQyxPQUFPLENBQUMsQ0FBWSxlQUM1QkMsU0FBUyxDQUFDOUIsU0FBUztJQUV2QixLQUFLLENBQUNzQixvQkFBb0IsR0FBRyxLQUFLLENBQUN4Qix3RkFBb0IsS0FDckRDLG1CQUFtQixDQUFDQyxTQUFTOztJQUcvQixNQUFNLENBQUMsQ0FBQztRQUFDb0IsU0FBUyxFQUFFLENBQUM7WUFBQ0Usb0JBQW9CO1lBQUV0QixTQUFTO1FBQUMsQ0FBQztJQUFDLENBQUM7QUFDM0QsQ0FBQztBQUVELGlFQUFla0IsS0FBSyxFQUFDIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vaGFuYWx5dGljcy1leGFtcGxlLy4vcGFnZXMvX2FwcC5qcz9lMGFkIl0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBcIi4uL3N0eWxlcy9nbG9iYWxzLmNzc1wiO1xuaW1wb3J0IHtcbiAgSEFuYWx5dGljc1Byb3ZpZGVyLFxuICBib290c3RyYXBFeHBlcmltZW50cyxcbn0gZnJvbSBcIkBoZWR2aWdpbnN1cmFuY2UvaGFuYWx5dGljcy1jbGllbnRcIjtcblxuY29uc3QgZ2V0SEFuYWx5dGljc0NvbmZpZyA9ICh1c2VyQWdlbnQpID0+ICh7XG4gIGh0dHBIZWFkZXJzOiB7fSxcbiAgZW5kcG9pbnRVUkw6IFwiaHR0cHM6Ly9oYW5hbHl0aWNzLXN0YWdpbmcuaGVyb2t1YXBwLmNvbVwiLFxuICBjb250ZXh0OiB7XG4gICAgbG9jYWxlOiBcInN2LVNFXCIsXG4gICAgYXBwOiB7XG4gICAgICBuYW1lOiBcIk5leHRKU0V4YW1wbGVcIixcbiAgICAgIG5hbWVzcGFjZTogXCJzdGFnaW5nXCIsXG4gICAgICB2ZXJzaW9uOiBcIjEuMC4wXCIsXG4gICAgICBidWlsZDogXCIzMDAwXCIsXG4gICAgfSxcbiAgICBkZXZpY2U6IHtcbiAgICAgIGlkOiBcIlNUT1JFX1RIRV9VVUlEXCIsXG4gICAgfSxcbiAgICBzZXNzaW9uOiB7XG4gICAgICBpZDogXCJBTl9JRFwiLFxuICAgIH0sXG4gIH0sXG4gIHVzZXJBZ2VudCxcbiAgb25FdmVudDogKGV2ZW50KSA9PiB7XG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIHdpbmRvdy5ndGFnKFwiZXZlbnRcIiwgZXZlbnQubmFtZSwgZXZlbnQucHJvcGVydGllcyk7XG4gICAgfVxuICB9LFxufSk7XG5cbmZ1bmN0aW9uIE15QXBwKHsgQ29tcG9uZW50LCBwYWdlUHJvcHMgfSkge1xuICByZXR1cm4gKFxuICAgIDw+XG4gICAgICA8SEFuYWx5dGljc1Byb3ZpZGVyXG4gICAgICAgIGdldENvbmZpZz17KCkgPT4gZ2V0SEFuYWx5dGljc0NvbmZpZyhwYWdlUHJvcHMudXNlckFnZW50KX1cbiAgICAgICAgYm9vdHN0cmFwRXhwZXJpbWVudHM9e3BhZ2VQcm9wcy5leHBlcmltZW50c0Jvb3RzdHJhcH1cbiAgICAgID5cbiAgICAgICAgPENvbXBvbmVudCB7Li4ucGFnZVByb3BzfSAvPlxuICAgICAgPC9IQW5hbHl0aWNzUHJvdmlkZXI+XG4gICAgICA8ZGl2XG4gICAgICAgIGRhbmdlcm91c2x5U2V0SW5uZXJIVE1MPXt7XG4gICAgICAgICAgX19odG1sOiBgXG4gICAgICAgICAgPHNjcmlwdCBhc3luYyBzcmM9XCJodHRwczovL3d3dy5nb29nbGV0YWdtYW5hZ2VyLmNvbS9ndGFnL2pzP2lkPUctVEdTWEsyUUhTRFwiPjwvc2NyaXB0PlxuICAgICAgICAgIDxzY3JpcHQ+XG4gICAgICAgICAgICB3aW5kb3cuZGF0YUxheWVyID0gd2luZG93LmRhdGFMYXllciB8fCBbXTtcbiAgICAgICAgICAgIGZ1bmN0aW9uIGd0YWcoKXtkYXRhTGF5ZXIucHVzaChhcmd1bWVudHMpO31cbiAgICAgICAgICAgIGd0YWcoJ2pzJywgbmV3IERhdGUoKSk7XG4gICAgICAgICAgXG4gICAgICAgICAgICBndGFnKCdjb25maWcnLCAnRy1UR1NYSzJRSFNEJyk7XG4gICAgICAgICAgPC9zY3JpcHQ+XG4gICAgICAgICAgYCxcbiAgICAgICAgfX1cbiAgICAgID48L2Rpdj5cbiAgICA8Lz5cbiAgKTtcbn1cblxuTXlBcHAuZ2V0SW5pdGlhbFByb3BzID0gYXN5bmMgKHsgY3R4IH0pID0+IHtcbiAgY29uc3QgdXNlckFnZW50ID0gY3R4LnJlcVxuICAgID8gY3R4LnJlcS5oZWFkZXJzW1widXNlci1hZ2VudFwiXVxuICAgIDogbmF2aWdhdG9yLnVzZXJBZ2VudDtcblxuICBjb25zdCBleHBlcmltZW50c0Jvb3RzdHJhcCA9IGF3YWl0IGJvb3RzdHJhcEV4cGVyaW1lbnRzKCgpID0+XG4gICAgZ2V0SEFuYWx5dGljc0NvbmZpZyh1c2VyQWdlbnQpXG4gICk7XG5cbiAgcmV0dXJuIHsgcGFnZVByb3BzOiB7IGV4cGVyaW1lbnRzQm9vdHN0cmFwLCB1c2VyQWdlbnQgfSB9O1xufTtcblxuZXhwb3J0IGRlZmF1bHQgTXlBcHA7XG4iXSwibmFtZXMiOlsiSEFuYWx5dGljc1Byb3ZpZGVyIiwiYm9vdHN0cmFwRXhwZXJpbWVudHMiLCJnZXRIQW5hbHl0aWNzQ29uZmlnIiwidXNlckFnZW50IiwiaHR0cEhlYWRlcnMiLCJlbmRwb2ludFVSTCIsImNvbnRleHQiLCJsb2NhbGUiLCJhcHAiLCJuYW1lIiwibmFtZXNwYWNlIiwidmVyc2lvbiIsImJ1aWxkIiwiZGV2aWNlIiwiaWQiLCJzZXNzaW9uIiwib25FdmVudCIsImV2ZW50Iiwid2luZG93IiwiZ3RhZyIsInByb3BlcnRpZXMiLCJNeUFwcCIsIkNvbXBvbmVudCIsInBhZ2VQcm9wcyIsImdldENvbmZpZyIsImV4cGVyaW1lbnRzQm9vdHN0cmFwIiwiZGl2IiwiZGFuZ2Vyb3VzbHlTZXRJbm5lckhUTUwiLCJfX2h0bWwiLCJnZXRJbml0aWFsUHJvcHMiLCJjdHgiLCJyZXEiLCJoZWFkZXJzIiwibmF2aWdhdG9yIl0sInNvdXJjZVJvb3QiOiIifQ==\n//# sourceURL=webpack-internal:///./pages/_app.js\n");

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