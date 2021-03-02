import React from "react"
import {AuthCluster} from "./auth-cluster"
import {InitCluster} from "./init-cluster"
import {ProfileCluster} from "./profile-cluster"
import {useCurrentUser} from "./hooks/current-user"

export default function User() {
    const cu = useCurrentUser()
    return (
      <div>
        <AuthCluster />
        <InitCluster address={cu.addr} />
        {/*<ProfileCluster address={cu.addr} />*/}
      </div>
     
    )
  }