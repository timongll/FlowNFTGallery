import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

export async function getTypeIDs(address) {
  return fcl
    .send([
      fcl.script`
      import NonFungibleToken from 0x631e88ae7f1d7c20
      import KittyItems2 from 0x42de7e7e48d17e2a
      
      // This script returns the metadata for an NFT in an account's collection.
      
      pub fun main(address: Address): [UInt64] {
      
          // get the public account object for the token owner
          let owner = getAccount(address)
      
          let collectionBorrow = owner.getCapability(KittyItems2.CollectionPublicPath)
              .borrow<&{KittyItems2.KittyItems2CollectionPublic}>()
              ?? panic("Could not borrow KittyItems2CollectionPublic")
      
      
          let collectionRef = owner.getCapability(KittyItems2.CollectionPublicPath).borrow<&{NonFungibleToken.CollectionPublic}>()
              ?? panic("Could not borrow capability from public collection")
          
          let collectionRef2 = collectionRef.getIDs()
          let values: [UInt64] = []
          for key in collectionRef2 {
              let kittyItem = collectionBorrow.borrowKittyItem(id: key)
              ?? panic("No such itemID in that collection")
      
              values.append(kittyItem.typeID)
          }
          
          return values
      
      }
      `,
      fcl.args([fcl.arg(address, t.Address)]),
    ])
    
    .then(fcl.decode)
}