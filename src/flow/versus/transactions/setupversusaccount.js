import * as fcl from "@onflow/fcl"


export async function setupVersusAccount() {
    const txId = await fcl
      .send([
        // Transactions use fcl.transaction instead of fcl.script
        // Their syntax is a little different too
        fcl.transaction`
        import NonFungibleToken from 0x631e88ae7f1d7c20
        import Art from 0x1ff7e32d71183db0
        
        // This transaction is what an account would run
        // to set itself up to receive NFTs

        transaction {

            prepare(acct: AuthAccount) {

                // Return early if the account already has a collection
                if acct.borrow<&Art.Collection>(from: /storage/VersusArtCollection) != nil {
                    return
                }

                    // create a new Art Collection
                    let collection <- Art.createEmptyCollection() as! @Art.Collection

                    // Put the new Collection in storage
                    acct.save(<-collection, to: /storage/VersusArtCollection)

                    // create a public capability for the collection
                    acct.link<&{Art.CollectionPublic}>(/public/VersusArtCollection, target: /storage/VersusArtCollection)
                
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