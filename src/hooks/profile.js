// File: ./src/hooks/profile.js

import {atomFamily, useRecoilState} from "recoil"
import {fetchProfile} from "../flow/fetch-profile.script"
import {setName as profileSetName} from "../flow/profile-set-name.tx"
import {useCurrentUser} from "./current-user"

const DEFAULT = {
  name: "Anon",
  color: "#232323",
  info: "...",
  avatar: "https://avatars.onflow.org/avatar/pew",
}
const IDLE = "IDLE"
const PROCESSING = "PROCESSING"

const $profile = atomFamily({
  key: "PROFILE::STATE",
  default: DEFAULT,
})

const $status = atomFamily({
  key: "PROFILE::STATUS",
  default: PROCESSING,
})

export function useProfile(address) {
  const cu = useCurrentUser()
  const [profile, setProfile] = useRecoilState($profile(address))
  const [status, setStatus] = useRecoilState($status(address))

  async function refetch() {
    setStatus(PROCESSING)
    await fetchProfile(address)
      .then(profile => {
        if (profile == null) return profile
        if (profile.avatar === "") profile.avatar = DEFAULT.avatar
        if (profile.info === "") profile.info = DEFAULT.info
        return profile
      })
      .then(setProfile)
    setStatus(IDLE)
  }

  async function setName(name) {
    setStatus(PROCESSING)
    await profileSetName(name)
    setStatus(IDLE)
    await refetch()
  }

  return {
    ...(profile ?? DEFAULT),
    status,
    isCurrentUser: address === cu.addr,
    setName,
    refetch,
    IDLE,
    PROCESSING,
    isIdle: status === IDLE,
    isProcessing: status === PROCESSING,
  }
}