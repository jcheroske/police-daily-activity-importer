/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 6);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("winston");

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("envalid");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

let addIncidents = (() => {
  var _ref = _asyncToGenerator(function* (incidents) {
    for (const incident of incidents) {
      yield addIncident(incident);
    }
  });

  return function addIncidents(_x) {
    return _ref.apply(this, arguments);
  };
})();

let addIncident = (() => {
  var _ref2 = _asyncToGenerator(function* (incident) {
    if (yield isIncidentUnsaved(incident)) {
      createIncident(incident);
    }
  });

  return function addIncident(_x2) {
    return _ref2.apply(this, arguments);
  };
})();

let createIncident = (() => {
  var _ref3 = _asyncToGenerator(function* (incident) {
    _winston2.default.info('Creating new Incident', incident);
    const { data: { createIncident } } = yield client.mutate({
      mutation: _graphqlTag2.default`
      mutation {
        createIncident(
          caseNumber: "${incident.caseNumber}"
          description: "${incident.description}"
          offense: "${incident.offense}"
          reportedAt: "${incident.reportedAt.toISOString()}"
          streetAddress: "${incident.streetAddress}"
        ) {
          id,
          caseNumber
        }
      }
    `
    });
    return createIncident;
  });

  return function createIncident(_x3) {
    return _ref3.apply(this, arguments);
  };
})();

let isIncidentUnsaved = (() => {
  var _ref4 = _asyncToGenerator(function* (incident) {
    const { data: { Incident } } = yield client.query({
      query: _graphqlTag2.default`
      query {
        Incident(caseNumber: "${incident.caseNumber}") {
          id,
          caseNumber
        }  
      }
    `
    });
    _winston2.default.info('Databae: ');
    return Incident == null;
  });

  return function isIncidentUnsaved(_x4) {
    return _ref4.apply(this, arguments);
  };
})();

var _apolloClient = __webpack_require__(8);

var _apolloClient2 = _interopRequireDefault(_apolloClient);

var _envalid = __webpack_require__(1);

var _envalid2 = _interopRequireDefault(_envalid);

var _graphqlTag = __webpack_require__(9);

var _graphqlTag2 = _interopRequireDefault(_graphqlTag);

__webpack_require__(10);

var _winston = __webpack_require__(0);

var _winston2 = _interopRequireDefault(_winston);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

let client;

let database;

exports.default = () => {
  if (!database) {
    const env = _envalid2.default.cleanEnv(process.env, {
      GRAPH_QL_ENDPOINT: (0, _envalid.str)({ desc: 'GraphQL endpoint URL' })
    });

    _winston2.default.info('Database: connecting to GraphQL endpoint.');
    client = new _apolloClient2.default({
      networkInterface: (0, _apolloClient.createNetworkInterface)({
        uri: env.GRAPH_QL_ENDPOINT
      })
    });
    database = Object.freeze({ addIncidents });
    _winston2.default.info('Database: successfully connected to GraphQL endpoint.');
  }
  return database;
};

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

let addLocationInfoToIncidents = (() => {
  var _ref = _asyncToGenerator(function* (incidents) {
    const newIncidents = [];
    for (const incident of incidents) {
      const locationInfo = yield geocodeAddress({
        streetAddress: incident.streetAddress,
        city: 'Bellingham',
        state: 'WA'
      });

      if (locationInfo) {
        newIncidents.push(_extends({}, incident, {
          streetAddress: locationInfo.address.split(',')[0].trim(),
          zipCode: locationInfo.address.match(/\d{5}/)[0],
          lat: locationInfo.lat,
          lng: locationInfo.lng
        }));
      }
    }
    return newIncidents;
  });

  return function addLocationInfoToIncidents(_x) {
    return _ref.apply(this, arguments);
  };
})();

