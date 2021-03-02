// File: ./src/flow/fetch-profile.script.js

import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

export async function fetchProfile(address) {
  if (address == null) return null

  return await fcl
    .send([
      fcl.script`
        import Profile from 0xProfile

        pub fun main(address: Address): Profile.ReadOnly? {
          return Profile.read(address)
        }
      `,
      fcl.args([fcl.arg(address, t.Address)]),
    ])
    .then(fcl.decode)
}