(function(e, a) { for(var i in a) e[i] = a[i]; }(exports, /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
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
exports.init = undefined;

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

    if (!result || !result.data || !result.data.allConfigs || !result.data.allConfigs[0] || !result.data.allConfigs[0].id) {
      _log2.default.error('Database: getConfigId(): malformed GraphQL result', result);
      throw new Error('Database: getConfigId(): malformed GraphQL result');
    }
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
        Config(id: "${configId}") {
          ${name}
        }  
      }
    `
    });

    if (!result || !result.data || !result.data.Config || !result.data.Config[name]) {
      _log2.default.error('Database: getConfigParam(): malformed GraphQL result', name, result);
      throw new Error('Database: getConfigParam(): malformed GraphQL result');
    }

    return result.data.Config[name];
  });

  return function getConfigParam(_x) {
    return _ref2.apply(this, arguments);
  };
})();

let setConfigParam = (() => {
  var _ref3 = _asyncToGenerator(function* (name, value) {
    const result = yield client.mutate({
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

    if (!result || !result.data || !result.data.updateConfig) {
      _log2.default.error('Database: setConfigParam(): malformed GraphQL result', name, value, result);
      throw new Error('Database: setConfigParam(): malformed GraphQL result');
    }

    return undefined;
  });

  return function setConfigParam(_x2, _x3) {
    return _ref3.apply(this, arguments);
  };
})();

let createIncident = (() => {
  var _ref4 = _asyncToGenerator(function* (incident) {
    _log2.default.debug('Creating new Incident', incident);
    const result = yield client.mutate({
      mutation: _graphqlTag2.default`
      mutation {
        createIncident(
          caseNumber: "${incident.caseNumber}"
          description: "${incident.description}"
          offense: "${incident.offense}"
          reportedAt: "${incident.reportedAt}"
          streetAddress: "${incident.streetAddress}"
          zipCode: "${incident.zipCode}"
          lat: ${incident.lat}
          lng: ${incident.lng}
        ) {
          id
        }
      }
    `
    });

    if (!result || !result.data || !result.data.createIncident) {
      _log2.default.error('Database: createIncident(): malformed GraphQL result', incident, result);
      throw new Error('Database: createIncident(): malformed GraphQL result');
    }

    return result.data.createIncident;
  });

  return function createIncident(_x4) {
    return _ref4.apply(this, arguments);
  };
})();

let isIncidentUnsaved = (() => {
  var _ref5 = _asyncToGenerator(function* (incident) {
    const result = yield client.query({
      fetchPolicy: 'network-only',
      query: _graphqlTag2.default`
      query {
        Incident(caseNumber: "${incident.caseNumber}") {
          id
        }  
      }
    `
    });

    if (!result || !result.data) {
      _log2.default.error('Database: isIncidentUnsaved(): malformed GraphQL result', incident, result);
      throw new Error('Database: isIncidentUnsaved(): malformed GraphQL result');
    }

    const returnValue = result.data.Incident == null;
    _log2.default.debug(`Database: case number ${incident.caseNumber} ${returnValue ? 'does not exist' : 'already exists'} in the database`);
    return returnValue;
  });

  return function isIncidentUnsaved(_x5) {
    return _ref5.apply(this, arguments);
  };
})();

let deleteAllIncidents = (() => {
  var _ref6 = _asyncToGenerator(function* () {
    const allIncidentsResult = yield client.query({
      fetchPolicy: 'network-only',
      query: _graphqlTag2.default`
      query {
        allIncidents {
          id
        }
      }
    `
    });

    if (!allIncidentsResult || !allIncidentsResult.data || !allIncidentsResult.data.allIncidents) {
      _log2.default.error('Database: deleteAllIncidents(): malformed GraphQL result', allIncidentsResult);
      throw new Error('Database: deleteAllIncidents(): malformed GraphQL result');
    }

    for (const incident of allIncidentsResult.data.allIncidents) {
      const deleteIncidentResult = yield client.mutate({
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

      if (!deleteIncidentResult || !deleteIncidentResult.data || !deleteIncidentResult.data.deleteIncident) {
        _log2.default.error('Database: deleteAllIncidents(): malformed GraphQL result', deleteIncidentResult);
        throw new Error('Database: deleteAllIncidents(): malformed GraphQL result');
      }

      _log2.default.debug(`Database: incident ${incident.id} deleted`);
    }
  });

  return function deleteAllIncidents() {
    return _ref6.apply(this, arguments);
  };
})();

let init = exports.init = (() => {
  var _ref7 = _asyncToGenerator(function* () {
    const env = _envalid2.default.cleanEnv(process.env, {
      GRAPHCOOL_AUTHENTICATION_TOKEN: (0, _envalid.str)({ desc: 'Graphcool Authentication Token' }),
      GRAPH_QL_ENDPOINT: (0, _envalid.str)({ desc: 'GraphQL endpoint URL' })
    });

    const networkInterface = (0, _apolloClient.createNetworkInterface)({
      uri: env.GRAPH_QL_ENDPOINT
    });

    networkInterface.use([{
      applyMiddleware(req, next) {
        if (!req.options.headers) {
          req.options.headers = {};
        }

        req.options.headers.authorization = `Bearer ${env.GRAPHCOOL_AUTHENTICATION_TOKEN}`;
        next();
      }
    }]);

    client = new _apolloClient2.default({ networkInterface });

    yield getConfigId();

    database = Object.freeze({
      getConfigParam,
      setConfigParam,
      createIncident,
      isIncidentUnsaved,
      deleteAllIncidents
    });
    _log2.default.verbose('Database: initialized');
  });

  return function init() {
    return _ref7.apply(this, arguments);
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

exports.default = () => database;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = exports.QueryLimitExceeded = undefined;

let addLocationInfoToIncident = (() => {
  var _ref = _asyncToGenerator(function* (incident) {
    const rawAddress = [incident.streetAddress, 'Bellingham', 'WA'].join(', ');
    _log2.default.debug(`Maps: about to geocode ${rawAddress}`);

    let response;
    try {
      response = yield googleGeocode({ address: rawAddress });
    } catch (err) {
      if (err.message === 'timeout') {
        throw new QueryLimitExceeded();
      }
      _log2.default.error('Maps: error when invoking Google maps API', err);
      throw err;
    }

    if (!response || !response.json) {
      _log2.default.warn('Maps: empty response or json payload', response);
      return undefined;
    }

    const { status, results } = response.json;

    if (response.json.status === 'OVER_QUERY_LIMIT') {
      _log2.default.warn('Maps: Query limit exceeded');
      throw new QueryLimitExceeded();
    }

    if (status !== 'OK') {
      _log2.default.warn('Maps: Non-OK status received', rawAddress, status);
      return undefined;
    }

    if (!results || !results[0]) {
      _log2.default.warn('Maps: missing results payload', rawAddress, results);
      return undefined;
    }

    const { formatted_address: formattedAddress, geometry } = results[0];

    if (!formattedAddress) {
      _log2.default.warn('Maps: missing formatted address', rawAddress, results[0]);
      return undefined;
    }

    if (!geometry || !geometry.location || !geometry.location.lat || !geometry.location.lng) {
      _log2.default.warn('Maps: missing or incomplete geometry object', rawAddress, results[0]);
      return undefined;
    }

    const streetAddressRegExResult = formattedAddress.split(',');
    if (!streetAddressRegExResult || !streetAddressRegExResult[0]) {
      _log2.default.warn('Maps: street address extraction failed', formattedAddress);
      return undefined;
    }

    const streetAddress = streetAddressRegExResult[0].trim();

    const zipCodeRegExResult = formattedAddress.match(/\d{5}/);
    if (!zipCodeRegExResult || !zipCodeRegExResult[0]) {
      _log2.default.warn('Maps: zip code extraction failed', formattedAddress);
      return undefined;
    }

    const zipCode = zipCodeRegExResult[0];

    const { lat, lng } = geometry.location;

    _log2.default.debug('Maps: geocode successful', streetAddress, zipCode, lat, lng);
  });

  return function addLocationInfoToIncident(_x) {
    return _ref.apply(this, arguments);
  };
})();

let init = exports.init = (() => {
  var _ref2 = _asyncToGenerator(function* () {
    const env = _envalid2.default.cleanEnv(process.env, {
      GOOGLE_MAPS_API_KEY: (0, _envalid.str)({ desc: 'Google maps node API key' })
    });

    const client = _maps2.default.createClient({
      key: env.GOOGLE_MAPS_API_KEY,
      'rate.limit': 40,
      timeout: 10000
    });

    googleGeocode = Promise.promisify(client.geocode.bind(client));

    maps = Object.freeze({ addLocationInfoToIncident });
    _log2.default.verbose('Maps: initialized');
  });

  return function init() {
    return _ref2.apply(this, arguments);
  };
})();

var _maps = __webpack_require__(8);

var _maps2 = _interopRequireDefault(_maps);

var _envalid = __webpack_require__(1);

var _envalid2 = _interopRequireDefault(_envalid);

var _es6Error = __webpack_require__(10);

var _es6Error2 = _interopRequireDefault(_es6Error);

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

exports.default = () => maps;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = undefined;

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

    let result;
    try {
      result = yield Promise.fromCallback(function (cb) {
        return xRay(POLICE_INCIDENT_URL, selector)(cb);
      });
    } catch (err) {
      _log2.default.error('Scraper: error while fetching incidents', err);
      throw err;
    }

    if (!result || !result.incidents) {
      _log2.default.error('Scraper: malformed scraper result', result);
      throw new Error('Scraper: malformed scraper result');
    }

    const { incidents } = result;
    _log2.default.verbose(`Scraper: ${incidents.length} incidents scraped`);
    _log2.default.debug('Scraped incidents', incidents);
    return incidents;
  });

  return function scrape(_x) {
    return _ref.apply(this, arguments);
  };
})();

let getFormSecurityFields = (() => {
  var _ref2 = _asyncToGenerator(function* () {
    if (securityFields) return securityFields;

    const selector = {
      '__VIEWSTATE': 'input[name="__VIEWSTATE"]@value',
      '__VIEWSTATEGENERATOR': 'input[name="__VIEWSTATEGENERATOR"]@value',
      '__EVENTVALIDATION': 'input[name="__EVENTVALIDATION"]@value'
    };

    const xRay = (0, _xRay2.default)();
    try {
      securityFields = yield Promise.fromCallback(function (cb) {
        return xRay(POLICE_INCIDENT_URL, selector)(cb);
      });
    } catch (err) {
      _log2.default.error('Scraper: error while fetching security fields', err);
      throw err;
    }

    if (!securityFields || (0, _lodash.isEmpty)(securityFields)) {
      _log2.default.error('Scraper: malformed security fields', securityFields);
      throw new Error('Scraper: malformed security fields');
    }
    _log2.default.verbose('Scraper: obtained security fields');
    return securityFields;
  });

  return function getFormSecurityFields() {
    return _ref2.apply(this, arguments);
  };
})();

let init = exports.init = (() => {
  var _ref3 = _asyncToGenerator(function* () {
    const env = _envalid2.default.cleanEnv(process.env, {
      POLICE_INCIDENT_URL: (0, _envalid.str)({ desc: 'Police daily activity URL' })
    });

    POLICE_INCIDENT_URL = env.POLICE_INCIDENT_URL;
    scraper = Object.freeze({
      scrape
    });
    _log2.default.verbose('Scraper: initialized');
  });

  return function init() {
    return _ref3.apply(this, arguments);
  };
})();

var _envalid = __webpack_require__(1);

var _envalid2 = _interopRequireDefault(_envalid);

var _lodash = __webpack_require__(13);

var _momentTimezone = __webpack_require__(2);

var _momentTimezone2 = _interopRequireDefault(_momentTimezone);

var _requestXRay = __webpack_require__(14);

var _requestXRay2 = _interopRequireDefault(_requestXRay);

var _xRay = __webpack_require__(16);

var _xRay2 = _interopRequireDefault(_xRay);

var _log = __webpack_require__(0);

var _log2 = _interopRequireDefault(_log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

let POLICE_INCIDENT_URL;

let securityFields;


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

exports.default = () => scraper;

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("bluebird");

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.importIncidents = exports.deleteAllIncidents = undefined;

let init = (() => {
  var _ref = _asyncToGenerator(function* () {
    yield (0, _database.init)();
    yield (0, _scraper.init)();
    yield (0, _maps.init)();
  });

  return function init() {
    return _ref.apply(this, arguments);
  };
})();

let deleteAllIncidents = exports.deleteAllIncidents = (() => {
  var _ref2 = _asyncToGenerator(function* () {
    try {
      _log2.default.info('Deleting all incidents from database');
      yield init();
      yield (0, _database2.default)().deleteAllIncidents();
      yield (0, _database2.default)().setConfigParam('lastImportedDate', _momentTimezone2.default.tz('12/31/1998', 'MM/DD/YYYY', 'America/Los_Angeles').toISOString());
    } catch (err) {
      _log2.default.error(err);
    }
  });

  return function deleteAllIncidents() {
    return _ref2.apply(this, arguments);
  };
})();

let importIncidents = exports.importIncidents = (() => {
  var _ref3 = _asyncToGenerator(function* () {
    let numNewIncidents = 0;
    try {
      _log2.default.info('Police Daily Activity Importer starting...');

      yield init();

      while (true) {
        const lastImportDateStr = yield (0, _database2.default)().getConfigParam('lastImportedDate');
        const dateToImport = _momentTimezone2.default.tz(lastImportDateStr, 'America/Los_Angeles').add(1, 'days');

        if (!dateToImport.isBefore((0, _momentTimezone2.default)(), 'date')) {
          break;
        }

        _log2.default.info(`Beginning import for ${dateToImport.toString()}`);

        let numNewIncidentsOnDay = 0;
        const scrapedIncidents = yield (0, _scraper2.default)().scrape(dateToImport);
        for (const scrapedIncident of scrapedIncidents) {
          if (yield (0, _database2.default)().isIncidentUnsaved(scrapedIncident)) {
            const incidentWithLocation = yield (0, _maps2.default)().addLocationInfoToIncident(scrapedIncident);
            if (incidentWithLocation !== undefined) {
              yield (0, _database2.default)().createIncident(incidentWithLocation);
              numNewIncidentsOnDay++;
              numNewIncidents++;
            }
          }
        }
        yield (0, _database2.default)().setConfigParam('lastImportedDate', dateToImport.toISOString());
        _log2.default.info(`Successfully imported ${numNewIncidentsOnDay} new incidents for ${dateToImport.toString()}.`);
      }
    } catch (err) {
      if (err instanceof _maps.QueryLimitExceeded) {
        _log2.default.warn('Google geocode quota exhausted.');
      } else {
        _log2.default.error(err);
      }
    }
    _log2.default.info(`Importing complete. ${numNewIncidents} incidents added. Exiting...`);
  });

  return function importIncidents() {
    return _ref3.apply(this, arguments);
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

module.exports = require("lodash");

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("request-x-ray");

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = require("winston");

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = require("x-ray");

/***/ })
/******/ ])));
//# sourceMappingURL=index.js.map