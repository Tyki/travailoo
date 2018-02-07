const allJobs = {}

/**
* Fetch all Jobs
*
*/
/**
Start the scroll for jobs labels
*/
export const loadJobs = (kuzzle, callback) => {
  kuzzle.collection('jobs', 'labels').search({query: {match_all: {}}}, {size: 1000, scroll: '1s'}, (error, result) => {
    if (error) {
      console.log(error)
    }

    result.getDocuments().forEach(document => {
      if (!Array.isArray(allJobs[document.content.fullIdentifier])) {
        allJobs[document.content.fullIdentifier] = []
      }
      allJobs[document.content.fullIdentifier].push(document)
    })

    if (result.options.scrollId && result.getDocuments().length !== 0) {
      scrollFetchJobs(result.options.scrollId, kuzzle, callback)
    } else {
      callback()
    }
  })
}

/**
 * Scrolling all the jobs labels
 */
const scrollFetchJobs = (scrollId, kuzzle, callback) => {
  if (scrollId) {
    kuzzle.collection('jobs', 'labels').scroll(scrollId, {scroll: '1s'}, (error, result) => {
      if (error) {
        console.log(error)
      }

      result.getDocuments().forEach(document => {
        if (!Array.isArray(allJobs[document.content.fullIdentifier])) {
          allJobs[document.content.fullIdentifier] = []
        }
        allJobs[document.content.fullIdentifier].push(document)
      })

      if (result.getDocuments().length !== 0 && result.options.scrollId) {
        scrollFetchJobs(result.options.scrollId, kuzzle, callback)
      } else {
        callback()
      }
    })
  }
}

/**
 * Search jobs without AJAX call
 */
export const searchJobLabels = (searchTerm) => {
  var result = []
  Object.keys(allJobs).forEach(fullIdentifier => {
    allJobs[fullIdentifier].forEach(document => {
      if (document.content.name.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1) {
        result.push({name: document.content.name, code: document.content.code})
      }
    })
  })

  result.sort((a, b) => {
    var nameA = a.name.toLowerCase()
    var nameB = b.name.toLowerCase()
    if (nameA < nameB) {
      return -1
    }

    if (nameA > nameB) {
      return 1
    }

    return 0
  })

  return result
}

export const searchJobsByFullIdentifier = (fullIdentifier) => {
  if (allJobs.hasOwnProperty(fullIdentifier)) {
    return allJobs[fullIdentifier]
  } else {
    return []
  }
}
