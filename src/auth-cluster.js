import React from "react"
import {useCurrentUser} from "./hooks/current-user"

function WithAuth() {
  const cu = useCurrentUser()   
  return !cu.loggedIn ? null : (
    <div>
      <span>{cu.addr ?? "No Address"}</span>
      <button onClick={cu.logOut}>Log Out</button>
    </div>
  )
}

function SansAuth() {
  const cu = useCurrentUser()
  return cu.loggedIn ? null : (
    <div>
      <button onClick={cu.logIn}>Log In</button>
      <button onClick={cu.signUp}>Sign Up</button>
    </div>
  )
}

export function AuthCluster() {
  return (
    <>
      <WithAuth />
      <SansAuth />
    </>
  )
}