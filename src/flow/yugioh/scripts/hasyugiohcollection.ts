import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

export async function hasYugiohCollection(account: string) {
  return fcl
    .send([
      fcl.script`
      import NonFungibleToken from 0x631e88ae7f1d7c20
      import Yugioh from 0x42de7e7e48d17e2a

      pub fun main(account: Address): Bool{
          if(getAccount(account)
              .getCapability(/public/YugiohCollection)
              .borrow<&{Yugioh.YugiohCollectionPublic}>()
              == nil){
              return false
              }else {
              return true
              }

      }
      `,
      fcl.args([fcl.arg(account, t.Address)]),
    ])

    .then(fcl.decode)
}
