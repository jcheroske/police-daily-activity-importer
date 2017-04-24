import gql from 'graphql-tag'
import log from '../log'

const fetchPolicy = 'network-only'

const getParamQuery = gql`
  query GetConfigParam($id: ID!) {
    Config(id: $id) {
      lastImportedDate
    }
  }
`

const setParamMutation = gql`
  mutation SetConfigParam(
    $id: ID!,
    $lastImportedDate: DateTime
  ) {
    updateConfig(
      id: $id
      lastImportedDate: $lastImportedDate
    ) {
      id
    }
  }
`

export default async function init (client) {
  const configId = (await client.query({
    fetchPolicy: 'network-only',
    query: gql`
      query GetConfigId {
        allConfigs {
          id
        }
      }
    `
  })).data.allConfigs[0].id

  return {
    async getParam (name) {
      const result = await client.query({
        fetchPolicy,
        query: getParamQuery,
        variables: {id: configId}
      })

      if (!result || !result.data || !result.data.Config || !result.data.Config[name]) {
        log.error('Database: config.getParam(): malformed GraphQL result', name, result)
        throw new Error('Database: config.getParam(): malformed GraphQL result')
      }

      return result.data.Config[name]
    },

    async setParam (name, value) {
      const result = await client.mutate({
        fetchPolicy,
        mutation: setParamMutation,
        variables: {
          id: configId,
          [name]: value
        }
      })

      if (!result || !result.data || !result.data.updateConfig) {
        log.error('Database: config.setParam(): malformed GraphQL result', name, value, result)
        throw new Error('Database: config.setParam(): malformed GraphQL result')
      }
    }
  }
}
