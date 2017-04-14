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
  return result.data.Config[name]
}

async function setConfigParam (name, value) {
  await client.mutate({
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
  return undefined
}

async function createIncident (incident) {
  log.debug('Creating new Incident', incident)
  const {data: {createIncident}} = await client.mutate({
    mutation: gql`
      mutation {
        createIncident(
          caseNumber: "${incident.caseNumber}"
          description: "${incident.description}"
          offense: "${incident.offense}"
          reportedAt: "${incident.reportedAt}"
          streetAddress: "${incident.streetAddress}"
        ) {
          id,
          caseNumber
        }
      }
    `
  })
  return createIncident
}

async function isIncidentUnsaved (incident) {
  const {data: {Incident}} = await client.query({
    fetchPolicy: 'network-only',
    query: gql`
      query {
        Incident(caseNumber: "${incident.caseNumber}") {
          id,
          caseNumber
        }  
      }
    `
  })
  log.debug(`Database: case number ${incident.caseNumber} ${Incident == null ? 'does not exist' : 'already exists'} in the database`)
  return Incident == null
}

async function deleteAllIncidents () {
  const {data: {allIncidents}} = await client.query({
    fetchPolicy: 'network-only',
    query: gql`
      query {
        allIncidents {
          id
        }
      }
    `
  })

  for (const incident of allIncidents) {
    await client.mutate({
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
