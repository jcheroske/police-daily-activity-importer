/* global Promise:true */
import BluebirdPromise from 'bluebird'
import moment from 'moment'
import log from 'winston'
import getDatabase from './database'
import getMaps from './maps'
import getScraper from './scraper'

log.level = 'debug'

process.env.TZ = 'UTC'
Promise = BluebirdPromise

const MAPS_REQUESTS_PER_DAY = 2450

run()
  .catch(err => log.error(err))

async function run () {
  log.info('Police Daily Activity Importer starting...')
  let numMapsRequests = 0
  while (true) {
    const lastImportDateStr = await getDatabase().getConfigParam('lastImportedDate')
    console.log(lastImportDateStr)
    const dateToImport = moment(lastImportDateStr).add(1, 'days')
    console.log(dateToImport)

    if (!dateToImport.isBefore(moment(), 'date')) {
      log.info('Up to date. Exiting...')
      break
    }

    log.info(`Importing ${dateToImport.toString()}`)

    const scrapedIncidents = await getScraper().scrape(dateToImport)
    if (scrapedIncidents.length + numMapsRequests > MAPS_REQUESTS_PER_DAY) {
      log.info('Import suspended: maps quota exceeded.')
      break
    }
    const incidentsWithLocation = await getMaps().addLocationInfoToIncidents(scrapedIncidents)
    await getDatabase().addIncidents(incidentsWithLocation)
    await getDatabase().setConfigParam('lastImportedDate', dateToImport.toISOString())
    numMapsRequests += scrapedIncidents.length
    log.info(`${dateToImport.toString()} successfully imported. Quota remaining: ${MAPS_REQUESTS_PER_DAY - numMapsRequests}`)
  }
}
