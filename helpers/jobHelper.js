const zoomToKm = {
  '1': 1000,
  '2': 1000,
  '3': 1000,
  '4': 1000,
  '5': 1000,
  '6': 1000,
  '7': 1000,
  '8': 350,
  '9': 60,
  '10': 30,
  '11': 15,
  '12': 7,
  '13': 5,
  '14': 4,
  '15': 2.5,
  '16': 1,
  '17': 1,
  '18': 0.5,
  '19': 0.5,
  '20': 0.25
}

/**
* Method to search the jobs around a geopoint
*
*/
export const getOffersAround = (lat, lng, zoom, filters, kuzzle, callback) => {
  var mustFilters = []
  var shouldFilters = []
  if (filters.hasOwnProperty('code') || filters.hasOwnProperty('offerType') || filters.hasOwnProperty('experience')) {
    if (filters.hasOwnProperty('code')) {
      mustFilters.push({
        term: {
          jobCode: filters.code
        }
      })
    }

    if (filters.hasOwnProperty('offerType')) {
      mustFilters.push({
        term: {
          offerType: filters.offerType
        }
      })
    }

    if (filters.hasOwnProperty('experience')) {
      filters.experience.forEach(experienceKey => {
        if (isNumber(experienceKey)) {
          shouldFilters.push({
            term: {
              experience: experienceKey
            }
          })
        }
      })

      mustFilters.push({
        bool: {
          should: shouldFilters
        }
      })
    }
  } else {
    mustFilters = {
      match_all: {
        boost: '1.0'
      }
    }
  }

  let search = {
    query: {
      bool: {
        must: mustFilters,
        filter: {
          geo_distance: {
            distance: zoomToKm[zoom] + 'km',
            jobPosition: {
              lat,
              lon: lng
            }
          }
        }
      }
    }
  }

  console.dir(search, {depth: null})

  let options = {
    from: 0,
    size: 1000
    // scroll: '10s'
  }

  let accumulator = {
    offers: [],
    limit: false
  }

  kuzzle.collection('data', 'offers')
    .search(search, options, (error, offers) => {
      if (error) {
        console.error(error)
        return callback(error)
      }

      accumulator.offers = offers.getDocuments().map(offer => {
        return {
          ...offer.content,
          id: offer.id,
          jobPosition: {
            lat: offer.content.jobPosition.lat,
            lng: offer.content.jobPosition.lon
          }
        }
      })

      if (offers.getDocuments().length === 1000) {
        accumulator.limit = true
      }

      console.log(accumulator.offers.length)

      callback(accumulator)
    })
}

/**
* Scroll search for more points
* Recursive !
*/
export const scrollSearch = (accumulator, scrollId, kuzzle, callback) => {
  kuzzle.collection('data', 'offers')
    .scroll(scrollId, {scroll: '10s'}, (error, offers) => {
      if (error) {
        console.error(error)
      }

      if (offers.getDocuments().length !== 1000) {
        offers.getDocuments().map(offer => {
          accumulator.push({
            ...offer.content,
            id: offer.id,
            jobPosition: {
              lat: offer.content.jobPosition.lat,
              lng: offer.content.jobPosition.lon
            }
          })
        })

        return callback(accumulator)
      } else {
        offers.getDocuments().map(offer => {
          accumulator.push({
            ...offer.content,
            id: offer.id,
            jobPosition: {
              lat: offer.content.jobPosition.lat,
              lng: offer.content.jobPosition.lon
            }
          })
        })

        return scrollSearch(accumulator, offers.options.scrollId, kuzzle, callback)
      }
    })
}

const isNumber = (n) => {
  return !isNaN(parseFloat(n)) && isFinite(n)
}
