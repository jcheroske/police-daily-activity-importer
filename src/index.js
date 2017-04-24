/* global Promise:true */
import BluebirdPromise from 'bluebird'
import 'isomorphic-fetch'
import {padStart} from 'lodash'
import moment from 'moment-timezone'
import getDatabase, {init as initDb} from './database'
import log from './log'
import getMaps, {init as initMaps, QueryLimitExceeded} from './maps'
import getScraper, {init as initScraper} from './scraper'

Promise = BluebirdPromise

const DATE_FORMAT = 'MM/DD/YYYY'

export async function deleteAllIncidents () {
  try {
    log.info('Deleting all incidents from database')
    await init()
    await getDatabase().deleteAllIncidents()
    await getDatabase().setConfigParam('lastImportedDate', moment.tz('12/31/1998', 'MM/DD/YYYY', 'America/Los_Angeles').toISOString())
  } catch (err) {
    log.error(err)
  }
}

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
  log.info('Police Daily Activity Incident Geocoder run started...')
  log.info('-------------------------------------')
  log.info('| Date       | Geocoded | No Location')
  log.info('-------------------------------------')

  const dayMap = new Map()
  try {
    const incidents = await getDatabase().incident.findUngeocoded()
    let prevReportedAt
    for (const incident of incidents) {
      let currDayStats = dayMap.get(incident.reportedAt)
      if (currDayStats == null) {
        currDayStats = {
          geocoded: 0,
          noLocation: 0
        }
        dayMap.set(incident.reportedAt, currDayStats)

        if (prevReportedAt != null) {
          const prevDayStats = dayMap.get(prevReportedAt)
          log.info(`| ${padStart(moment(prevReportedAt).format(DATE_FORMAT), 10)} | ${padStart(prevDayStats.geocoded, 8)} | ${padStart(prevDayStats.noLocation, 11)} |`)
        }
        prevReportedAt = incident.reportedAt
      }

      const geocodeData = await getMaps().geocodeIncident(incident)
      if (geocodeData != null) {
        currDayStats.geocoded++
        await getDatabase().incident.update({
          ...incident,
          ...geocodeData
        })
      } else {
        currDayStats.noLocation++
      }
    }
  } catch (err) {
    if (err instanceof QueryLimitExceeded) {
      log.warn('Google Maps geocode quota exhausted')
    } else {
      log.error(err)
    }
  } finally {
    log.info('-------------------------------------')
    log.info('Police Daily Activity Incident Geocoder run finished...')
    log.info('----------------------------------------------------')
    log.info('| Start Date | End Date   | Geocoded | No Location |')
    log.info('----------------------------------------------------')

    let startDay
    let endDay
    let totalGeocoded = 0
    let totalNoLocation = 0
    dayMap.forEach((value, key) => {
      if (startDay == null) {
        startDay = key
      }
      endDay = key
      totalGeocoded += value.geocoded
      totalNoLocation += value.noLocation
    })
    log.info(`| ${padStart(moment(startDay).format(DATE_FORMAT), 10)} | ${padStart(moment(endDay).format(DATE_FORMAT), 10)} | ${padStart(totalGeocoded, 8)} | ${padStart(totalNoLocation, 11)} |`)
    log.info('----------------------------------------------------')
    process.exit(0)
  }
}
