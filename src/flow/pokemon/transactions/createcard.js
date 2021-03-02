import * as fcl from "@onflow/fcl"


export async function createCard2() {
    const txId = await fcl
      .send([
        // Transactions use fcl.transaction instead of fcl.script
        // Their syntax is a little different too
        fcl.transaction`
        import NonFungibleToken from 0x631e88ae7f1d7c20
        import Pokemon from 0x42de7e7e48d17e2a

        // This script uses the NFTMinter resource to mint a new NFT
        // It must be run with the account that has the minter resource
        // stored in /storage/NFTMinter

        transaction() {

            // local variable for storing the minter reference
            let minter: &Pokemon.NFTMinter
        
            prepare(signer: AuthAccount) {
        
                // borrow a reference to the NFTMinter resource in storage
                self.minter = signer.borrow<&Pokemon.NFTMinter>(from: /storage/PokemonMinter)
                    ?? panic("Could not borrow a reference to the NFT minter")
            }
        
            execute {
                // Borrow the recipient's public NFT collection reference
        
                self.minter.createCard(name: "pikachu", metadata: "https://ipfs.io/ipfs/QmUjXPthNs8mXfGRZ48kRJsYp1dBV7o6ZwZPpVDpUoFrZj?filename=pikachu.jpg")
                self.minter.createCard(name: "squirtle", metadata: "https://ipfs.io/ipfs/QmTgm9qdQifeahutADMQHtd47q6Nbx2bwk5B5TZvCL8tLf?filename=squirtle.jpg")
                self.minter.createCard(name: "mewtwo", metadata: "https://ipfs.io/ipfs/QmcWWrVQf8dH2beZCwMMezMs1rnpsN4LaJUsdDGATsk3Jx?filename=mewtwo.jpg")
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