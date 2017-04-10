import envalid, {str} from 'envalid'
import makeDriver from 'request-x-ray'
import Xray from 'x-ray'
import log from 'winston'

let POLICE_INCIDENT_URL
const MILLIS_IN_DAY = 1000 * 60 * 60 * 24
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function scrapeLastTwoDays () {
  const end = new Date()
  const start = new Date(Date.now() - MILLIS_IN_DAY)

  return scrapeRange(start, end)
}

async function scrapeRange (start, end) {
  const options = {
    method: 'POST',
    form: {
      btnGo: 'Go',
      RequestType: 'radbtnDetails',
      ...getFormDateFields(start, end),
      ...await getFormSecurityFields()
    }
  }

  const xRay = Xray({
    filters: {
      parseDate,
      parseAddress,
      parseDescription,
      trim
    }
  })
  xRay.driver(makeDriver(options))

  const selector = {
    incidents: xRay('td.info', [{
      reportedAt: 'b:nth-of-type(1) | parseDate',
      streetAddress: 'b:nth-of-type(2) | parseAddress | trim',
      offense: 'b:nth-of-type(3) | trim',
      caseNumber: 'b:nth-of-type(4) | trim',
      description: '@html | parseDescription | trim'
    }])
  }

  try {
    const {incidents} = await Promise.fromCallback(cb => xRay(POLICE_INCIDENT_URL, selector)(cb))
    incidents.splice(1)
    log.info(`Scraper: ${incidents.length} incidents retreived`)
    return incidents
  } catch (err) {
    log.error('Scraper: error while fetching incidents', err)
    throw err
  }
}

async function getFormSecurityFields () {
  const selector = {
    '__VIEWSTATE': 'input[name="__VIEWSTATE"]@value',
    '__VIEWSTATEGENERATOR': 'input[name="__VIEWSTATEGENERATOR"]@value',
    '__EVENTVALIDATION': 'input[name="__EVENTVALIDATION"]@value'
  }

  const xRay = Xray()
  try {
    const securityFields = await Promise.fromCallback(cb => xRay(POLICE_INCIDENT_URL, selector)(cb))
    log.info('Scraper: obtained security fields')
    return securityFields
  } catch (err) {
    log.error('Scraper: error while fetching security fields', err)
    throw err
  }
}

const getFormDateFields = (start, end) => {
  return {
    ddlFromMonth: start.getMonth(),
    ddlFromDate: start.getDate(),
    ddlFromYear: start.getFullYear(),
    ddlToMonth: end.getMonth(),
    ddlToDate: end.getDate(),
    ddlToYear: end.getFullYear()
  }
}

const parseDate = value => {
  if (!value) return undefined

  const re = /([A-Z][a-z]{2})\s+(\d{1,2})\s+(\d{4})\s+(\d{1,2}):(\d{2})(AM|PM)/
  const result = re.exec(value)
  const date = [
    result[3], // year
    MONTHS.indexOf(result[1]), // month
    result[2], // day
    result[6] === 'PM' && Number(result[4]) < 12 ? Number(result[4]) + 12 : result[4], // hour
    result[5] // minute
  ]

  return new Date(...date)
}

const parseAddress = value => value.replace('BLK', '').replace(/\s+/g, ' ')

const parseDescription = value => {
  if (!value) return undefined

  const re = /([^>]*)(<br>)?$/
  const result = re.exec(value)
  return result == null ? undefined : result[1].replace(/(\s|\\n|\\r|\\t)+/g, ' ')
}

const trim = value => value.trim()

let scraper
export default () => {
  if (!scraper) {
    const env = envalid.cleanEnv(process.env, {
      POLICE_INCIDENT_URL: str({desc: 'Police daily activity URL'})
    })

    POLICE_INCIDENT_URL = env.POLICE_INCIDENT_URL
    scraper = Object.freeze({
      scrapeLastTwoDays,
      scrapeRange
    })
    log.info('Scraper: initialized')
  }
  return scraper
}
