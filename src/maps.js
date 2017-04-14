import GoogleMaps from '@google/maps'
import envalid, {str} from 'envalid'
import ExtendableError from 'es6-error'
import rateLimiter from 'simple-rate-limiter'
import log from './log'

export class QueryLimitExceeded extends ExtendableError {
  constructor () {
    super('Google maps API query limit exceeded')
  }
}

let googleGeocode

async function addLocationInfoToIncident (incident) {
  const locationInfo = await geocodeAddress({
    streetAddress: incident.streetAddress,
    city: 'Bellingham',
    state: 'WA'
  })

  return locationInfo ? {
    ...incident,
    streetAddress: locationInfo.address.split(',')[0].trim(),
    zipCode: locationInfo.address.match(/\d{5}/)[0],
    lat: locationInfo.lat,
    lng: locationInfo.lng
  } : undefined
}

async function geocodeAddress ({streetAddress, city, state}) {
  const rawAddress = [streetAddress, city, state].join(', ')
  log.debug(`Maps: about to geocode ${rawAddress}`)

  const response = await googleGeocode({address: rawAddress})

  const {status, results} = response.json
  if (status === 'OVER_QUERY_LIMIT') {
    throw new QueryLimitExceeded()
  }

  if (status !== 'OK') {
    log.warn(`Maps: geocode failed for ${rawAddress} with status ${status}`)
    return undefined
  }

  const {formatted_address: address, geometry: {location: {lat, lng}}} = results[0]
  log.debug(`Maps: geocode successful: ${address} ${lat} ${lng}`)
  return {address, lat, lng}
}

let maps
export default () => {
  if (!maps) {
    const env = envalid.cleanEnv(process.env, {
      GOOGLE_MAPS_API_KEY: str({desc: 'Google maps node API key'})
    })

    const client = GoogleMaps.createClient({
      key: env.GOOGLE_MAPS_API_KEY,
      'rate.limit': 40,
      timeout: 5000,
      Promise
    })

    googleGeocode = Promise.promisify(rateLimiter(::client.geocode).to(45).per(1000))

    maps = Object.freeze({addLocationInfoToIncident})
    log.info('Maps: initialized')
  }
  return maps
}
