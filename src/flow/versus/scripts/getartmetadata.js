import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

export async function getArtMetadata(account) {
  return fcl
    .send([
      fcl.script`
      import FungibleToken from 0x9a0766d93b6608b7
      import NonFungibleToken from 0x631e88ae7f1d7c20
      import Art from 0x1ff7e32d71183db0
      pub struct ArtData {
        pub let metadata: Art.Metadata
        pub let content: String
        init(metadata: Art.Metadata, content:String) {
          self.metadata= metadata
          self.content=content
        }
      }
      pub struct AddressStatus {
        pub(set) var address:Address
        pub(set) var balance: UFix64
        pub(set) var art: [ArtData]
        init (_ address:Address) {
          self.address=address
          self.balance= 0.0
          self.art= []
        }
      }
      /*
        This script will check an address and print out its FT, NFT and Versus resources
       */
      pub fun main(address:Address) : AddressStatus {
          // get the accounts' public address objects
          let account = getAccount(address)
          let status= AddressStatus(address)
          
          if let vault= account.getCapability(/public/flowTokenBalance).borrow<&{FungibleToken.Balance}>() {
             status.balance=vault.balance
          }
          if let art= account.getCapability(/public/ArtCollection).borrow<&{Art.CollectionPublic}>()  {
             
              for id in art.getIDs() {
                var art=art.borrowArt(id: id) 
                status.art.append(ArtData(
                  metadata: art!.metadata,
                  content: art!.content()!
                  ))
              }
          }
          return status
      }
      `,
      fcl.args([fcl.arg(account, t.Address)]),
    ])
    
    .then(fcl.decode)
}