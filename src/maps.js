import GoogleMaps from '@google/maps'
import envalid, {str} from 'envalid'
import ExtendableError from 'es6-error'
import log from './log'

export class QueryLimitExceeded extends ExtendableError {
  constructor () {
    super('Google maps API query limit exceeded')
  }
}

let googleGeocode

async function addLocationInfoToIncident (incident) {
  const rawAddress = [incident.streetAddress, 'Bellingham', 'WA'].join(', ')
  log.debug(`Maps: about to geocode ${rawAddress}`)

  let response
  try {
    response = await googleGeocode({address: rawAddress})
  } catch (err) {
    if (err.message === 'timeout') {
      throw new QueryLimitExceeded()
    }
    log.error('Maps: error when invoking Google maps API', err)
    throw err
  }

  if (!response || !response.json) {
    log.warn('Maps: empty response or json payload', response)
    return undefined
  }

  const {status, results} = response.json

  if (response.json.status === 'OVER_QUERY_LIMIT') {
    log.warn('Maps: Query limit exceeded')
    throw new QueryLimitExceeded()
  }

  if (status !== 'OK') {
    log.warn('Maps: Non-OK status received', rawAddress, status)
    return undefined
  }

  if (!results || !results[0]) {
    log.warn('Maps: missing results payload', rawAddress, results)
    return undefined
  }

  const {formatted_address: formattedAddress, geometry} = results[0]

  if (!formattedAddress) {
    log.warn('Maps: missing formatted address', rawAddress, results[0])
    return undefined
  }

  if (!geometry || !geometry.location || !geometry.location.lat || !geometry.location.lng) {
    log.warn('Maps: missing or incomplete geometry object', rawAddress, results[0])
    return undefined
  }

  const streetAddressRegExResult = formattedAddress.split(',')
  if (!streetAddressRegExResult || !streetAddressRegExResult[0]) {
    log.warn('Maps: street address extraction failed', formattedAddress)
    return undefined
  }

  const streetAddress = streetAddressRegExResult[0].trim()

  const zipCodeRegExResult = formattedAddress.match(/\d{5}/)
  if (!zipCodeRegExResult || !zipCodeRegExResult[0]) {
    log.warn('Maps: zip code extraction failed', formattedAddress)
    return undefined
  }

  const zipCode = zipCodeRegExResult[0]

  const {lat, lng} = geometry.location

  log.debug('Maps: geocode successful', streetAddress, zipCode, lat, lng)
}

let maps

export async function init () {
  const env = envalid.cleanEnv(process.env, {
    GOOGLE_MAPS_API_KEY: str({desc: 'Google maps node API key'})
  })

  const client = GoogleMaps.createClient({
    key: env.GOOGLE_MAPS_API_KEY,
    'rate.limit': 40,
    timeout: 10000
  })

  googleGeocode = Promise.promisify(::client.geocode)

  maps = Object.freeze({addLocationInfoToIncident})
  log.verbose('Maps: initialized')
}

export default () => maps
