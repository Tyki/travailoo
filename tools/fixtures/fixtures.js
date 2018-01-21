const Kuzzle = require('kuzzle-sdk')
const parse = require('csv-parse')
const bluebird = require('bluebird')
const fs = require('fs')

Kuzzle.prototype.bluebird = bluebird
let kuzzle = new Kuzzle('localhost')

let output = []

let data = []

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

function insertData () {
  kuzzle.loginPromise('local', {username: 'admin', password: 'admin'}, '1h')
    .then(() => kuzzle.createIndexPromise('offers'))
    .then(() => kuzzle.collection('data', 'offers').createPromise())
    .then(() => kuzzle.collection('data', 'offers').collectionMapping({
      position: {
        type: 'geo_point'
      }
    })).applyPromise()
    .then(() => kuzzle.createIndexPromise('labels'))
    .then(() => kuzzle.collection('categories', 'labels').createPromise())
    .then(() => kuzzle.collection('midCategories', 'labels').createPromise())
    .then(() => kuzzle.collection('subCategories', 'labels').createPromise())
    .then(() => kuzzle.collection('jobs', 'labels').createPromise())
    .then(() => kuzzle.queryPromise({controller: 'bulk', action: 'import'}, {body: {bulkData: data}}))
    .then(response => {
      console.log('done !')
      process.exit(0)
    }).catch(error => {
      console.error(error)
      process.exit(1)
    })
}

createFixtures()
