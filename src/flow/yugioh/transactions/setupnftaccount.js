import * as fcl from "@onflow/fcl"


export async function setupNFTAccount() {
    const txId = await fcl
      .send([
        // Transactions use fcl.transaction instead of fcl.script
        // Their syntax is a little different too
        fcl.transaction`
        import NonFungibleToken from 0x631e88ae7f1d7c20
        import Yugioh from 0x42de7e7e48d17e2a
        
        // This transaction is what an account would run
        // to set itself up to receive NFTs

        transaction {

            prepare(acct: AuthAccount) {

                // Return early if the account already has a collection
                if acct.borrow<&Yugioh.Collection>(from: /storage/YugiohCollection) != nil {
                    return
                }

                    // create a new TopShot Collection
                    let collection <- Yugioh.createEmptyCollection() as! @Yugioh.Collection

                    // Put the new Collection in storage
                    acct.save(<-collection, to: /storage/YugiohCollection)

                    // create a public capability for the collection
                    acct.link<&{Yugioh.YugiohCollectionPublic}>(/public/YugiohCollection, target: /storage/YugiohCollection)
                
            }
        }
        `,
        fcl.payer(fcl.authz), // current user is responsible for paying for the transaction
        fcl.proposer(fcl.authz), // current user acting as the nonce
        fcl.authorizations([fcl.authz]), // current user will be first AuthAccount
        fcl.limit(100), // set the compute limit
      ])
      .then(fcl.decode)
  
    return fcl.tx(txId).onceSealed()
  }