import ApolloClient, { createNetworkInterface } from 'apollo-client'
import envalid, {str} from 'envalid'
import gql from 'graphql-tag'
import 'isomorphic-fetch'
import log from 'winston'

class Database {
  client

  constructor () {
    const env = envalid.cleanEnv(process.env, {
      GRAPH_QL_ENDPOINT: str({desc: 'GraphQL endpoint URL'})
    })

    try {
      log.info('Connecting to GraphQL endpoint.')
      this.client = new ApolloClient({
        networkInterface: createNetworkInterface({
          uri: env.GRAPH_QL_ENDPOINT
        })
      })
    } catch (err) {
      log.error('Error connecting to GraphQL endpoint.', err)
    }
  }

  async addIncident (incident) {
    if (await !this.getIncidentByCaseNumber(incident.caseNumber)) {
      this.createIncident(incident)
    }
  }

  async createIncident (incident) {
    log.info('Creating new Incident', incident)
    const {data: {createIncident}} = await this.client.mutate({
      mutation: gql`
        mutation {
          createIncident(
            caseNumber: "${incident.caseNumber}"
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

  async getIncidentByCaseNumber (caseNumber) {
    const {data: {Incident: incident}} = await this.client.query({
      query: gql`
        query {
          Incident(caseNumber: "${caseNumber}") {
            id,
            caseNumber
          }  
        }
      `
    })
    return incident
  }
}

let database
export default () => {
  if (!database) {
    database = new Database()
  }
  return database
}
