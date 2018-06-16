export const state = () => ({
  // categories
  categories: {},
  midCategories: {},
  subCategories: {},
  jobs: [],
  filters: {}
})

export const mutations = {
  addToCategories (state, documents) {
    documents.forEach(document => {
      state.categories[document.content.category] = document.content.name
      // state.categories.push(document.content)
    })
  },

  addToMidCategories (state, documents) {
    documents.forEach(document => {
      if (!state.midCategories[document.content.category]) {
        state.midCategories[document.content.category] = {}
      }

      state.midCategories[document.content.category][document.content.midCategory] = document.content.name
    })
  },

  addToSubCategories (state, documents) {
    documents.forEach(document => {
      let identifier = document.content.category + '-' + document.content.midCategory
      if (!state.subCategories[identifier]) {
        state.subCategories[identifier] = {}
      }

      state.subCategories[identifier][document.content.subCategory] = document.content.name
    })
  },

  addToJobsList (state, documents) {
    state.jobs = documents
  },

  searchFilters (state, filters) {
    state.filters = filters
  }
}
