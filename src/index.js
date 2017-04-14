/* global Promise:true */
import BluebirdPromise from 'bluebird'
import moment from 'moment-timezone'
import getDatabase, {init as initDb} from './database'
import log from './log'
import getMaps, {init as initMaps, QueryLimitExceeded} from './maps'
import getScraper, {init as initScraper} from './scraper'

Promise = BluebirdPromise

async function init () {
  await initDb()
  await initScraper()
  await initMaps()
}

export async function deleteAllIncidents () {
  await init()
  await getDatabase().deleteAllIncidents()
  await getDatabase().setConfigParam('lastImportedDate', moment.tz('12/31/1998', 'MM/DD/YYYY', 'America/Los_Angeles').toISOString())
}

export async function importIncidents () {
  try {
    log.info('Police Daily Activity Importer starting...')

    await init()

    while (true) {
      const lastImportDateStr = await getDatabase().getConfigParam('lastImportedDate')
      const dateToImport = moment.tz(lastImportDateStr, 'America/Los_Angeles').add(1, 'days')

      if (!dateToImport.isBefore(moment(), 'date')) {
        log.info('Up to date. Exiting...')
        break
      }

      log.info(`Importing ${dateToImport.toString()}`)

      const scrapedIncidents = await getScraper().scrape(dateToImport)
      for (const scrapedIncident of scrapedIncidents) {
        if (await getDatabase().isIncidentUnsaved(scrapedIncident)) {
          const incidentWithLocation = await getMaps().addLocationInfoToIncident(scrapedIncident)
          if (incidentWithLocation !== undefined) {
            getDatabase().createIncident(incidentWithLocation)
          }
        }
      }
      await getDatabase().setConfigParam('lastImportedDate', dateToImport.toISOString())
      log.info(`${dateToImport.toString()} successfully imported.`)
    }
  } catch (err) {
    if (err instanceof QueryLimitExceeded) {
      log.info('Google geocode quota exhausted. Exiting...')
    } else {
      log.error(err)
    }
  }
}
