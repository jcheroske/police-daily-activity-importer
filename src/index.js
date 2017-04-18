/* global Promise:true */
import BluebirdPromise from 'bluebird'
import {padStart} from 'lodash'
import moment from 'moment-timezone'
import getDatabase, {init as initDb} from './database'
import log from './log'
import getMaps, {init as initMaps, QueryLimitExceeded} from './maps'
import getScraper, {init as initScraper} from './scraper'

Promise = BluebirdPromise

const DATE_FORMAT = 'MM/DD/YYYY'

async function init () {
  await initDb()
  await initScraper()
  await initMaps()
}

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
  log.info('Police Daily Activity Importer run started...')
  log.info('--------------------------------------------------------')
  log.info('| Date       | Scraped | Imported | Duplicate | No Geo |')
  log.info('--------------------------------------------------------')
  await init()

  const totalStats = {
    startDay: undefined,
    endDay: undefined,
    scraped: 0,
    imported: 0,
    alreadyExists: 0,
    noLocation: 0
  }

  try {
    while (true) {
      const lastImportDateStr = await getDatabase().getConfigParam('lastImportedDate')
      const dateToImport = moment.tz(lastImportDateStr, 'America/Los_Angeles').add(1, 'days')

      if (!dateToImport.isBefore(moment(), 'date')) {
        break
      }

      if (!totalStats.startDay) {
        totalStats.startDay = dateToImport
      }
      totalStats.endDay = dateToImport

      const dayStats = {
        scraped: 0,
        imported: 0,
        alreadyExists: 0,
        noLocation: 0
      }

      try {
        const scrapedIncidents = await getScraper().scrape(dateToImport)
        dayStats.scraped = scrapedIncidents.length
        for (const scrapedIncident of scrapedIncidents) {
          if (await getDatabase().isIncidentUnsaved(scrapedIncident)) {
            const incidentWithLocation = await getMaps().addLocationInfoToIncident(scrapedIncident)
            if (incidentWithLocation !== undefined) {
              await getDatabase().createIncident(incidentWithLocation)
              dayStats.imported++
            } else {
              dayStats.noLocation++
            }
          } else {
            dayStats.alreadyExists++
          }
        }
        await getDatabase().setConfigParam('lastImportedDate', dateToImport.toISOString())
      } finally {
        log.info(`| ${padStart(dateToImport.format(DATE_FORMAT), 10)} | ${padStart(dayStats.scraped, 7)} | ${padStart(dayStats.imported, 8)} | ${padStart(dayStats.alreadyExists, 9)} | ${padStart(dayStats.noLocation, 6)} |`)
        for (const prop in totalStats) {
          totalStats[prop] += dayStats[prop]
        }
      }
    }
  } catch (err) {
    if (err instanceof QueryLimitExceeded) {
      log.warn('Google geocode quota exhausted. Exiting...')
    } else {
      log.error(err)
    }
  } finally {
    log.info('--------------------------------------------------------')
    log.info('Police Daily Activity Importer run finished...')
    log.info('---------------------------------------------------------------------')
    log.info('| Start Date | End Date   | Scraped | Imported | Duplicate | No Geo |')
    log.info('---------------------------------------------------------------------')
    log.info(`| ${padStart(totalStats.startDay.format(DATE_FORMAT), 10)} | ${padStart(totalStats.endDay.format(DATE_FORMAT), 10)} | ${padStart(totalStats.scraped, 7)} | ${padStart(totalStats.imported, 8)} | ${padStart(totalStats.alreadyExists, 9)} | ${padStart(totalStats.noLocation, 6)} |`)
    log.info('---------------------------------------------------------------------')
    await getDatabase().logImport(totalStats)
  }
}
