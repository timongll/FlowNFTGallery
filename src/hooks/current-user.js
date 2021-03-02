import {useEffect} from "react"
import {atom, useSetRecoilState, useRecoilValue} from "recoil"
import * as fcl from "@onflow/fcl"

// This is a recoil atom (https://recoiljs.org/docs/api-reference/core/atom)
// You can think of it as a unique reactive node with our current users state.
// Our hook is going to subscribe to this state.
export const $currentUser = atom({
  key: "CURRENT_USER", // Atoms needs a unique key, we can only ever call the atom function once with this key.
  default: {addr: null, cid: null, loggedIn: null},
})

// We only want a single place where we subscribe and update our
// current users atom state. That will be this component that we will
// add to the root of our application.
export function CurrentUserSubscription() {
  const setCurrentUser = useSetRecoilState($currentUser)
  useEffect(() => fcl.currentUser().subscribe(setCurrentUser), [setCurrentUser])
  return null
}

// Our actual hook, most of the work is happening
// in our CurrentUserSubscription component so that allows
// this hook to focus on decorating the current user value
// we receive with some helper functions
export function useCurrentUser() {
  const currentUser = useRecoilValue($currentUser)

  return {
    ...currentUser,
    logOut: fcl.unauthenticate,
    logIn: fcl.logIn,
    signUp: fcl.signUp,
  }
}