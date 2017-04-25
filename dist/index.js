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
/******/ 	return __webpack_require__(__webpack_require__.s = 10);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _envalid = __webpack_require__(1);

var _envalid2 = _interopRequireDefault(_envalid);

var _winston = __webpack_require__(17);

var _winston2 = _interopRequireDefault(_winston);

var _winstonPapertrail = __webpack_require__(18);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const LOG_LEVELS = ['debug', 'verbose', 'info', 'warn', 'error'];

const env = _envalid2.default.cleanEnv(process.env, {
  PAPERTRAIL_LOG_LEVEL: (0, _envalid.str)({ desc: `Papertrail log level (${LOG_LEVELS})`, choices: LOG_LEVELS, devDefault: 'debug' }),
  PAPERTRAIL_HOST: (0, _envalid.str)({ desc: 'Papertrail hostname' }),
  PAPERTRAIL_PORT: (0, _envalid.num)({ desc: 'Papertrail port number' }),
  PAPERTRAIL_CLIENT_NAME: (0, _envalid.str)({ desc: 'Papertrail client name' }),

  CONSOLE_LOG_LEVEL: (0, _envalid.str)({ desc: `Console log level (${LOG_LEVELS})`, choices: LOG_LEVELS, devDefault: 'debug' })
});

const consoleTransport = new _winston2.default.transports.Console({
  level: env.CONSOLE_LOG_LEVEL,
  colorize: true,
  stderrLevels: ['error']
});

const papertrailTransport = new _winstonPapertrail.Papertrail({
  level: env.PAPERTRAIL_LOG_LEVEL,
  host: env.PAPERTRAIL_HOST,
  port: env.PAPERTRAIL_PORT,
  hostname: env.PAPERTRAIL_CLIENT_NAME,
  colorize: true,
  logFormat(level, message) {
    return '[' + level + '] ' + message;
  }
});

exports.default = new _winston2.default.Logger({
  levels: { error: 0, warn: 1, info: 2, verbose: 3, debug: 4 },
  transports: [papertrailTransport, consoleTransport]
});

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("envalid");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("lodash");

