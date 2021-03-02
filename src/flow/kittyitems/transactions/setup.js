import * as fcl from "@onflow/fcl"


export async function setup() {
  const txId = await fcl
  .send([
    // Transactions use fcl.transaction instead of fcl.script
    // Their syntax is a little different too
    fcl.transaction`
    import NonFungibleToken from 0x631e88ae7f1d7c20
    import KittyItems2 from 0x42de7e7e48d17e2a

    // This transaction configures an account to hold Kitty Items.

    transaction {
        prepare(signer: AuthAccount) {
            // if the account doesn't already have a collection
            if signer.borrow<&KittyItems2.Collection>(from: KittyItems2.CollectionStoragePath) == nil {

                // create a new empty collection
                let collection <- KittyItems2.createEmptyCollection()
                
                // save it to the account
                signer.save(<-collection, to: KittyItems2.CollectionStoragePath)

                // create a public capability for the collection
                signer.link<&KittyItems2.Collection{NonFungibleToken.CollectionPublic, KittyItems2.KittyItems2CollectionPublic}>(KittyItems2.CollectionPublicPath, target: KittyItems2.CollectionStoragePath)
            }
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