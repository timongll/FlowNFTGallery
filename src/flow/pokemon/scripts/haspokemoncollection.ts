import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

export async function hasPokemonCollection(account: string) {
  return fcl
    .send([
      fcl.script`
      import NonFungibleToken from 0x631e88ae7f1d7c20
      import Pokemon from 0x42de7e7e48d17e2a

      pub fun main(account: Address): Bool{
          if(getAccount(account)
              .getCapability(/public/PokemonCollection)
              .borrow<&{Pokemon.PokemonCollectionPublic}>()
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
