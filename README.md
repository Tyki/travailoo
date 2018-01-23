# travailoo

> Nuxt.js project

## Build Setup

``` bash
# install dependencies
$ npm install # Or yarn install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm start

# generate static project
$ npm run generate
```

For detailed explanation on how things work, checkout the [Nuxt.js docs](https://github.com/nuxt/nuxt.js).

To implement :
```
{
    "query": {
        "match_all": {}
    },
    "size": 0,
    "aggs": {
        "filtered_cells": {
            "filter": {
                "geo_distance": {
                	"distance": "100km",
                    "jobPosition": {
                        "lat": 43.61003281535646,
                        "lon": 3.909895350331583
                    }
                }
            },
            "aggs": {
                "cells": {
                    "geohash_grid": {
                        "field": "jobPosition",
                        "precision": 4 // To scale with distance
                    },
                    "aggs": {
                        "center_lat": {
                            "avg": {
                                "script": "doc['jobPosition'].lat"
                            }
                        },
                        "center_lon": {
                            "avg": {
                                "script": "doc['jobPosition'].lon"
                            }
                        }
                    }
                }
            }
        }
    }
}
```
