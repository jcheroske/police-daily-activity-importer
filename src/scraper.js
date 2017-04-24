import envalid, {str} from 'envalid'
import {isEmpty} from 'lodash'
import moment from 'moment-timezone'
import makeDriver from 'request-x-ray'
import Xray from 'x-ray'
import log from './log'

let POLICE_INCIDENT_URL

async function scrape (date) {
  const options = {
    method: 'POST',
    form: {
      btnGo: 'Go',
      RequestType: 'radbtnDetails',
      ...getFormDateFields(date, date),
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
      reportedAt: `b:nth-of-type(1) | parseDate:${date.toISOString()}`,
      streetAddress: 'b:nth-of-type(2) | parseAddress | trim',
      offense: 'b:nth-of-type(3) | trim',
      caseNumber: 'b:nth-of-type(4) | trim',
      description: '@html | parseDescription | trim'
    }])
  }

  let result
  try {
    result = await Promise.fromCallback(cb => xRay(POLICE_INCIDENT_URL, selector)(cb))
  } catch (err) {
    log.error('Scraper: error while fetching incidents', err)
    throw err
  }

  if (!result || !result.incidents) {
    log.error('Scraper: malformed scraper result', result)
    throw new Error('Scraper: malformed scraper result')
  }

  const {incidents} = result
  incidents.forEach(i => {
    i.city = 'Bellingham'
    i.state = 'WA'
  })
  log.verbose(`Scraper: ${incidents.length} incidents scraped`)
  log.debug('Scraped incidents', incidents)
  return incidents
}

let securityFields
async function getFormSecurityFields () {
  if (securityFields) return securityFields

  const selector = {
    '__VIEWSTATE': 'input[name="__VIEWSTATE"]@value',
    '__VIEWSTATEGENERATOR': 'input[name="__VIEWSTATEGENERATOR"]@value',
    '__EVENTVALIDATION': 'input[name="__EVENTVALIDATION"]@value'
  }

  const xRay = Xray()
  try {
    securityFields = await Promise.fromCallback(cb => xRay(POLICE_INCIDENT_URL, selector)(cb))
  } catch (err) {
    log.error('Scraper: error while fetching security fields', err)
    throw err
  }

  if (!securityFields || isEmpty(securityFields)) {
    log.error('Scraper: malformed security fields', securityFields)
    throw new Error('Scraper: malformed security fields')
  }
  log.verbose('Scraper: obtained security fields')
  return securityFields
}

const getFormDateFields = (startMoment, endMoment) => {
  return {
    ddlFromMonth: startMoment.month() + 1,
    ddlFromDate: startMoment.date(),
    ddlFromYear: startMoment.year(),
    ddlToMonth: endMoment.month() + 1,
    ddlToDate: endMoment.date(),
    ddlToYear: endMoment.year()
  }
}

const parseDate = (value, defaultDate) => {
  if (!value) return defaultDate

  return moment.tz(value, 'MMM DD YYYY hh:mmA', 'America/Los_Angeles').toISOString()
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

export async function init () {
  const env = envalid.cleanEnv(process.env, {
    POLICE_INCIDENT_URL: str({desc: 'Police daily activity URL'})
  })

  POLICE_INCIDENT_URL = env.POLICE_INCIDENT_URL
  scraper = Object.freeze({
    scrape
  })
  log.verbose('Scraper: initialized')
}

export default () => scraper
