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
/******/ 	return __webpack_require__(__webpack_require__.s = 7);
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
/***/ (function(module, exports) {

module.exports = require("moment");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

let getConfigParam = (() => {
  var _ref = _asyncToGenerator(function* (name) {
    const result = yield client.query({
      fetchPolicy: 'network-only',
      query: _graphqlTag2.default`
      query {
        allConfigs {
          id,
          ${name}
        }  
      }
    `
    });

    const config = result.data.allConfigs[0];
    configId = config.id;

    return config[name];
  });

  return function getConfigParam(_x) {
    return _ref.apply(this, arguments);
  };
})();

let setConfigParam = (() => {
  var _ref2 = _asyncToGenerator(function* (name, value) {
    yield client.mutate({
      mutation: _graphqlTag2.default`
      mutation {
        updateConfig (
          id: "${configId}",
          ${name}: "${value}"
        ) {
          id
        }
      }
    `
    });
    return undefined;
  });

  return function setConfigParam(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
})();

let addIncidents = (() => {
  var _ref3 = _asyncToGenerator(function* (incidents) {
    for (const incident of incidents) {
      yield addIncident(incident);
    }
    _winston2.default.info(`Database: saved ${incidents.length} incidents`);
  });

  return function addIncidents(_x4) {
    return _ref3.apply(this, arguments);
  };
})();

let addIncident = (() => {
  var _ref4 = _asyncToGenerator(function* (incident) {
    if (yield isIncidentUnsaved(incident)) {
      createIncident(incident);
    }
  });

  return function addIncident(_x5) {
    return _ref4.apply(this, arguments);
  };
})();

let createIncident = (() => {
  var _ref5 = _asyncToGenerator(function* (incident) {
    _winston2.default.debug('Creating new Incident', incident);
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

  return function createIncident(_x6) {
    return _ref5.apply(this, arguments);
  };
})();

let isIncidentUnsaved = (() => {
  var _ref6 = _asyncToGenerator(function* (incident) {
    const { data: { Incident } } = yield client.query({
      fetchPolicy: 'network-only',
      query: _graphqlTag2.default`
      query {
        Incident(caseNumber: "${incident.caseNumber}") {
          id,
          caseNumber
        }  
      }
    `
    });
    _winston2.default.debug(`Database: case number ${incident.caseNumber} does not already exist`);
    return Incident == null;
  });

  return function isIncidentUnsaved(_x7) {
    return _ref6.apply(this, arguments);
  };
})();

var _apolloClient = __webpack_require__(9);

var _apolloClient2 = _interopRequireDefault(_apolloClient);

var _envalid = __webpack_require__(1);

var _envalid2 = _interopRequireDefault(_envalid);

var _graphqlTag = __webpack_require__(10);

var _graphqlTag2 = _interopRequireDefault(_graphqlTag);

__webpack_require__(11);

var _moment = __webpack_require__(2);

var _moment2 = _interopRequireDefault(_moment);

var _winston = __webpack_require__(0);

var _winston2 = _interopRequireDefault(_winston);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

let client, configId;

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
    database = Object.freeze({ getConfigParam, setConfigParam, addIncidents });
    _winston2.default.info('Database: successfully connected to GraphQL endpoint.');
  }
  return database;
};

/***/ }),
/* 4 */
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
    _winston2.default.info(`Maps: geocoded ${newIncidents.length} incidents`);
    return newIncidents;
  });

  return function addLocationInfoToIncidents(_x) {
    return _ref.apply(this, arguments);
  };
})();

let geocodeAddress = (() => {
  var _ref2 = _asyncToGenerator(function* ({ streetAddress, city, state }) {
    const address = [streetAddress, city, state].join(', ');
    _winston2.default.debug(`Maps: about to geocode ${address}`);
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
      _winston2.default.debug(`Maps: geocode successful: ${address} ${lat} ${lng}`);
      return { address, lat, lng };
    }
  });

  return function geocodeAddress(_x2) {
    return _ref2.apply(this, arguments);
  };
})();

var _maps = __webpack_require__(8);

var _maps2 = _interopRequireDefault(_maps);

var _envalid = __webpack_require__(1);

var _envalid2 = _interopRequireDefault(_envalid);

var _lodash = __webpack_require__(12);

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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

let scrape = (() => {
  var _ref = _asyncToGenerator(function* (date) {
    return scrapeRange(date, date);
  });

  return function scrape(_x) {
    return _ref.apply(this, arguments);
  };
})();

