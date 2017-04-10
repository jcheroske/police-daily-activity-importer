/* global Promise:true */
import BluebirdPromise from 'bluebird'
import log from 'winston'
import getDatabase from './database'
import getMaps from './maps'
import getScraper from './scraper'

Promise = BluebirdPromise

log.info('Police Daily Activity Importer starting...')

async function importLastTwoDays () {
  const scrapedIncidents = await getScraper().scrapeLastTwoDays()
  const incidentsWithLocation = await getMaps().addLocationInfoToIncidents(scrapedIncidents)
  await getDatabase().addIncidents(incidentsWithLocation)
}

importLastTwoDays()
  .catch(err => console.log(err))