let geocodeAddress = (() => {
  var _ref2 = _asyncToGenerator(function* ({ streetAddress, city, state }) {
    const address = [streetAddress, city, state].join(', ');
    _winston2.default.info(`Maps: about to geocode ${address}`);
    let response;
    try {
      response = yield client.geocode({ address }).asPromise();
    } catch (err) {
      _winston2.default.error('Error during geocode', err);
    }

    if (!response || (0, _lodash.isEmpty)(response.json.results)) {
      _winston2.default.warn(`Maps: geocode failed for ${address}`);
      return undefined;
    } else {
      const { formatted_address: address, geometry: { location: { lat, lng } } } = response.json.results[0];
      _winston2.default.info(`Maps: geocode successful: ${address} ${lat} ${lng}`);
      return { address, lat, lng };
    }
  });

  return function geocodeAddress(_x2) {
    return _ref2.apply(this, arguments);
  };
})();

var _maps = __webpack_require__(7);

var _maps2 = _interopRequireDefault(_maps);

var _envalid = __webpack_require__(1);

var _envalid2 = _interopRequireDefault(_envalid);

var _lodash = __webpack_require__(11);

var _winston = __webpack_require__(0);

var _winston2 = _interopRequireDefault(_winston);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

let client;

let maps;

exports.default = () => {
  if (!maps) {
    const env = _envalid2.default.cleanEnv(process.env, {
      GOOGLE_MAPS_API_KEY: (0, _envalid.str)({ desc: 'Google maps node API key' })
    });

    client = _maps2.default.createClient({
      key: env.GOOGLE_MAPS_API_KEY,
      Promise
    });

    maps = Object.freeze({ addLocationInfoToIncidents });
    _winston2.default.info('Maps: initialized');
  }
  return maps;
};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

let scrapeRange = (() => {
  var _ref = _asyncToGenerator(function* (start, end) {
    const options = {
      method: 'POST',
      form: _extends({
        btnGo: 'Go',
        RequestType: 'radbtnDetails'
      }, getFormDateFields(start, end), (yield getFormSecurityFields()))
    };

    const xRay = (0, _xRay2.default)({
      filters: {
        parseDate,
        parseAddress,
        parseDescription,
        trim
      }
    });
    xRay.driver((0, _requestXRay2.default)(options));

    const selector = {
      incidents: xRay('td.info', [{
        reportedAt: 'b:nth-of-type(1) | parseDate',
        streetAddress: 'b:nth-of-type(2) | parseAddress | trim',
        offense: 'b:nth-of-type(3) | trim',
        caseNumber: 'b:nth-of-type(4) | trim',
        description: '@html | parseDescription | trim'
      }])
    };

    try {
      const { incidents } = yield Promise.fromCallback(function (cb) {
        return xRay(POLICE_INCIDENT_URL, selector)(cb);
      });
      incidents.splice(1);
      _winston2.default.info(`Scraper: ${incidents.length} incidents retreived`);
      return incidents;
    } catch (err) {
      _winston2.default.error('Scraper: error while fetching incidents', err);
      throw err;
    }
  });

  return function scrapeRange(_x, _x2) {
    return _ref.apply(this, arguments);
  };
})();

let getFormSecurityFields = (() => {
  var _ref2 = _asyncToGenerator(function* () {
    const selector = {
      '__VIEWSTATE': 'input[name="__VIEWSTATE"]@value',
      '__VIEWSTATEGENERATOR': 'input[name="__VIEWSTATEGENERATOR"]@value',
      '__EVENTVALIDATION': 'input[name="__EVENTVALIDATION"]@value'
    };

    const xRay = (0, _xRay2.default)();
    try {
      const securityFields = yield Promise.fromCallback(function (cb) {
        return xRay(POLICE_INCIDENT_URL, selector)(cb);
      });
      _winston2.default.info('Scraper: obtained security fields');
      return securityFields;
    } catch (err) {
      _winston2.default.error('Scraper: error while fetching security fields', err);
      throw err;
    }
  });

  return function getFormSecurityFields() {
    return _ref2.apply(this, arguments);
  };
})();

