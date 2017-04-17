/* global Promise:true */
import BluebirdPromise from 'bluebird'
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
  const totalStats = {
    total: 0,
    imported: 0,
    alreadyExists: 0,
    noLocation: 0
  }
  try {
    log.info('Police Daily Activity Importer starting...')

    await init()

    while (true) {
      const lastImportDateStr = await getDatabase().getConfigParam('lastImportedDate')
      const dateToImport = moment.tz(lastImportDateStr, 'America/Los_Angeles').add(1, 'days')

      if (!dateToImport.isBefore(moment(), 'date')) {
        break
      }

      log.info(`Beginning ${dateToImport.format(DATE_FORMAT)}`)

      const dayStats = {
        total: 0,
        imported: 0,
        alreadyExists: 0,
        noLocation: 0
      }

      try {
        const scrapedIncidents = await getScraper().scrape(dateToImport)
        dayStats.total = scrapedIncidents.length
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
        log.info(`Finished ${dateToImport.format(DATE_FORMAT)}: total: ${dayStats.total}, imported: ${dayStats.imported}, already exists: ${dayStats.alreadyExists}, no location: ${dayStats.noLocation}`)
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
  }
  log.info(`Finished: total: ${totalStats.total}, imported: ${totalStats.imported}, already exists: ${totalStats.alreadyExists}, no location: ${totalStats.noLocation}`)
}
