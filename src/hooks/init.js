// File: ./src/hooks/init.js

import {atomFamily, useRecoilState} from "recoil"
import {isInitialized} from "../flow/is-initialized.script"
import {initAccount} from "../flow/init-account.tx"

const IDLE = "IDLE"
const PROCESSING = "PROCESSING"

// atomFamily is a function that returns a memoized function
// that constructs atoms. This will allow us to define the
// behaviour of the atom once and then construct new atoms
// based on an id (in this case the address)
const $profile = atomFamily({
  key: "INIT::PROFILE::STATE",
  default: null,
})

const $profileStatus = atomFamily({
  key: "INIT::PROFILE::STATUS",
  default: PROCESSING,
})

export function useInit(address) {
  const [profile, setProfile] = useRecoilState($profile(address))
  const [status, setStatus] = useRecoilState($profileStatus(address))

  // Will check if the supplied address is initialized
  async function check() {
    setStatus(PROCESSING)
    // isInitialized is going to throw an error if the address is null
    // so we will want to avoid that. Because react hooks can't dynamically
    // added and removed from a react node, you will find this sort of logic
    // will leak into our hooks, we could get around this by changing our
    // isInitialized function return null instead of throwing an error.
    if (address != null) await isInitialized(address).then(setProfile)
    setStatus(IDLE)
  }

  // will attempt at initializing the current address
  async function exec() {
    setStatus(PROCESSING)
    await initAccount()
    setStatus(IDLE)
    await check()
  }

  return {
    profile,
    check,
    exec,
    isIdle: status === IDLE,
    isProcessing: status === PROCESSING,
    status,
    IDLE,
    PROCESSING,
  }
}