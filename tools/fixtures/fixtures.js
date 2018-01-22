const Kuzzle = require('kuzzle-sdk')
const parse = require('csv-parse')
const bluebird = require('bluebird')
const fs = require('fs')
const randomWords = require('random-words')
const uuidv4 = require('uuid/v4')
const randomFloat = require('random-float')
const randomInt = require('random-int')

Kuzzle.prototype.bluebird = bluebird
let kuzzle = new Kuzzle('127.0.0.1')

let output = []

let data = []
let offers = []

function createFixtures () {
  try {
    // Create the parser
    let parser = parse({delimiter: ','})

    // Use the writable stream api
    parser.on('readable', function () {
      let record
      /* eslint-disable no-cond-assign */
      while (record = parser.read()) {
        output.push(record)
      }
    })

    // Catch any error
    parser.on('error', function (err) {
      console.error(err.message)
    })

    // When we are done, import the parsed content
    parser.on('finish', function () {
      output.forEach(row => {
        let category = row[0]
        let midCategory = row[1]
        let subCategory = row[2]
        let name = row[3]
        let code = row[4]

        if (midCategory === '' && subCategory === '' && code === '') {
          // Category
          data.push({
            create: {
              _index: 'labels',
              _type: 'categories',
              _id: category
            }
          })
          data.push({name, category})
        } else if (midCategory !== '' && subCategory === '' && code === '') {
          data.push({
            create: {
              _index: 'labels',
              _type: 'midCategories',
              _id: category + '-' + midCategory
            }
          })
          data.push({
            category,
            midCategory,
            name
          })
          // midCategory
        } else if (midCategory !== '' && subCategory !== '' && code === '') {
          // subCategory
          data.push({
            create: {
              _index: 'labels',
              _type: 'subCategories',
              _id: category + '-' + midCategory + '-' + subCategory
            }
          })
          data.push({
            category,
            midCategory,
            subCategory,
            name
          })
        } else {
          // Job
          data.push({
            create: {
              _index: 'labels',
              _type: 'jobs',
              _id: code
            }
          })
          data.push({
            category,
            midCategory,
            subCategory,
            code,
            name,
            fullIdentifier: category + '-' + midCategory + '-' + subCategory
          })
        }
      })

      insertData()
    })

    fs.readFile('jobs.csv', {flags: 'r'}, (error, data) => {
      if (error) console.error(error)
      parser.write(data.toString())
      parser.end()
    })
  } catch (e) {
    console.error(e)
  }
}

function createOffersFixtures (callback) {
  offers = []
  var count = 1

  for (var i = 0; i < 1000; i++) {
    /**
     Ref GPS POINT
    'lat': 43.62613531177415,
    'lon': 3.9056396484375
    */
    var document = {
      'jobCode': randomInt(10200, 10500),
      'jobPosition': {
        'lat': '',
        'lon': ''
      },
      'title': randomWords({min: 3, max: 10, join: ' '}),
      'description': randomWords({min: 30, max: 80, join: ' '}),
      'societyName': randomWords(),
      'societyAddress': randomWords({min: 3, max: 10, join: ' '}),
      'societyWebsite': '',
      'experience': [],
      'salary': getRandomInt(120000)
    }

    var lat
    var lon
    if (count === 1) {
      lat = 43.62613531177415 + randomFloat(1)
      lon = 3.9056396484375 + randomFloat(1)
      count++
    } else if (count === 2) {
      lat = 43.62613531177415 - randomFloat(1)
      lon = 3.9056396484375 - randomFloat(1)
      count++
    } else if (count === 3) {
      lat = 43.62613531177415 - randomFloat(1)
      lon = 3.9056396484375 + randomFloat(1)
      count++
    } else if (count === 4) {
      lat = 43.62613531177415 + randomFloat(1)
      lon = 3.9056396484375 - randomFloat(1)
      count++
    } else {
      count = 1
    }

    document.jobPosition.lat = lat
    document.jobPosition.lon = lon

    var experience = getRandomInt(3)
    if (experience === 0 || experience === 1) {
      experience = {
        'key': 1,
        'label': 'Débutant'
      }
    } else if (experience === 2) {
      experience = {
        'key': 2,
        'label': 'Confirmé'
      }
    } else if (experience === 3) {
      experience = {
        'key': 3,
        'label': 'Senior'
      }
    }
    document.experience.push(experience)

    var offerType = getRandomInt(7)
    if (offerType === 0) {
      offerType = 1
    }
    document.offerType = offerType

    offers.push({
      create: {
        _index: 'offers',
        _type: 'data',
        _id: uuidv4()
      }
    })
    offers.push(document)
  }

  console.log('Done generating offers')
  callback()
}

function getRandomInt (max) {
  return Math.floor(Math.random() * Math.floor(max))
}

function insertData () {
  kuzzle.loginPromise('local', {username: 'admin', password: 'admin'}, '1h')
    .then(() => kuzzle.queryPromise({index: 'labels'}, {controller: 'index', action: 'delete'}))
    .then(() => kuzzle.queryPromise({index: 'offers'}, {controller: 'index', action: 'delete'}))
    .then(() => kuzzle.createIndexPromise('offers'))
    .then(() => kuzzle.collection('data', 'offers').createPromise())
    .then(() => kuzzle.createIndexPromise('labels'))
    .then(() => kuzzle.collection('data', 'offers').collectionMapping({'jobPosition': {type: 'geo_point', index: 'analyzed'}}).applyPromise())
    .then(() => kuzzle.collection('categories', 'labels').createPromise())
    .then(() => kuzzle.collection('midCategories', 'labels').createPromise())
    .then(() => kuzzle.collection('subCategories', 'labels').createPromise())
    .then(() => kuzzle.collection('jobs', 'labels').createPromise())
    .then(() => kuzzle.queryPromise({controller: 'bulk', action: 'import'}, {body: {bulkData: data}}))
    .then(() => kuzzle.queryPromise({controller: 'bulk', action: 'import'}, {body: {bulkData: offers}}))
    .then(response => {
      // console.log('done !')
      process.exit(0)
    }).catch(error => {
      console.error(error)
      process.exit(1)
    })
}

createOffersFixtures(() => {
  createFixtures()
})
