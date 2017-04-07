import log from 'winston'
import getDatabase from './database'

log.info('Police Daily Activity Importer starting...')

getDatabase().createIncident({
  caseNumber: '1005',
  offense: 'stealing',
  reportedAt: new Date(),
  streetAddress: '100 Main St.'
})
  .then(newIncident => {
    console.log('New Incident', newIncident)
    return getDatabase().getIncidentByCaseNumber('1005')
  })
  .then(fetchedIncident => console.log('Fetched Incident', fetchedIncident))
  .catch(err => console.log(err))