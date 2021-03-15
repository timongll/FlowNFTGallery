import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

export async function hasKittyCollection(address: string) {
  return fcl
    .send([
      fcl.script`
      import NonFungibleToken from 0x631e88ae7f1d7c20
      import KittyItems2 from 0x42de7e7e48d17e2a

        

        pub fun main(address: Address): Bool {
            let account = getAccount(address)

            if(account.getCapability(KittyItems2.CollectionPublicPath).borrow<&{NonFungibleToken.CollectionPublic}>()
                == nil){
                return false
                }else {
                return true
                }
        }
      `,
      fcl.args([fcl.arg(address, t.Address)]),
    ])
    
    .then(fcl.decode)
}