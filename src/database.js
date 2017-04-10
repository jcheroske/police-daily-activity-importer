import ApolloClient, { createNetworkInterface } from 'apollo-client'
import envalid, {str} from 'envalid'
import gql from 'graphql-tag'
import 'isomorphic-fetch'
import log from 'winston'

let client

async function addIncidents (incidents) {
  for (const incident of incidents) {
    await addIncident(incident)
  }
}

async function addIncident (incident) {
  if (await isIncidentUnsaved(incident)) {
    createIncident(incident)
  }
}

async function createIncident (incident) {
  log.info('Creating new Incident', incident)
  const {data: {createIncident}} = await client.mutate({
    mutation: gql`
      mutation {
        createIncident(
          caseNumber: "${incident.caseNumber}"
          description: "${incident.description}"
          offense: "${incident.offense}"
          reportedAt: "${incident.reportedAt.toISOString()}"
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
    query: gql`
      query {
        Incident(caseNumber: "${incident.caseNumber}") {
          id,
          caseNumber
        }  
      }
    `
  })
  log.info('Databae: ')
  return Incident == null
}

let database
export default () => {
  if (!database) {
    const env = envalid.cleanEnv(process.env, {
      GRAPH_QL_ENDPOINT: str({desc: 'GraphQL endpoint URL'})
    })

    log.info('Database: connecting to GraphQL endpoint.')
    client = new ApolloClient({
      networkInterface: createNetworkInterface({
        uri: env.GRAPH_QL_ENDPOINT
      })
    })
    database = Object.freeze({addIncidents})
    log.info('Database: successfully connected to GraphQL endpoint.')
  }
  return database
}
