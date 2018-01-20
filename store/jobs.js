export const state = () => ({
  // categories
  categories: {},
  midCategories: {},
  subCategories: {},
  jobs: {}
})

export const mutations = {
  addToCategories (state, documents) {
    documents.forEach(document => {
      state.categories[document.id] = document.content.name
    })

    console.log(state.categories)
  }
}
