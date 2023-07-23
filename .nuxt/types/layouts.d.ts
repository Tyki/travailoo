import { ComputedRef, Ref } from 'vue'
export type LayoutKey = "default" | "signup"
declare module "/home/gara/www/travailoo/node_modules/nuxt/dist/pages/runtime/composables" {
  interface PageMeta {
    layout?: false | LayoutKey | Ref<LayoutKey> | ComputedRef<LayoutKey>
  }
}