import winston from 'winston'

const consoleTransport = new winston.transports.Console({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'verbose',
  colorize: true,
  stderrLevels: ['error']
})

export default new winston.Logger({
  levels: { error: 0, warn: 1, info: 2, verbose: 3, debug: 4 },
  transports: [
    consoleTransport
  ]
})
