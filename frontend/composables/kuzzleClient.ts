import { Kuzzle, WebSocket} from 'kuzzle-sdk'
import { useUserStore } from '~~/stores'

let kuzzleReady = false
let kuzzleClient: Kuzzle

export function useKuzzleClient() {
  const userStore = useUserStore();

  const init = async function () {
    if (kuzzleReady) return

    // TODO: migrate to env files
    kuzzleClient = new Kuzzle(
      new WebSocket('localhost')
    );

    console.log('[Kuzzle] Connecting... ')
    await kuzzleClient.connect()

    console.log('[Kuzzle] Connected.')

    if(userStore.jwt) {
      console.log('[Kuzzle] Checking JWT...')
      const isValid = await kuzzleClient.auth.checkToken(userStore.jwt)
      console.log(isValid)
      if (!isValid) {
        userStore.jwt = null
      } else {
        kuzzleClient.jwt = userStore.jwt
      }
    }

    kuzzleReady = true
  }

  return {
    client: kuzzleClient,
    init,
    kuzzleReady
  }
}