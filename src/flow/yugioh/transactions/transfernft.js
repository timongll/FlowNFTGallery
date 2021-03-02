import * as fcl from "@onflow/fcl"
import * as t from "@onflow/types"


export async function transferNFT(recipient, withdrawID) {
    const txId = await fcl
      .send([
        // Transactions use fcl.transaction instead of fcl.script
        // Their syntax is a little different too
        fcl.transaction`
        import NonFungibleToken from 0x631e88ae7f1d7c20
        import Yugioh from 0x42de7e7e48d17e2a
        
        
        // Parameters:
        //
        // recipient: The Flow address of the account to receive the moment.
        // withdrawID: The id of the moment to be transferred
        
        transaction(recipient: Address, withdrawID: UInt64) {
        
            // local variable for storing the transferred token
            let transferToken: @NonFungibleToken.NFT
            
            prepare(acct: AuthAccount) {
        
                // borrow a reference to the owner's collection
                let collectionRef = acct.borrow<&Yugioh.Collection>(from: /storage/YugiohCollection)
                    ?? panic("Could not borrow a reference to the stored Moment collection")
                
                // withdraw the NFT
                self.transferToken <- collectionRef.withdraw(withdrawID: withdrawID)
            }
        
            execute {
                // get the recipient's public account object
                let recipient = getAccount(recipient)
        
                // get the Collection reference for the receiver
                let receiverRef = recipient.getCapability(/public/YugiohCollection).borrow<&{Yugioh.YugiohCollectionPublic}>()!
        
                // deposit the NFT in the receivers collection
                receiverRef.deposit(token: <-self.transferToken)
            }
        }
        `,
        fcl.args([fcl.arg(recipient, t.Address)]),
        fcl.args([fcl.arg(withdrawID, t.UInt64)]),
        fcl.payer(fcl.authz), // current user is responsible for paying for the transaction
        fcl.proposer(fcl.authz), // current user acting as the nonce
        fcl.authorizations([fcl.authz]), // current user will be first AuthAccount
        fcl.limit(100), // set the compute limit
      ])
      .then(fcl.decode)
  
    return fcl.tx(txId).onceSealed()
  }