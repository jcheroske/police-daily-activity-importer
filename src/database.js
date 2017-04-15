import ApolloClient, { createNetworkInterface } from 'apollo-client'
import envalid, {str} from 'envalid'
import gql from 'graphql-tag'
import 'isomorphic-fetch'
import log from './log'

let client, configId

async function getConfigId () {
  const result = await client.query({
    fetchPolicy: 'network-only',
    query: gql`
      query {
        allConfigs {
          id
        }  
      }
    `
  })

  if (!result || !result.data || !result.data.allConfigs || !result.data.allConfigs[0] || !result.data.allConfigs[0].id) {
    log.error('Database: getConfigId(): malformed GraphQL result', result)
    throw new Error('Database: getConfigId(): malformed GraphQL result')
  }
  configId = result.data.allConfigs[0].id
}

async function getConfigParam (name) {
  const result = await client.query({
    fetchPolicy: 'network-only',
    query: gql`
      query {
        Config(id: "${configId}") {
          ${name}
        }  
      }
    `
  })

  if (!result || !result.data || !result.data.Config || !result.data.Config[name]) {
    log.error('Database: getConfigParam(): malformed GraphQL result', name, result)
    throw new Error('Database: getConfigParam(): malformed GraphQL result')
  }

  return result.data.Config[name]
}

async function setConfigParam (name, value) {
  const result = await client.mutate({
    mutation: gql`
      mutation {
        updateConfig (
          id: "${configId}",
          ${name}: "${value}"
        ) {
          id
        }
      }
    `
  })

  if (!result || !result.data || !result.data.updateConfig) {
    log.error('Database: setConfigParam(): malformed GraphQL result', name, value, result)
    throw new Error('Database: setConfigParam(): malformed GraphQL result')
  }

  return undefined
}

async function createIncident (incident) {
  log.debug('Creating new Incident', incident)
  const result = await client.mutate({
    mutation: gql`
      mutation {
        createIncident(
          caseNumber: "${incident.caseNumber}"
          description: "${incident.description}"
          offense: "${incident.offense}"
          reportedAt: "${incident.reportedAt}"
          streetAddress: "${incident.streetAddress}"
          zipCode: "${incident.zipCode}"
          lat: ${incident.lat}
          lng: ${incident.lng}
        ) {
          id
        }
      }
    `
  })

  if (!result || !result.data || !result.data.createIncident) {
    log.error('Database: createIncident(): malformed GraphQL result', incident, result)
    throw new Error('Database: createIncident(): malformed GraphQL result')
  }

  return result.data.createIncident
}

async function isIncidentUnsaved (incident) {
  const result = await client.query({
    fetchPolicy: 'network-only',
    query: gql`
      query {
        Incident(caseNumber: "${incident.caseNumber}") {
          id
        }  
      }
    `
  })

  if (!result || !result.data) {
    log.error('Database: isIncidentUnsaved(): malformed GraphQL result', incident, result)
    throw new Error('Database: isIncidentUnsaved(): malformed GraphQL result')
  }

  const returnValue = result.data.Incident == null
  log.debug(`Database: case number ${incident.caseNumber} ${returnValue ? 'does not exist' : 'already exists'} in the database`)
  return returnValue
}

async function deleteAllIncidents () {
  const allIncidentsResult = await client.query({
    fetchPolicy: 'network-only',
    query: gql`
      query {
        allIncidents {
          id
        }
      }
    `
  })

  if (!allIncidentsResult || !allIncidentsResult.data || !allIncidentsResult.data.allIncidents) {
    log.error('Database: deleteAllIncidents(): malformed GraphQL result', allIncidentsResult)
    throw new Error('Database: deleteAllIncidents(): malformed GraphQL result')
  }

  for (const incident of allIncidentsResult.data.allIncidents) {
    const deleteIncidentResult = await client.mutate({
      mutation: gql`
        mutation {
          deleteIncident(
            id: "${incident.id}"
          ) {
            id
          }
        }
      `
    })

    if (!deleteIncidentResult || !deleteIncidentResult.data || !deleteIncidentResult.data.deleteIncident) {
      log.error('Database: deleteAllIncidents(): malformed GraphQL result', deleteIncidentResult)
      throw new Error('Database: deleteAllIncidents(): malformed GraphQL result')
    }

    log.debug(`Database: incident ${incident.id} deleted`)
  }
}

let database

export async function init () {
  const env = envalid.cleanEnv(process.env, {
    GRAPH_QL_ENDPOINT: str({desc: 'GraphQL endpoint URL'})
  })

  client = new ApolloClient({
    networkInterface: createNetworkInterface({
      uri: env.GRAPH_QL_ENDPOINT
    })
  })

  await getConfigId()

  database = Object.freeze({
    getConfigParam,
    setConfigParam,
    createIncident,
    isIncidentUnsaved,
    deleteAllIncidents
  })
  log.verbose('Database: initialized')
}

export default () => database
