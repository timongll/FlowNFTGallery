import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"


export async function mintCard(recipient) {
    const txId = await fcl
      .send([
        // Transactions use fcl.transaction instead of fcl.script
        // Their syntax is a little different too
        fcl.transaction`
        import NonFungibleToken from 0x631e88ae7f1d7c20
        import Yugioh from 0x42de7e7e48d17e2a
        
        // This script uses the NFTMinter resource to mint a new NFT
        // It must be run with the account that has the minter resource
        // stored in /storage/NFTMinter
        
        transaction(recipient: Address) {
        
            // local variable for storing the minter reference
            let minter: &Yugioh.NFTMinter
        
            prepare(signer: AuthAccount) {
        
                // borrow a reference to the NFTMinter resource in storage
                self.minter = signer.borrow<&Yugioh.NFTMinter>(from: /storage/YugiohMinter)
                    ?? panic("Could not borrow a reference to the NFT minter")
            }
        
            execute {
                // Borrow the recipient's public NFT collection reference
                let receiver = getAccount(recipient)
                    .getCapability(/public/YugiohCollection)
                    .borrow<&{Yugioh.YugiohCollectionPublic}>()
                    ?? panic("Could not get receiver reference to the NFT Collection")
                
                // Mint the NFT and deposit it to the recipient's collection
                self.minter.mintNFT(recipient: receiver, cardID: 6)
            }
        }
        `,
        fcl.args([fcl.arg(recipient, t.Address)]),
        fcl.payer(fcl.authz), // current user is responsible for paying for the transaction
        fcl.proposer(fcl.authz), // current user acting as the nonce
        fcl.authorizations([fcl.authz]), // current user will be first AuthAccount
        fcl.limit(200), // set the compute limit
      ])
      .then(fcl.decode)
  
    return fcl.tx(txId).onceSealed()
  }