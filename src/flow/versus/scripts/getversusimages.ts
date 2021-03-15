import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"

export async function getVersusImages(address: string) {
  return fcl
    .send([
      fcl.script`
      import NonFungibleToken from 0x631e88ae7f1d7c20
      import Art from 0x1ff7e32d71183db0
      
      // This transaction returns an array of all the nft ids in the collection
      
      pub fun main(address: Address): [String?] {

        let account = getAccount(address)
        let images: [String?] = [];
        if let art= account.getCapability(/public/VersusArtCollection).borrow<&{Art.CollectionPublic}>() {
        for id in art.getIDs() {
              let content = Art.getContentForArt(address: address, artId: id);
              images.append(content);
            }
        }
        return images;
      }
      `,
      fcl.args([fcl.arg(address, t.Address)]),
    ])
    
    .then(fcl.decode)
}
