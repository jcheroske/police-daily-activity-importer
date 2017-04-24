import ApolloClient, { createNetworkInterface } from 'apollo-client'
import envalid, {str} from 'envalid'
import log from './log'
import initConfig from './models/config'
import initIncident from './models/incident'

let database

export async function init () {
  const env = envalid.cleanEnv(process.env, {
    GRAPHCOOL_AUTHENTICATION_TOKEN: str({desc: 'Graphcool Authentication Token'}),
    GRAPH_QL_ENDPOINT: str({desc: 'GraphQL endpoint URL'})
  })

  const networkInterface = createNetworkInterface({
    uri: env.GRAPH_QL_ENDPOINT
  })

  networkInterface.use([{
    applyMiddleware (req, next) {
      if (!req.options.headers) {
        req.options.headers = {}
      }

      req.options.headers.authorization = `Bearer ${env.GRAPHCOOL_AUTHENTICATION_TOKEN}`
      next()
    }
  }])

  const client = new ApolloClient({networkInterface})

  database = Object.freeze({
    config: await initConfig(client),
    incident: await initIncident(client)
  })

  log.verbose('Database: initialized')
}

export default () => database
