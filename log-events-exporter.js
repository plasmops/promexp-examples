const util = require('util')
const prometheus = require('prom-client')
const asyncHandler = require('express-async-handler')
const express = require('express')()
const logger = require('pino')({messageKey: 'message', useLevelLabels: true})

// generate random events at interval between low and high (in seconds)
const high = 15
const low  = 5

const events = [
  'signin',
  'signout',
  'transfer',
  'new_wallet'
]

const dynLevel = [
  'info',
  'error',
  'warn'
]

/* ====== Start express server ======*/
express.get('/', asyncHandler(async (req, res, next) => {
	res.send({status: 'ok'})
}))


// We need to register only one endpoint to export promethes metrics
express.get('/metrics', (req, res) => {
  res.set('Content-Type', prometheus.register.contentType)
  res.end(prometheus.register.metrics())
})

// initiate http server
var server = express.listen(80, (srv) => logger.info('express server is listening'))

/* ====== Register promethues exporter default metrics collection  ====== */
// Probe every default 10 seconds.
prometheus.collectDefaultMetrics()
// client.collectDefaultMetrics({timeout: 5000}) // timeout in ms

// event counter metric with two labels
eventCounter = new prometheus.Counter({
  name: 'my_event',
  help: 'Service my-api general event',
  labelNames: ['level', 'event_type']
})

// wait for the given number of seconds
async function wait(sec) {
  const delay = util.promisify(setTimeout) 
  await delay(sec * 1000)
}


// infinite event loop
async function main() {
  while(true) {
    let delay = Math.random() * (high - low) + low
    let level = dynLevel[Math.floor(Math.random() * dynLevel.length)]
    let event_type = events[Math.floor(Math.random() * events.length)]

    // random delay
    await wait(delay)

    // log event on random level
    logger[level]({event_type: event_type}, 'event message')

    // increase counter metric
    // in each step we always get one new event, that's why we use a counter
    eventCounter.labels(level, event_type).inc()
  }
}

// handlers
process.on('SIGTERM', function () {
  server.close(function () {
    process.exit(0);
  });
});

process.on('SIGINT', function () {
  server.close(function () {
    process.exit(0);
  });
});

main()
  .then()
  .catch(console.error)