let scrapeRange = (() => {
  var _ref2 = _asyncToGenerator(function* (startMoment, endMoment) {
    const options = {
      method: 'POST',
      form: _extends({
        btnGo: 'Go',
        RequestType: 'radbtnDetails'
      }, getFormDateFields(startMoment, endMoment), (yield getFormSecurityFields()))
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
      _winston2.default.info(`Scraper: ${incidents.length} incidents retreived`);
      return incidents;
    } catch (err) {
      _winston2.default.error('Scraper: error while fetching incidents', err);
      throw err;
    }
  });

  return function scrapeRange(_x2, _x3) {
    return _ref2.apply(this, arguments);
  };
})();

let getFormSecurityFields = (() => {
  var _ref3 = _asyncToGenerator(function* () {
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
    return _ref3.apply(this, arguments);
  };
})();

var _envalid = __webpack_require__(1);

var _envalid2 = _interopRequireDefault(_envalid);

var _requestXRay = __webpack_require__(13);

var _requestXRay2 = _interopRequireDefault(_requestXRay);

var _xRay = __webpack_require__(14);

var _xRay2 = _interopRequireDefault(_xRay);

var _winston = __webpack_require__(0);

var _winston2 = _interopRequireDefault(_winston);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

let POLICE_INCIDENT_URL;
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const getFormDateFields = (startMoment, endMoment) => {
  return {
    ddlFromMonth: startMoment.month(),
    ddlFromDate: startMoment.date(),
    ddlFromYear: startMoment.year(),
    ddlToMonth: endMoment.month(),
    ddlToDate: endMoment.date(),
    ddlToYear: endMoment.year()
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
      scrape
    });
    _winston2.default.info('Scraper: initialized');
  }
  return scraper;
};

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("bluebird");

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


let run = (() => {
  var _ref = _asyncToGenerator(function* () {
    _winston2.default.info('Police Daily Activity Importer starting...');
    let numMapsRequests = 0;
    while (true) {
      const lastImportDateStr = yield (0, _database2.default)().getConfigParam('lastImportedDate');
      console.log(lastImportDateStr);
      const dateToImport = (0, _moment2.default)(lastImportDateStr).add(1, 'days');
      console.log(dateToImport);

      if (!dateToImport.isBefore((0, _moment2.default)(), 'date')) {
        _winston2.default.info('Up to date. Exiting...');
        break;
      }

      _winston2.default.info(`Importing ${dateToImport.toString()}`);

      const scrapedIncidents = yield (0, _scraper2.default)().scrape(dateToImport);
      if (scrapedIncidents.length + numMapsRequests > MAPS_REQUESTS_PER_DAY) {
        _winston2.default.info('Import suspended: maps quota exceeded.');
        break;
      }
      const incidentsWithLocation = yield (0, _maps2.default)().addLocationInfoToIncidents(scrapedIncidents);
      yield (0, _database2.default)().addIncidents(incidentsWithLocation);
      yield (0, _database2.default)().setConfigParam('lastImportedDate', dateToImport.toISOString());
      numMapsRequests += scrapedIncidents.length;
      _winston2.default.info(`${dateToImport.toString()} successfully imported. Quota remaining: ${MAPS_REQUESTS_PER_DAY - numMapsRequests}`);
    }
  });

  return function run() {
    return _ref.apply(this, arguments);
  };
})();

var _bluebird = __webpack_require__(6);

var _bluebird2 = _interopRequireDefault(_bluebird);

var _moment = __webpack_require__(2);

var _moment2 = _interopRequireDefault(_moment);

var _winston = __webpack_require__(0);

var _winston2 = _interopRequireDefault(_winston);

var _database = __webpack_require__(3);

var _database2 = _interopRequireDefault(_database);

var _maps = __webpack_require__(4);

var _maps2 = _interopRequireDefault(_maps);

var _scraper = __webpack_require__(5);

var _scraper2 = _interopRequireDefault(_scraper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /* global Promise:true */


_winston2.default.level = 'debug';

process.env.TZ = 'UTC';
Promise = _bluebird2.default;

const MAPS_REQUESTS_PER_DAY = 2450;

run().catch(err => _winston2.default.error(err));

/***/ }),
/* 8 */
/***/ (function(module, exports) {

module.exports = require("@google/maps");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("apollo-client");

/***/ }),
/* 10 */
/***/ (function(module, exports) {

module.exports = require("graphql-tag");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("isomorphic-fetch");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("request-x-ray");

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("x-ray");

/***/ })
/******/ ]);
//# sourceMappingURL=index.js.map