var _envalid = __webpack_require__(1);

var _envalid2 = _interopRequireDefault(_envalid);

var _requestXRay = __webpack_require__(12);

var _requestXRay2 = _interopRequireDefault(_requestXRay);

var _xRay = __webpack_require__(13);

var _xRay2 = _interopRequireDefault(_xRay);

var _winston = __webpack_require__(0);

var _winston2 = _interopRequireDefault(_winston);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

let POLICE_INCIDENT_URL;
const MILLIS_IN_DAY = 1000 * 60 * 60 * 24;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function scrapeLastTwoDays() {
  const end = new Date();
  const start = new Date(Date.now() - MILLIS_IN_DAY);

  return scrapeRange(start, end);
}

const getFormDateFields = (start, end) => {
  return {
    ddlFromMonth: start.getMonth(),
    ddlFromDate: start.getDate(),
    ddlFromYear: start.getFullYear(),
    ddlToMonth: end.getMonth(),
    ddlToDate: end.getDate(),
    ddlToYear: end.getFullYear()
  };
};

const parseDate = value => {
  if (!value) return undefined;

  const re = /([A-Z][a-z]{2})\s+(\d{1,2})\s+(\d{4})\s+(\d{1,2}):(\d{2})(AM|PM)/;
  const result = re.exec(value);
  const date = [result[3], // year
  MONTHS.indexOf(result[1]), // month
  result[2], // day
  result[6] === 'PM' && Number(result[4]) < 12 ? Number(result[4]) + 12 : result[4], // hour
  result[5] // minute
  ];

  return new Date(...date);
};

const parseAddress = value => value.replace('BLK', '').replace(/\s+/g, ' ');

const parseDescription = value => {
  if (!value) return undefined;

  const re = /([^>]*)(<br>)?$/;
  const result = re.exec(value);
  return result == null ? undefined : result[1].replace(/(\s|\\n|\\r|\\t)+/g, ' ');
};

const trim = value => value.trim();

let scraper;

exports.default = () => {
  if (!scraper) {
    const env = _envalid2.default.cleanEnv(process.env, {
      POLICE_INCIDENT_URL: (0, _envalid.str)({ desc: 'Police daily activity URL' })
    });

    POLICE_INCIDENT_URL = env.POLICE_INCIDENT_URL;
    scraper = Object.freeze({
      scrapeLastTwoDays,
      scrapeRange
    });
    _winston2.default.info('Scraper: initialized');
  }
  return scraper;
};

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = require("bluebird");

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let importLastTwoDays = (() => {
  var _ref = _asyncToGenerator(function* () {
    const scrapedIncidents = yield (0, _scraper2.default)().scrapeLastTwoDays();
    const incidentsWithLocation = yield (0, _maps2.default)().addLocationInfoToIncidents(scrapedIncidents);
    yield (0, _database2.default)().addIncidents(incidentsWithLocation);
  });

  return function importLastTwoDays() {
    return _ref.apply(this, arguments);
  };
})();

var _bluebird = __webpack_require__(5);

var _bluebird2 = _interopRequireDefault(_bluebird);

var _winston = __webpack_require__(0);

var _winston2 = _interopRequireDefault(_winston);

var _database = __webpack_require__(2);

var _database2 = _interopRequireDefault(_database);

var _maps = __webpack_require__(3);

var _maps2 = _interopRequireDefault(_maps);

var _scraper = __webpack_require__(4);

var _scraper2 = _interopRequireDefault(_scraper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /* global Promise:true */


Promise = _bluebird2.default;

_winston2.default.info('Police Daily Activity Importer starting...');

importLastTwoDays().catch(err => console.log(err));

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = require("@google/maps");

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("apollo-client");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("graphql-tag");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("isomorphic-fetch");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("request-x-ray");

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("x-ray");

/***/ })
/******/ ]);
//# sourceMappingURL=index.js.map