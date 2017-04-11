import GoogleMaps from '@google/maps'
import envalid, {str} from 'envalid'
import {isEmpty} from 'lodash'
import log from 'winston'

let client

async function addLocationInfoToIncidents (incidents) {
  const newIncidents = []
  for (const incident of incidents) {
    const locationInfo = await geocodeAddress({
      streetAddress: incident.streetAddress,
      city: 'Bellingham',
      state: 'WA'
    })

    if (locationInfo) {
      newIncidents.push({
        ...incident,
        streetAddress: locationInfo.address.split(',')[0].trim(),
        zipCode: locationInfo.address.match(/\d{5}/)[0],
        lat: locationInfo.lat,
        lng: locationInfo.lng
      })
    }
  }
  log.info(`Maps: geocoded ${newIncidents.length} incidents`)
  return newIncidents
}

async function geocodeAddress ({streetAddress, city, state}) {
  const address = [streetAddress, city, state].join(', ')
  log.debug(`Maps: about to geocode ${address}`)
  let response
  try {
    response = await client.geocode({address}).asPromise()
  } catch (err) {
    log.error('Error during geocode', err)
  }

  if (!response || isEmpty(response.json.results)) {
    log.warn(`Maps: geocode failed for ${address}`)
    return undefined
  } else {
    const {formatted_address: address, geometry: {location: {lat, lng}}} = response.json.results[0]
    log.debug(`Maps: geocode successful: ${address} ${lat} ${lng}`)
    return {address, lat, lng}
  }
}

let maps
export default () => {
  if (!maps) {
    const env = envalid.cleanEnv(process.env, {
      GOOGLE_MAPS_API_KEY: str({desc: 'Google maps node API key'})
    })

    client = GoogleMaps.createClient({
      key: env.GOOGLE_MAPS_API_KEY,
      Promise
    })

    maps = Object.freeze({addLocationInfoToIncidents})
    log.info('Maps: initialized')
  }
  return maps
}