/***/ }),
/* 3 */
/***/ (function(module, exports) {

module.exports = require("moment-timezone");

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = require("graphql-tag");

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = undefined;

let init = exports.init = (() => {
  var _ref = _asyncToGenerator(function* () {
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

    const client = new _apolloClient2.default({ networkInterface });

    database = Object.freeze({
      config: yield (0, _config2.default)(client),
      incident: yield (0, _incident2.default)(client)
    });

    _log2.default.verbose('Database: initialized');
  });

  return function init() {
    return _ref.apply(this, arguments);
  };
})();

var _apolloClient = __webpack_require__(14);

var _apolloClient2 = _interopRequireDefault(_apolloClient);

var _envalid = __webpack_require__(1);

var _envalid2 = _interopRequireDefault(_envalid);

var _log = __webpack_require__(0);

var _log2 = _interopRequireDefault(_log);

var _config = __webpack_require__(11);

var _config2 = _interopRequireDefault(_config);

var _incident = __webpack_require__(12);

var _incident2 = _interopRequireDefault(_incident);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

let database;

exports.default = () => database;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = exports.QueryLimitExceeded = undefined;

let geocodeIncident = (() => {
  var _ref = _asyncToGenerator(function* (incident) {
    const rawAddress = [incident.streetAddress.replace('BLK', '').replace(/\s+/g, ' '), 'Bellingham', 'WA'].join(', ');
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

    const failedReturnValue = {
      geocodeFailed: true
    };

    if (!response || !response.json) {
      _log2.default.warn('Maps: empty response or json payload', response);
      return failedReturnValue;
    }

    const { status, results } = response.json;

    if (response.json.status === 'OVER_QUERY_LIMIT') {
      _log2.default.warn('Maps: Query limit exceeded');
      throw new QueryLimitExceeded();
    }

    if (status !== 'OK') {
      _log2.default.warn('Maps: Non-OK status received', rawAddress, status);
      return failedReturnValue;
    }

    if (!results || !results[0]) {
      _log2.default.warn('Maps: missing results payload', rawAddress, results);
      return failedReturnValue;
    }

    const { formatted_address: formattedAddress, geometry } = results[0];

    if (!formattedAddress) {
      _log2.default.warn('Maps: missing formatted address', rawAddress, results[0]);
      return failedReturnValue;
    }

    if (!geometry || !geometry.location || !geometry.location.lat || !geometry.location.lng) {
      _log2.default.warn('Maps: missing or incomplete geometry object', rawAddress, results[0]);
      return failedReturnValue;
    }

    const streetAddressRegExResult = formattedAddress.split(',');
    if (!streetAddressRegExResult || !streetAddressRegExResult[0]) {
      _log2.default.warn('Maps: street address extraction failed', formattedAddress);
      return failedReturnValue;
    }

    const prettyStreetAddress = streetAddressRegExResult[0].trim();

    const zipCodeRegExResult = formattedAddress.match(/\d{5}/);
    if (!zipCodeRegExResult || !zipCodeRegExResult[0]) {
      _log2.default.warn('Maps: zip code extraction failed', formattedAddress);
      return failedReturnValue;
    }

    const zipCode = zipCodeRegExResult[0];

    const { lat, lng } = geometry.location;

    _log2.default.debug('Maps: geocode successful', prettyStreetAddress, zipCode, lat, lng);

    return {
      geocodeFailed: false,
      prettyStreetAddress,
      zipCode,
      lat,
      lng
    };
  });

  return function geocodeIncident(_x) {
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

    maps = Object.freeze({ geocodeIncident });
    _log2.default.verbose('Maps: initialized');
  });

  return function init() {
    return _ref2.apply(this, arguments);
  };
})();

var _maps = __webpack_require__(13);

var _maps2 = _interopRequireDefault(_maps);

var _envalid = __webpack_require__(1);

var _envalid2 = _interopRequireDefault(_envalid);

var _es6Error = __webpack_require__(15);

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
/* 7 */
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
        parseDescription,
        trim
      }
    });
    xRay.driver((0, _requestXRay2.default)(options));

    const selector = {
      incidents: xRay('td.info', [{
        reportedAt: `b:nth-of-type(1) | parseDate:${date.toISOString()}`,
        streetAddress: 'b:nth-of-type(2) | trim',
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
    incidents.forEach(function (i) {
      i.city = 'Bellingham';
      i.state = 'WA';
    });
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

var _lodash = __webpack_require__(2);

var _momentTimezone = __webpack_require__(3);

var _momentTimezone2 = _interopRequireDefault(_momentTimezone);

var _requestXRay = __webpack_require__(16);

var _requestXRay2 = _interopRequireDefault(_requestXRay);

var _xRay = __webpack_require__(19);

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
/* 8 */
/***/ (function(module, exports) {

module.exports = require("bluebird");

/***/ }),
/* 9 */
/***/ (function(module, exports) {

module.exports = require("isomorphic-fetch");

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.geocodeIncidents = exports.importIncidents = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

let importIncidents = exports.importIncidents = (() => {
  var _ref = _asyncToGenerator(function* () {
    yield (0, _database.init)();
    yield (0, _scraper.init)();
    _log2.default.info('Police Daily Activity Incident Importer run started...');
    _log2.default.info('-----------------------------------------------');
    _log2.default.info('| Date       | Scraped | Imported | Duplicate |');
    _log2.default.info('-----------------------------------------------');

    const totalStats = {
      startDay: undefined,
      endDay: undefined,
      scraped: 0,
      imported: 0,
      alreadyExists: 0
    };

    try {
      while (true) {
        const lastImportDateStr = yield (0, _database2.default)().config.getParam('lastImportedDate');
        const dateToImport = _momentTimezone2.default.tz(lastImportDateStr, 'America/Los_Angeles').add(1, 'days');

        if (!dateToImport.isBefore((0, _momentTimezone2.default)(), 'date')) {
          break;
        }

        if (typeof totalStats.startDay === 'undefined') {
          totalStats.startDay = dateToImport;
        }
        totalStats.endDay = dateToImport;

        const dayStats = {
          scraped: 0,
          imported: 0,
          alreadyExists: 0
        };

        try {
          const scrapedIncidents = yield (0, _scraper2.default)().scrape(dateToImport);
          dayStats.scraped = scrapedIncidents.length;
          for (const scrapedIncident of scrapedIncidents) {
            const existingIncident = yield (0, _database2.default)().incident.findByCaseNumber(scrapedIncident.caseNumber);
            if (existingIncident == null) {
              yield (0, _database2.default)().incident.create(scrapedIncident);
              dayStats.imported++;
            } else {
              dayStats.alreadyExists++;
            }
          }
          yield (0, _database2.default)().config.setParam('lastImportedDate', dateToImport.toISOString());
        } finally {
          _log2.default.info(`| ${(0, _lodash.padStart)(dateToImport.format(DATE_FORMAT), 10)} | ${(0, _lodash.padStart)(dayStats.scraped, 7)} | ${(0, _lodash.padStart)(dayStats.imported, 8)} | ${(0, _lodash.padStart)(dayStats.alreadyExists, 9)} |`);
          for (const prop in dayStats) {
            totalStats[prop] += dayStats[prop];
          }
        }
      }
    } catch (err) {
      _log2.default.error(err);
    } finally {
      _log2.default.info('-----------------------------------------------');
      _log2.default.info('Police Daily Activity Incident Importer run finished...');
      _log2.default.info('------------------------------------------------------------');
      _log2.default.info('| Start Date | End Date   | Scraped | Imported | Duplicate |');
      _log2.default.info('------------------------------------------------------------');
      _log2.default.info(`| ${(0, _lodash.padStart)(totalStats.startDay.format(DATE_FORMAT), 10)} | ${(0, _lodash.padStart)(totalStats.endDay.format(DATE_FORMAT), 10)} | ${(0, _lodash.padStart)(totalStats.scraped, 7)} | ${(0, _lodash.padStart)(totalStats.imported, 8)} | ${(0, _lodash.padStart)(totalStats.alreadyExists, 9)} |`);
      _log2.default.info('------------------------------------------------------------');
      process.exit(0);
    }
  });

  return function importIncidents() {
    return _ref.apply(this, arguments);
  };
})();

let geocodeIncidents = exports.geocodeIncidents = (() => {
  var _ref2 = _asyncToGenerator(function* () {
    yield (0, _database.init)();
    yield (0, _maps.init)();
    printGeocodeDayHeader();

    try {
      const incidents = yield (0, _database2.default)().incident.findUngeocoded();

      let prevReportedDay;
      for (const incident of incidents) {
        const currReportedDay = isoDateTimeToIsoDay(incident.reportedAt);
        if (currReportedDay !== prevReportedDay) {
          printGeocodeDayStats(prevReportedDay);
          prevReportedDay = currReportedDay;
        }

        const geocodeData = yield (0, _maps2.default)().geocodeIncident(incident);
        geocodeData.geocodeFailed ? incrementNoLocationCount(currReportedDay) : incrementGeocodedCount(currReportedDay);
        yield (0, _database2.default)().incident.saveGeocodedData(_extends({}, incident, geocodeData));
      }
    } catch (err) {
      if (err instanceof _maps.QueryLimitExceeded) {
        _log2.default.warn('Google Maps geocode quota exhausted');
      } else {
        _log2.default.error(err);
      }
    } finally {
      printGeocodeTotalHeader();
      printGeocodeTotals();
      process.exit(0);
    }
  });

  return function geocodeIncidents() {
    return _ref2.apply(this, arguments);
  };
})();

var _bluebird = __webpack_require__(8);

var _bluebird2 = _interopRequireDefault(_bluebird);

__webpack_require__(9);

var _lodash = __webpack_require__(2);

var _momentTimezone = __webpack_require__(3);

var _momentTimezone2 = _interopRequireDefault(_momentTimezone);

var _database = __webpack_require__(5);

var _database2 = _interopRequireDefault(_database);

var _log = __webpack_require__(0);

var _log2 = _interopRequireDefault(_log);

var _maps = __webpack_require__(6);

var _maps2 = _interopRequireDefault(_maps);

var _scraper = __webpack_require__(7);

var _scraper2 = _interopRequireDefault(_scraper);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } /* global Promise:true */


Promise = _bluebird2.default;

const DATE_FORMAT = 'MM/DD/YYYY';

function printGeocodeDayHeader() {
  _log2.default.info('---------------------------------------');
  _log2.default.info('| Date       | Geocoded | No Location |');
  _log2.default.info('---------------------------------------');
}

const geocodeDayStats = new Map();

function incrementGeocodedCount(isoDay) {
  getStatsForDay(isoDay).geocoded++;
}

function incrementNoLocationCount(isoDay) {
  getStatsForDay(isoDay).noLocation++;
}

function getStatsForDay(isoDay) {
  let dayStats = geocodeDayStats.get(isoDay);
  if (dayStats == null) {
    dayStats = {
      geocoded: 0,
      noLocation: 0
    };
    geocodeDayStats.set(isoDay, dayStats);
  }
  return dayStats;
}

function printGeocodeDayStats(isoDay) {
  if (isoDay != null) {
    const dayStats = geocodeDayStats.get(isoDay);
    _log2.default.info(`| ${(0, _lodash.padStart)(formatIsoDay(isoDay), 10)} | ${(0, _lodash.padStart)(dayStats.geocoded, 8)} | ${(0, _lodash.padStart)(dayStats.noLocation, 11)} |`);
  }
}

function isoDateTimeToIsoDay(isoDateTime) {
  return (0, _momentTimezone2.default)(isoDateTime).startOf('day').toISOString();
}

function formatIsoDay(isoDay) {
  return (0, _momentTimezone2.default)(isoDay).format(DATE_FORMAT);
}

function printGeocodeTotalHeader() {
  _log2.default.info('----------------------------------------------------');
  _log2.default.info('| Start Date | End Date   | Geocoded | No Location |');
  _log2.default.info('----------------------------------------------------');
}

function printGeocodeTotals() {
  let startDay;
  let endDay;
  let totalGeocoded = 0;
  let totalNoLocation = 0;
  geocodeDayStats.forEach((dayStats, day) => {
    if (startDay == null) {
      startDay = day;
    }
    endDay = day;
    totalGeocoded += dayStats.geocoded;
    totalNoLocation += dayStats.noLocation;
  });
  _log2.default.info(`| ${(0, _lodash.padStart)(formatIsoDay(startDay), 10)} | ${(0, _lodash.padStart)(formatIsoDay(endDay), 10)} | ${(0, _lodash.padStart)(totalGeocoded, 8)} | ${(0, _lodash.padStart)(totalNoLocation, 11)} |`);
  _log2.default.info('----------------------------------------------------');
}

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphqlTag = __webpack_require__(4);

var _graphqlTag2 = _interopRequireDefault(_graphqlTag);

var _log = __webpack_require__(0);

var _log2 = _interopRequireDefault(_log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const fetchPolicy = 'network-only';

const getParamQuery = _graphqlTag2.default`
  query GetConfigParam($id: ID!) {
    Config(id: $id) {
      lastImportedDate
    }
  }
`;

const setParamMutation = _graphqlTag2.default`
  mutation SetConfigParam(
    $id: ID!,
    $lastImportedDate: DateTime
  ) {
    updateConfig(
      id: $id
      lastImportedDate: $lastImportedDate
    ) {
      id
    }
  }
`;

exports.default = (() => {
  var _ref = _asyncToGenerator(function* (client) {
    const configId = (yield client.query({
      fetchPolicy: 'network-only',
      query: _graphqlTag2.default`
      query GetConfigId {
        allConfigs {
          id
        }
      }
    `
    })).data.allConfigs[0].id;

    return {
      getParam(name) {
        return _asyncToGenerator(function* () {
          const result = yield client.query({
            fetchPolicy,
            query: getParamQuery,
            variables: { id: configId }
          });

          if (!result || !result.data || !result.data.Config || !result.data.Config[name]) {
            _log2.default.error('Database: config.getParam(): malformed GraphQL result', name, result);
            throw new Error('Database: config.getParam(): malformed GraphQL result');
          }

          return result.data.Config[name];
        })();
      },

      setParam(name, value) {
        return _asyncToGenerator(function* () {
          const result = yield client.mutate({
            fetchPolicy,
            mutation: setParamMutation,
            variables: {
              id: configId,
              [name]: value
            }
          });

          if (!result || !result.data || !result.data.updateConfig) {
            _log2.default.error('Database: config.setParam(): malformed GraphQL result', name, value, result);
            throw new Error('Database: config.setParam(): malformed GraphQL result');
          }
        })();
      }
    };
  });

  function init(_x) {
    return _ref.apply(this, arguments);
  }

  return init;
})();

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _graphqlTag = __webpack_require__(4);

var _graphqlTag2 = _interopRequireDefault(_graphqlTag);

var _lodash = __webpack_require__(2);

var _log = __webpack_require__(0);

var _log2 = _interopRequireDefault(_log);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const fetchPolicy = 'network-only';

const findByCaseNumberQuery = _graphqlTag2.default`
  query FindIncidentByCaseNumber($caseNumber: String!) {
    Incident(caseNumber: $caseNumber) {
      id
    }
  }
`;

const findUngeocodedQuery = _graphqlTag2.default`
  query FindUngeocoded (
    $nullBoolean: Boolean = null
  ) {
    allIncidents(
      filter: {
        geocodeFailed: $nullBoolean
      },
      orderBy: reportedAt_ASC
    ) {
      id,
      streetAddress,
      city,
      reportedAt,
      state
    }
  }
`;

const createMutation = _graphqlTag2.default`
  mutation CreateIncident(
    $caseNumber: String!
    $description: String
    $offense: String!
    $reportedAt: DateTime!
    $streetAddress: String!
    $city: String!
    $state: String!
  ) {
    createIncident(
      caseNumber: $caseNumber
      description: $description
      offense: $offense
      reportedAt: $reportedAt
      streetAddress: $streetAddress
      city: $city
      state: $state
    ) {
      id
    }
  }
`;

const saveGeocodeDataMutation = _graphqlTag2.default`
  mutation SaveGeocodeData(
    $geocodeFailed: Boolean!
    $id: ID!
    $lat: Float
    $lng: Float
    $prettyStreetAddress: String
    $zipCode: String
  ) {
    updateIncident(
      geocodeFailed: $geocodeFailed
      id: $id
      lat: $lat
      lng: $lng
      prettyStreetAddress: $prettyStreetAddress
      zipCode: $zipCode
    ) {
      id
    }
  }
`;

exports.default = (() => {
  var _ref = _asyncToGenerator(function* (client) {
    return {
      findByCaseNumber(caseNumber) {
        return _asyncToGenerator(function* () {
          const result = yield client.query({
            fetchPolicy,
            query: findByCaseNumberQuery,
            variables: { caseNumber }
          });

          const dbInstance = (0, _lodash.get)(result, 'data.Incident');
          _log2.default.debug(`Incident.findByCaseNumber()`, caseNumber, dbInstance);
          return dbInstance;
        })();
      },

      findUngeocoded() {
        return _asyncToGenerator(function* () {
          const result = yield client.query({
            fetchPolicy,
            query: findUngeocodedQuery
          });

          const incidents = (0, _lodash.get)(result, 'data.allIncidents');
          if (incidents == null) {
            _log2.default.error('Database: instance.findUngeocoded(): malformed GraphQL result', result);
            throw new Error('Database: instance.findUngeocoded(): malformed GraphQL result');
          } else {
            _log2.default.debug(`Incident.findUngeocoded()`, incidents);
          }
          return incidents;
        })();
      },

      create(incident) {
        return _asyncToGenerator(function* () {
          const result = yield client.mutate({
            mutation: createMutation,
            variables: incident
          });

          const dbInstance = (0, _lodash.get)(result, 'data.createIncident');
          if (dbInstance == null) {
            _log2.default.error('Database: instance.create(): malformed GraphQL result', result);
            throw new Error('Database: instance.create(): malformed GraphQL result');
          } else {
            _log2.default.debug(`Incident.create()`, incident, dbInstance);
          }
          return dbInstance;
        })();
      },

      saveGeocodedData(incident) {
        return _asyncToGenerator(function* () {
          const result = yield client.mutate({
            mutation: saveGeocodeDataMutation,
            variables: incident
          });

          const dbInstance = (0, _lodash.get)(result, 'data.updateIncident');
          if (dbInstance == null) {
            _log2.default.error('Database: instance.update(): malformed GraphQL result', result);
            throw new Error('Database: instance.update(): malformed GraphQL result');
          } else {
            _log2.default.debug(`Incident.update()`, incident, dbInstance);
          }
          return dbInstance;
        })();
      }
    };
  });

  function init(_x) {
    return _ref.apply(this, arguments);
  }

  return init;
})();

/***/ }),
/* 13 */
/***/ (function(module, exports) {

module.exports = require("@google/maps");

/***/ }),
/* 14 */
/***/ (function(module, exports) {

module.exports = require("apollo-client");

/***/ }),
/* 15 */
/***/ (function(module, exports) {

module.exports = require("es6-error");

/***/ }),
/* 16 */
/***/ (function(module, exports) {

module.exports = require("request-x-ray");

/***/ }),
/* 17 */
/***/ (function(module, exports) {

module.exports = require("winston");

/***/ }),
/* 18 */
/***/ (function(module, exports) {

module.exports = require("winston-papertrail");

/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = require("x-ray");

/***/ })
/******/ ])));
//# sourceMappingURL=index.js.map