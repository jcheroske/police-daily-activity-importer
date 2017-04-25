/* global Promise:true */
import BluebirdPromise from 'bluebird'
import 'isomorphic-fetch'
import {assign, padStart} from 'lodash'
import moment from 'moment-timezone'
import getDatabase, {init as initDb} from './database'
import log from './log'
import getMaps, {init as initMaps, QueryLimitExceeded} from './maps'
import getScraper, {init as initScraper} from './scraper'

Promise = BluebirdPromise

const DATE_FORMAT = 'MM/DD/YYYY'

export async function importIncidents () {
  await initDb()
  await initScraper()
  log.info('Police Daily Activity Incident Importer run started...')
  log.info('-----------------------------------------------')
  log.info('| Date       | Scraped | Imported | Duplicate |')
  log.info('-----------------------------------------------')

  const totalStats = {
    startDay: undefined,
    endDay: undefined,
    scraped: 0,
    imported: 0,
    alreadyExists: 0
  }

  try {
    while (true) {
      const lastImportDateStr = await getDatabase().config.getParam('lastImportedDate')
      const dateToImport = moment.tz(lastImportDateStr, 'America/Los_Angeles').add(1, 'days')

      if (!dateToImport.isBefore(moment(), 'date')) {
        break
      }

      if (typeof totalStats.startDay === 'undefined') {
        totalStats.startDay = dateToImport
      }
      totalStats.endDay = dateToImport

      const dayStats = {
        scraped: 0,
        imported: 0,
        alreadyExists: 0
      }

      try {
        const scrapedIncidents = await getScraper().scrape(dateToImport)
        dayStats.scraped = scrapedIncidents.length
        for (const scrapedIncident of scrapedIncidents) {
          const existingIncident = await getDatabase().incident.findByCaseNumber(scrapedIncident.caseNumber)
          if (existingIncident == null) {
            await getDatabase().incident.create(scrapedIncident)
            dayStats.imported++
          } else {
            dayStats.alreadyExists++
          }
        }
        await getDatabase().config.setParam('lastImportedDate', dateToImport.toISOString())
      } finally {
        log.info(`| ${padStart(dateToImport.format(DATE_FORMAT), 10)} | ${padStart(dayStats.scraped, 7)} | ${padStart(dayStats.imported, 8)} | ${padStart(dayStats.alreadyExists, 9)} |`)
        for (const prop in dayStats) {
          totalStats[prop] += dayStats[prop]
        }
      }
    }
  } catch (err) {
    log.error(err)
  } finally {
    log.info('-----------------------------------------------')
    log.info('Police Daily Activity Incident Importer run finished...')
    log.info('------------------------------------------------------------')
    log.info('| Start Date | End Date   | Scraped | Imported | Duplicate |')
    log.info('------------------------------------------------------------')
    log.info(`| ${padStart(totalStats.startDay.format(DATE_FORMAT), 10)} | ${padStart(totalStats.endDay.format(DATE_FORMAT), 10)} | ${padStart(totalStats.scraped, 7)} | ${padStart(totalStats.imported, 8)} | ${padStart(totalStats.alreadyExists, 9)} |`)
    log.info('------------------------------------------------------------')
    process.exit(0)
  }
}

export async function geocodeIncidents () {
  await initDb()
  await initMaps()
  printGeocodeDayHeader()

  try {
    const incidents = await getDatabase().incident.findUngeocoded()

    let prevReportedDay
    for (const incident of incidents) {
      const currReportedDay = isoDateTimeToIsoDay(incident.reportedAt)
      if (currReportedDay !== prevReportedDay) {
        printGeocodeDayStats(prevReportedDay)
        prevReportedDay = currReportedDay
      }

      const geocodeData = await getMaps().geocodeIncident(incident)
      geocodeData.geocodeFailed ? incrementNoLocationCount(currReportedDay) : incrementGeocodedCount(currReportedDay)
      await getDatabase().incident.saveGeocodedData({
        ...incident,
        ...geocodeData
      })
    }
  } catch (err) {
    if (err instanceof QueryLimitExceeded) {
      log.warn('Google Maps geocode quota exhausted')
    } else {
      log.error(err)
    }
  } finally {
    printGeocodeTotalHeader()
    printGeocodeTotals()
    process.exit(0)
  }
}

function printGeocodeDayHeader () {
  log.info('---------------------------------------')
  log.info('| Date       | Geocoded | No Location |')
  log.info('---------------------------------------')
}

const geocodeDayStats = new Map()

function incrementGeocodedCount (isoDay) {
  getStatsForDay(isoDay).geocoded++
}

function incrementNoLocationCount (isoDay) {
  getStatsForDay(isoDay).noLocation++
}

function getStatsForDay (isoDay) {
  let dayStats = geocodeDayStats.get(isoDay)
  if (dayStats == null) {
    dayStats = {
      geocoded: 0,
      noLocation: 0
    }
    geocodeDayStats.set(isoDay, dayStats)
  }
  return dayStats
}

function printGeocodeDayStats (isoDay) {
  if (isoDay != null) {
    const dayStats = geocodeDayStats.get(isoDay)
    log.info(`| ${padStart(formatIsoDay(isoDay), 10)} | ${padStart(dayStats.geocoded, 8)} | ${padStart(dayStats.noLocation, 11)} |`)
  }
}

function isoDateTimeToIsoDay (isoDateTime) {
  return moment(isoDateTime).startOf('day').toISOString()
}

function formatIsoDay (isoDay) {
  return moment(isoDay).format(DATE_FORMAT)
}

function printGeocodeTotalHeader () {
  log.info('----------------------------------------------------')
  log.info('| Start Date | End Date   | Geocoded | No Location |')
  log.info('----------------------------------------------------')
}

function printGeocodeTotals () {
  let startDay
  let endDay
  let totalGeocoded = 0
  let totalNoLocation = 0
  geocodeDayStats.forEach((dayStats, day) => {
    if (startDay == null) {
      startDay = day
    }
    endDay = day
    totalGeocoded += dayStats.geocoded
    totalNoLocation += dayStats.noLocation
  })
  log.info(`| ${padStart(formatIsoDay(startDay), 10)} | ${padStart(formatIsoDay(endDay), 10)} | ${padStart(totalGeocoded, 8)} | ${padStart(totalNoLocation, 11)} |`)
  log.info('----------------------------------------------------')
}