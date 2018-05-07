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
var debug = require('debug')('directions-cli')

const constants = require('./constants')

debug(constants)

main(process.argv.slice(2))

async function main (args) {
  var filepath = args[0]
  debug(filepath)
  var addresses = fs.readFileSync(filepath, 'utf8').split('\n')
  debug('addresses', addresses)

  var places = await Promise.all(addresses.map(addr => geocode(addr)))
  debug('places', places)
  var route = await getOptimizedRoute(places)
  var directions = await getDirections(route)

  var output = directions.routes.map(route => route.legs.map(leg => {
    var summary = leg.summary.replace(', ', ' to ')
    var steps = leg.steps.map(step => step.maneuver.instruction)

    return {
      summary,
      steps
    }
  }))

  process.stdout.write(JSON.stringify(output[0], null, 2))
}

function geocode (address) {
  debug('address:', address)
  address = encodeURIComponent(address)

  var opts = {
    method: 'GET',
    url: 'https://maps.googleapis.com/maps/api/geocode/json?' +
         `address=${address}&key=${constants.GOOGLE_KEY}`,
    json: true
  }

  debug(opts.url)

  return request(opts).then(res => {
    var place = res.results[0]

    if (!place) throw new Error('uh oh, no place for', address)
    debug('place', place, 'res.results', res.results)
    var { lng, lat } = place.geometry.location

    return {
      address: place.formatted_address,
      coordinates: lng + ',' + lat
    }
  })
}

function getOptimizedRoute (places) {
  var coordinates = places.map(place => place.coordinates).join(';')

  var opts = {
    method: 'GET',
    url: `https://api.mapbox.com/optimized-trips/v1/mapbox/driving/${coordinates}` +
         `?access_token=${constants.MAPBOX_KEY}`,
    json: true
  }

  return request(opts)
}

function getDirections (route) {
  var coordinates = route.waypoints.map(waypoint => waypoint.location.join(',')).join(';')

  var opts = {
    method: 'GET',
    url: `https://api.mapbox.com/directions/v5/mapbox/driving/${coordinates}` +
         `?steps=true&access_token=${constants.MAPBOX_KEY}`,
    json: true
  }

  debug(opts.url)

  return request(opts)
}
