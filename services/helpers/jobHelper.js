/**
* Method to search the jobs with geobounds
*
* @param bounds
* @param zoom
* @param filters
* @param callback
*/
export const getOffersAround = (bounds, filters, kuzzle, callback) => {
  var topLeft = {
    lat: bounds._ne.lat,
    lon: bounds._sw.lng
  }

  var bottomRight = {
    lat: bounds._sw.lat,
    lon: bounds._ne.lng
  }

  var mustFilters = []
  var shouldFilters = []

  /*
    Search engine : Construct the ES query based on filled checkboxes
  */
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
          geo_bounding_box: {
            jobPosition: {
              top_left: topLeft,
              bottom_right: bottomRight
            }
          }
        }
      }
    }
  }

  let options = {
    from: 0,
    size: 1000
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

      callback(accumulator)
    })
}

/**
* Scroll search for more points
* Not used - Performances issues ?
*/
export const scrollSearch = (accumulator, scrollId, kuzzle, callback) => {
  kuzzle.collection('data', 'offers')
    .scroll(scrollId, {scroll: '10s'}, (error, offers) => {
      if (error) {
        callback(error)
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
