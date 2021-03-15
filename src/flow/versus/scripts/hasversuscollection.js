import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

export async function hasVersusCollection(account) {
  return fcl
    .send([
      fcl.script`
      import NonFungibleToken from 0x631e88ae7f1d7c20
      import Art from 0x1ff7e32d71183db0

      pub fun main(account: Address): Bool{
          if(getAccount(account)
              .getCapability(/public/VersusArtCollection)
              .borrow<&{Art.CollectionPublic}>()
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
