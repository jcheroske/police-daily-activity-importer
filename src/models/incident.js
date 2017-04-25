import gql from 'graphql-tag'
import {get} from 'lodash'
import log from '../log'

const fetchPolicy = 'network-only'

const findByCaseNumberQuery = gql`
  query FindIncidentByCaseNumber($caseNumber: String!) {
    Incident(caseNumber: $caseNumber) {
      id
    }
  }
`

const findUngeocodedQuery = gql`
  query FindUngeocoded (
    $nullBoolean: Boolean = null
  ) {
    allIncidents(
      filter: {
        geocodeFailed: $nullBoolean
      },
      orderBy: reportedAt_ASC
    ) {
      id,
      streetAddress,
      city,
      reportedAt,
      state
    }
  }
`

const createMutation = gql`
  mutation CreateIncident(
    $caseNumber: String!
    $description: String
    $offense: String!
    $reportedAt: DateTime!
    $streetAddress: String!
    $city: String!
    $state: String!
  ) {
    createIncident(
      caseNumber: $caseNumber
      description: $description
      offense: $offense
      reportedAt: $reportedAt
      streetAddress: $streetAddress
      city: $city
      state: $state
    ) {
      id
    }
  }
`

const saveGeocodeDataMutation = gql`
  mutation SaveGeocodeData(
    $geocodeFailed: Boolean!
    $id: ID!
    $lat: Float
    $lng: Float
    $prettyStreetAddress: String
    $zipCode: String
  ) {
    updateIncident(
      geocodeFailed: $geocodeFailed
      id: $id
      lat: $lat
      lng: $lng
      prettyStreetAddress: $prettyStreetAddress
      zipCode: $zipCode
    ) {
      id
    }
  }
`

export default async function init (client) {
  return {
    async findByCaseNumber (caseNumber) {
      const result = await client.query({
        fetchPolicy,
        query: findByCaseNumberQuery,
        variables: {caseNumber}
      })

      const dbInstance = get(result, 'data.Incident')
      log.debug(`Incident.findByCaseNumber()`, caseNumber, dbInstance)
      return dbInstance
    },

    async findUngeocoded () {
      const result = await client.query({
        fetchPolicy,
        query: findUngeocodedQuery
      })

      const incidents = get(result, 'data.allIncidents')
      if (incidents == null) {
        log.error('Database: instance.findUngeocoded(): malformed GraphQL result', result)
        throw new Error('Database: instance.findUngeocoded(): malformed GraphQL result')
      } else {
        log.debug(`Incident.findUngeocoded()`, incidents)
      }
      return incidents
    },

    async create (incident) {
      const result = await client.mutate({
        mutation: createMutation,
        variables: incident
      })

      const dbInstance = get(result, 'data.createIncident')
      if (dbInstance == null) {
        log.error('Database: instance.create(): malformed GraphQL result', result)
        throw new Error('Database: instance.create(): malformed GraphQL result')
      } else {
        log.debug(`Incident.create()`, incident, dbInstance)
      }
      return dbInstance
    },

    async saveGeocodedData (incident) {
      const result = await client.mutate({
        mutation: saveGeocodeDataMutation,
        variables: incident
      })

      const dbInstance = get(result, 'data.updateIncident')
      if (dbInstance == null) {
        log.error('Database: instance.update(): malformed GraphQL result', result)
        throw new Error('Database: instance.update(): malformed GraphQL result')
      } else {
        log.debug(`Incident.update()`, incident, dbInstance)
      }
      return dbInstance
    }
  }
}
