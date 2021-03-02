import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

export async function getMetadata3(account) {
  return fcl
    .send([
      fcl.script`
      import NonFungibleToken from 0x631e88ae7f1d7c20
      import Pokemon from 0x42de7e7e48d17e2a
      
      // This transaction returns an array of all the nft ids in the collection
      
      pub fun main(account: Address): [String] {
          let collectionRef = getAccount(account)
              .getCapability(/public/PokemonCollection)
              .borrow<&{Pokemon.PokemonCollectionPublic}>()
              ?? panic("Could not borrow capability from public collection")
      
      
          return collectionRef.borrowCardMetadatas()
      }
      `,
      fcl.args([fcl.arg(account, t.Address)]),
    ])
    
    .then(fcl.decode)
}
