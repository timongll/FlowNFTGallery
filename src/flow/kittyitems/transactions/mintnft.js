import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"


export async function mintNFT(recipient, typeID) {
    const txId = await fcl
      .send([
        // Transactions use fcl.transaction instead of fcl.script
        // Their syntax is a little different too
        fcl.transaction`
        import NonFungibleToken from 0x631e88ae7f1d7c20
        import KittyItems2 from 0x42de7e7e48d17e2a
        
        
        transaction(recipient: Address, typeID: UInt64) {

            let minter: &KittyItems2.NFTMinter
        
            prepare(signer: AuthAccount) {
        
                // borrow a reference to the NFTMinter resource in storage
                self.minter = signer.borrow<&KittyItems2.NFTMinter>(from: KittyItems2.MinterStoragePath)
                    ?? panic("Could not borrow a reference to the NFT minter")
            }
        
            execute {
                // get the public account object for the recipient
                let recipient = getAccount(recipient)
        
                // borrow the recipient's public NFT collection reference
                let receiver = recipient
                    .getCapability(KittyItems2.CollectionPublicPath)
                    .borrow<&{NonFungibleToken.CollectionPublic}>()
                    ?? panic("Could not get receiver reference to the NFT Collection")
        
                // mint the NFT and deposit it to the recipient's collection
                self.minter.mintNFT(recipient: receiver, typeID: typeID)
            }
        }
        `,
        fcl.args([fcl.arg(recipient, t.Address)]),
        fcl.args([fcl.arg(typeID, t.UInt64)]),
        fcl.payer(fcl.authz), // current user is responsible for paying for the transaction
        fcl.proposer(fcl.authz), // current user acting as the nonce
        fcl.authorizations([fcl.authz]), // current user will be first AuthAccount
        fcl.limit(200), // set the compute limit
      ])
      .then(fcl.decode)
  
    return fcl.tx(txId).onceSealed()
  }