import * as fcl from "@onflow/fcl"


export async function createCard() {
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

        transaction() {

            // local variable for storing the minter reference
            let minter: &Yugioh.NFTMinter
        
            prepare(signer: AuthAccount) {
        
                // borrow a reference to the NFTMinter resource in storage
                self.minter = signer.borrow<&Yugioh.NFTMinter>(from: /storage/YugiohMinter)
                    ?? panic("Could not borrow a reference to the NFT minter")
            }
        
            execute {
                // Borrow the recipient's public NFT collection reference
        
               // self.minter.createCard(name: "the trojan horse", metadata: "https://ipfs.io/ipfs/Qmeit6LABtHSJZum62L3DQtQoT97KGG7asyzcnJ1YCjRKw?filename=horse.jpg")
                }
                }`,
        fcl.payer(fcl.authz), // current user is responsible for paying for the transaction
        fcl.proposer(fcl.authz), // current user acting as the nonce
        fcl.authorizations([fcl.authz]), // current user will be first AuthAccount
        fcl.limit(35), // set the compute limit
      ])
      .then(fcl.decode)
  
    return fcl.tx(txId).onceSealed()
  }