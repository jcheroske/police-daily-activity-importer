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
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _winston = __webpack_require__(15);

var _winston2 = _interopRequireDefault(_winston);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const consoleTransport = new _winston2.default.transports.Console({
  level:  true ? 'info' : 'debug',
  colorize: true,
  stderrLevels: ['error']
});

exports.default = new _winston2.default.Logger({
  levels: { error: 0, warn: 1, info: 2, verbose: 3, debug: 4 },
  transports: [consoleTransport]
});

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("envalid");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("moment-timezone");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

let getConfigId = (() => {
  var _ref = _asyncToGenerator(function* () {
    const result = yield client.query({
      fetchPolicy: 'network-only',
      query: _graphqlTag2.default`
      query {
        allConfigs {
          id
        }  
      }
    `
    });
    configId = result.data.allConfigs[0].id;
  });

  return function getConfigId() {
    return _ref.apply(this, arguments);
  };
})();

let getConfigParam = (() => {
  var _ref2 = _asyncToGenerator(function* (name) {
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
    return result.data.allConfigs[0][name];
  });

  return function getConfigParam(_x) {
    return _ref2.apply(this, arguments);
  };
})();

let setConfigParam = (() => {
  var _ref3 = _asyncToGenerator(function* (name, value) {
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
    return _ref3.apply(this, arguments);
  };
})();

let createIncident = (() => {
  var _ref4 = _asyncToGenerator(function* (incident) {
    _log2.default.debug('Creating new Incident', incident);
    const { data: { createIncident } } = yield client.mutate({
      mutation: _graphqlTag2.default`
      mutation {
        createIncident(
          caseNumber: "${incident.caseNumber}"
          description: "${incident.description}"
          offense: "${incident.offense}"
          reportedAt: "${incident.reportedAt}"
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

  return function createIncident(_x4) {
    return _ref4.apply(this, arguments);
  };
})();

let isIncidentUnsaved = (() => {
  var _ref5 = _asyncToGenerator(function* (incident) {
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
    _log2.default.debug(`Database: case number ${incident.caseNumber} ${Incident == null ? 'does not exist' : 'already exists'} in the database`);
    return Incident == null;
  });

  return function isIncidentUnsaved(_x5) {
    return _ref5.apply(this, arguments);
  };
})();

let deleteAllIncidents = (() => {
  var _ref6 = _asyncToGenerator(function* () {
    const { data: { allIncidents } } = yield client.query({
      fetchPolicy: 'network-only',
      query: _graphqlTag2.default`
      query {
        allIncidents {
          id
        }
      }
    `
    });

    for (const incident of allIncidents) {
      yield client.mutate({
        mutation: _graphqlTag2.default`
        mutation {
          deleteIncident(
            id: "${incident.id}"
          ) {
            id
          }
        }
      `
      });
      _log2.default.debug(`Database: incident ${incident.id} deleted`);
    }
  });

  return function deleteAllIncidents() {
    return _ref6.apply(this, arguments);
  };
})();

var _apolloClient = __webpack_require__(9);

var _apolloClient2 = _interopRequireDefault(_apolloClient);

var _envalid = __webpack_require__(1);

var _envalid2 = _interopRequireDefault(_envalid);

var _graphqlTag = __webpack_require__(11);

var _graphqlTag2 = _interopRequireDefault(_graphqlTag);

__webpack_require__(12);

var _log = __webpack_require__(0);

var _log2 = _interopRequireDefault(_log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

let client, configId;

let database;

exports.default = () => {
  if (!database) {
    const env = _envalid2.default.cleanEnv(process.env, {
      GRAPH_QL_ENDPOINT: (0, _envalid.str)({ desc: 'GraphQL endpoint URL' })
    });

    _log2.default.info('Database: connecting to GraphQL endpoint.');
    client = new _apolloClient2.default({
      networkInterface: (0, _apolloClient.createNetworkInterface)({
        uri: env.GRAPH_QL_ENDPOINT
      })
    });

    getConfigId();

    database = Object.freeze({
      getConfigParam,
      setConfigParam,
      createIncident,
      isIncidentUnsaved,
      deleteAllIncidents
    });
    _log2.default.info('Database: successfully connected to GraphQL endpoint.');
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
exports.QueryLimitExceeded = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

let addLocationInfoToIncident = (() => {
  var _ref = _asyncToGenerator(function* (incident) {
    const locationInfo = yield geocodeAddress({
      streetAddress: incident.streetAddress,
      city: 'Bellingham',
      state: 'WA'
    });

    return locationInfo ? _extends({}, incident, {
      streetAddress: locationInfo.address.split(',')[0].trim(),
      zipCode: locationInfo.address.match(/\d{5}/)[0],
      lat: locationInfo.lat,
      lng: locationInfo.lng
    }) : undefined;
  });

  return function addLocationInfoToIncident(_x) {
    return _ref.apply(this, arguments);
  };
})();

let geocodeAddress = (() => {
  var _ref2 = _asyncToGenerator(function* ({ streetAddress, city, state }) {
    const rawAddress = [streetAddress, city, state].join(', ');
    _log2.default.debug(`Maps: about to geocode ${rawAddress}`);

    const response = yield googleGeocode({ address: rawAddress });

    const { status, results } = response.json;
    if (status === 'OVER_QUERY_LIMIT') {
      throw new QueryLimitExceeded();
    }

    if (status !== 'OK') {
      _log2.default.warn(`Maps: geocode failed for ${rawAddress} with status ${status}`);
      return undefined;
    }

    const { formatted_address: address, geometry: { location: { lat, lng } } } = results[0];
    _log2.default.debug(`Maps: geocode successful: ${address} ${lat} ${lng}`);
    return { address, lat, lng };
  });

  return function geocodeAddress(_x2) {
    return _ref2.apply(this, arguments);
  };
})();

var _maps = __webpack_require__(8);

var _maps2 = _interopRequireDefault(_maps);

var _envalid = __webpack_require__(1);

var _envalid2 = _interopRequireDefault(_envalid);

var _es6Error = __webpack_require__(10);

var _es6Error2 = _interopRequireDefault(_es6Error);

var _simpleRateLimiter = __webpack_require__(14);

var _simpleRateLimiter2 = _interopRequireDefault(_simpleRateLimiter);

var _log = __webpack_require__(0);

var _log2 = _interopRequireDefault(_log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

let QueryLimitExceeded = exports.QueryLimitExceeded = class QueryLimitExceeded extends _es6Error2.default {
  constructor() {
    super('Google maps API query limit exceeded');
  }
};


let googleGeocode;

let maps;

exports.default = () => {
  if (!maps) {
    const env = _envalid2.default.cleanEnv(process.env, {
      GOOGLE_MAPS_API_KEY: (0, _envalid.str)({ desc: 'Google maps node API key' })
    });

    const client = _maps2.default.createClient({
      key: env.GOOGLE_MAPS_API_KEY,
      Promise
    });

    googleGeocode = Promise.promisify((0, _simpleRateLimiter2.default)(client.geocode.bind(client)).to(45).per(1000));

    maps = Object.freeze({ addLocationInfoToIncident });
    _log2.default.info('Maps: initialized');
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
    const options = {
      method: 'POST',
      form: _extends({
        btnGo: 'Go',
        RequestType: 'radbtnDetails'
      }, getFormDateFields(date, date), (yield getFormSecurityFields()))
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
        reportedAt: `b:nth-of-type(1) | parseDate:${date.toISOString()}`,
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
      _log2.default.info(`Scraper: ${incidents.length} incidents retreived`);
      _log2.default.debug('Scraped incidents', incidents);
      return incidents;
    } catch (err) {
      _log2.default.error('Scraper: error while fetching incidents', err);
      throw err;
    }
  });

  return function scrape(_x) {
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
      _log2.default.info('Scraper: obtained security fields');
      return securityFields;
    } catch (err) {
      _log2.default.error('Scraper: error while fetching security fields', err);
      throw err;
    }
  });

  return function getFormSecurityFields() {
    return _ref2.apply(this, arguments);
  };
})();

var _envalid = __webpack_require__(1);

var _envalid2 = _interopRequireDefault(_envalid);

var _momentTimezone = __webpack_require__(2);

var _momentTimezone2 = _interopRequireDefault(_momentTimezone);

var _requestXRay = __webpack_require__(13);

var _requestXRay2 = _interopRequireDefault(_requestXRay);

var _xRay = __webpack_require__(16);

var _xRay2 = _interopRequireDefault(_xRay);

var _log = __webpack_require__(0);

var _log2 = _interopRequireDefault(_log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

let POLICE_INCIDENT_URL;

const getFormDateFields = (startMoment, endMoment) => {
  return {
    ddlFromMonth: startMoment.month() + 1,
    ddlFromDate: startMoment.date(),
    ddlFromYear: startMoment.year(),
    ddlToMonth: endMoment.month() + 1,
    ddlToDate: endMoment.date(),
    ddlToYear: endMoment.year()
  };
};

const parseDate = (value, defaultDate) => {
  if (!value) return defaultDate;

  return _momentTimezone2.default.tz(value, 'MMM DD YYYY hh:mmA', 'America/Los_Angeles').toISOString();
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
    _log2.default.info('Scraper: initialized');
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


let deleteAll = (() => {
  var _ref = _asyncToGenerator(function* () {
    yield (0, _database2.default)().deleteAllIncidents();
    yield (0, _database2.default)().setConfigParam('lastImportedDate', _momentTimezone2.default.tz('12/31/1998', 'MM/DD/YYYY', 'America/Los_Angeles').toISOString());
  });

  return function deleteAll() {
    return _ref.apply(this, arguments);
  };
})();

let run = (() => {
  var _ref2 = _asyncToGenerator(function* () {
    _log2.default.info('Police Daily Activity Importer starting...');

    while (true) {
      const lastImportDateStr = yield (0, _database2.default)().getConfigParam('lastImportedDate');
      const dateToImport = _momentTimezone2.default.tz(lastImportDateStr, 'America/Los_Angeles').add(1, 'days');

      if (!dateToImport.isBefore((0, _momentTimezone2.default)(), 'date')) {
        _log2.default.info('Up to date. Exiting...');
        break;
      }

      _log2.default.info(`Importing ${dateToImport.toString()}`);

      const scrapedIncidents = yield (0, _scraper2.default)().scrape(dateToImport);
      for (const scrapedIncident of scrapedIncidents) {
        if (yield (0, _database2.default)().isIncidentUnsaved(scrapedIncident)) {
          const incidentWithLocation = yield (0, _maps2.default)().addLocationInfoToIncident(scrapedIncident);
          if (incidentWithLocation !== undefined) {
            (0, _database2.default)().createIncident(incidentWithLocation);
          }
        }
      }
      yield (0, _database2.default)().setConfigParam('lastImportedDate', dateToImport.toISOString());
      _log2.default.info(`${dateToImport.toString()} successfully imported.`);
    }
  });

  return function run() {
    return _ref2.apply(this, arguments);
  };
})();

var _bluebird = __webpack_require__(6);

var _bluebird2 = _interopRequireDefault(_bluebird);

var _momentTimezone = __webpack_require__(2);

var _momentTimezone2 = _interopRequireDefault(_momentTimezone);

var _database = __webpack_require__(3);

var _database2 = _interopRequireDefault(_database);

var _log = __webpack_require__(0);

var _log2 = _interopRequireDefault(_log);

var _maps = __webpack_require__(4);

var _maps2 = _interopRequireDefault(_maps);

var _scraper = __webpack_require__(5);

var _scraper2 = _interopRequireDefault(_scraper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /* global Promise:true */


Promise = _bluebird2.default;

run()
// deleteAll()
.catch(err => _log2.default.error(err));

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

module.exports = require("es6-error");

/***/ }),
/* 11 */
/***/ (function(module, exports) {

module.exports = require("graphql-tag");

/***/ }),
/* 12 */
/***/ (function(module, exports) {

module.exports = require("isomorphic-fetch");

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("request-x-ray");

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("simple-rate-limiter");

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = require("winston");

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = require("x-ray");

/***/ })
/******/ ]);
//# sourceMappingURL=index.js.map