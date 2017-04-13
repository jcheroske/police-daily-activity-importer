/* global Promise:true */
import BluebirdPromise from 'bluebird'
import moment from 'moment-timezone'
import getDatabase from './database'
import log from './log'
import getMaps from './maps'
import getScraper from './scraper'

Promise = BluebirdPromise

run()
// deleteAll()
   .catch(err => log.error(err))

async function deleteAll () {
  await getDatabase().deleteAllIncidents()
  await getDatabase().setConfigParam('lastImportedDate', moment.tz('12/31/1998', 'MM/DD/YYYY', 'America/Los_Angeles').toISOString())
}

async function run () {
  log.info('Police Daily Activity Importer starting...')

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
}
