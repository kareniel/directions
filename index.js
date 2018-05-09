#!/bin/node

/*
 *  directions -- print directions for optimal route
 *                between a given list of addresses
 *
 *  usage:
 *
 *  $ npm start {filepath}
 *
 *  filepath - filepath of utf8 text file with \n delimited postal adresses
 *
 **/

var fs = require('fs')
var request = require('request-promise')
var html = require('nanohtml')

const constants = require('./constants')

main(process.argv.slice(2))

async function main (args) {
  var filepath = args[0]
  var addresses = fs.readFileSync(filepath, 'utf8').split('\n')

  var { routes } = await getOptimizedRoute(addresses)

  var legs = routes[0].legs.map(leg => {
    return {
      from: leg.start_address,
      to: leg.end_address,
      steps: leg.steps.map(step => step.html_instructions)
    }
  })

  var pretty = html`
    <div>
      ${legs.map(leg => html`
        <div>
          <strong>From: </strong>${leg.from} <br/>
          <strong>To: </strong>${leg.to}
          <ul>${leg.steps.map(step => html`<li>${html(step)}</li>`)}</ul>
        </div>`
      )}
    </div>`

  process.stdout.write(pretty.toString())
}

function getOptimizedRoute (addresses) {
  var origin = addresses[0]
  var dest = addresses[addresses.length - 1]
  var waypoints = encodeURIComponent(addresses.slice(1, -1).join('|'))

  var opts = {
    method: 'GET',
    url: `https://maps.googleapis.com/maps/api/directions/json` +
         `?origin=${origin}&destination=${dest}&waypoints=optimize:true|${waypoints}&key=${constants.GOOGLE_KEY}`,
    json: true
  }

  return request(opts).then(res => {
    return res
  })
}
