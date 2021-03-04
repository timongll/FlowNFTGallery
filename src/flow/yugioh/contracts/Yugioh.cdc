// This is an example implementation of a Flow Non-Fungible Token
// It is not part of the official standard but it assumed to be
// very similar to how many NFTs would implement the core functionality.

import NonFungibleToken from 0x631e88ae7f1d7c20

pub contract Yugioh: NonFungibleToken {

    pub var totalSupply: UInt64

    pub var nextCardID: UInt64

    pub var cardDatas: {UInt64: Card}
    pub event ContractInitialized()
    pub event Withdraw(id: UInt64, from: Address?)
    pub event Deposit(id: UInt64, to: Address?)

    pub struct Card {

        // The unique ID for the Play
        pub let cardID: UInt64

        // Stores all the metadata about the play as a string mapping
        // This is not the long term way NFT metadata will be stored. It's a temporary
        // construct while we figure out a better way to do metadata.
        //
        pub let name: String
        pub let metadata: String

        init(name: String, metadata: String) {

            self.cardID = Yugioh.nextCardID
            self.metadata = metadata
            self.name = name

            // Increment the ID so that it isn't used again
            Yugioh.nextCardID = Yugioh.nextCardID + 1 as UInt64
        }
    }

    pub resource NFT: NonFungibleToken.INFT {
        pub let id: UInt64

        pub let cardID: UInt64

        init(initID: UInt64, cardID: UInt64) {
            self.id = initID
            self.cardID = cardID
        }
    }


    // This is the interface that users can cast their Moment Collection as
    // to allow others to deposit Moments into their Collection. It also allows for reading
    // the IDs of Moments in the Collection.
    pub resource interface YugiohCollectionPublic {
        pub fun deposit(token: @NonFungibleToken.NFT)
        pub fun batchDeposit(tokens: @NonFungibleToken.Collection)
        pub fun getIDs(): [UInt64]
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT
        pub fun borrowCardMetadatas(): [String]
        pub fun borrowCardIDs(): [UInt64]
        pub fun borrowCardKeys(): [&Yugioh.NFT]
    }
    pub resource Collection: NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic, YugiohCollectionPublic {
        // dictionary of NFT conforming tokens
        // NFT is a resource type with an `UInt64` ID field
        pub var ownedNFTs: @{UInt64: NonFungibleToken.NFT}

        init () {
            self.ownedNFTs <- {}
        }

        // withdraw removes an NFT from the collection and moves it to the caller
        pub fun withdraw(withdrawID: UInt64): @NonFungibleToken.NFT {
            let token <- self.ownedNFTs.remove(key: withdrawID) ?? panic("missing NFT")

            emit Withdraw(id: token.id, from: self.owner?.address)

            return <-token
        }
        // batchWithdraw withdraws multiple tokens and returns them as a Collection
        //
        // Parameters: ids: An array of IDs to withdraw
        //
        // Returns: @NonFungibleToken.Collection: A collection that contains
        //                                        the withdrawn moments
        //

        pub fun batchWithdraw(ids: [UInt64]): @NonFungibleToken.Collection {
            // Create a new empty Collection
            var batchCollection <- create Collection()
            
            // Iterate through the ids and withdraw them from the Collection
            for id in ids {
                batchCollection.deposit(token: <-self.withdraw(withdrawID: id))
            }
            
            // Return the withdrawn tokens
            return <-batchCollection
        }

        // deposit takes a NFT and adds it to the collections dictionary
        // and adds the ID to the id array
        pub fun deposit(token: @NonFungibleToken.NFT) {
            let token <- token as! @Yugioh.NFT

            let id: UInt64 = token.id

            // add the new token to the dictionary which removes the old one
            let oldToken <- self.ownedNFTs[id] <- token

            emit Deposit(id: id, to: self.owner?.address)

            destroy oldToken
        }

        // batchDeposit takes a Collection object as an argument
        // and deposits each contained NFT into this Collection
        pub fun batchDeposit(tokens: @NonFungibleToken.Collection) {

            // Get an array of the IDs to be deposited
            let keys = tokens.getIDs()

            // Iterate through the keys in the collection and deposit each one
            for key in keys {
                self.deposit(token: <-tokens.withdraw(withdrawID: key))
            }

            // Destroy the empty Collection
            destroy tokens
        }

        // getIDs returns an array of the IDs that are in the collection
        pub fun getIDs(): [UInt64] {
            return self.ownedNFTs.keys
        }

        // borrowNFT gets a reference to an NFT in the collection
        // so that the caller can read its metadata and call its methods
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT {
            return &self.ownedNFTs[id] as &NonFungibleToken.NFT
        }

        pub fun borrowCardMetadatas(): [String] {
            let values: [String] = []
            for key in self.ownedNFTs.keys {
                let ref = &self.ownedNFTs[key] as auth &NonFungibleToken.NFT
                let ref2 = ref as! &Yugioh.NFT
                let ref3 = ref2.cardID
                values.append(Yugioh.getCardMetaData(cardID: ref3)!)
            }
            
            return values
        }

        pub fun borrowCardKeys(): [&Yugioh.NFT] {
            let values: [&Yugioh.NFT] = []
            for key in self.ownedNFTs.keys {
                let ref = &self.ownedNFTs[key] as auth &NonFungibleToken.NFT
                let ref2 = ref as! &Yugioh.NFT
                values.append(ref2)
            }
            
            return values
        }

        pub fun borrowCardIDs(): [UInt64] {
            let values: [UInt64] = []
            for key in self.ownedNFTs.keys {
                let ref = &self.ownedNFTs[key] as auth &NonFungibleToken.NFT
                let ref2 = ref as! &Yugioh.NFT
                let ref3 = ref2.cardID
                values.append(ref3)
            }
            
            return values
        }
        destroy() {
            destroy self.ownedNFTs
        }
    }

    pub fun getCardMetaData(cardID: UInt64): String? {
        return self.cardDatas[cardID]?.metadata
    }

    // public function that anyone can call to create a new empty collection
    pub fun createEmptyCollection(): @NonFungibleToken.Collection {
        return <- create Yugioh.Collection()
    }

    // Resource that an admin or something similar would own to be
    // able to mint new NFTs
    //
	pub resource NFTMinter {

        pub fun createCard(name: String, metadata: String): UInt64 {
            // Create the new Play
            var newCard = Card(name: name, metadata: metadata)
            let newID = newCard.cardID

            // Store it in the contract storage
            Yugioh.cardDatas[newID] = newCard

            return newID
        }
		// mintNFT mints a new NFT with a new ID
		// and deposit it in the recipients collection using their collection reference
		pub fun mintNFT(recipient: &{Yugioh.YugiohCollectionPublic}, cardID: UInt64) {

			// create a new NFT
			var newNFT <- create NFT(initID: Yugioh.totalSupply, cardID: cardID)

			// deposit it in the recipient's account using their reference
			recipient.deposit(token: <-newNFT)

            Yugioh.totalSupply = Yugioh.totalSupply + 1 as UInt64
		}

        pub fun batchMintNFT(recipient: &{Yugioh.YugiohCollectionPublic}, quantity: UInt64, cardID: UInt64) {

            var i: UInt64 = 0
            while i < quantity {
            self.mintNFT(recipient: recipient, cardID: cardID)
            i = i + 1 as UInt64
            }
        }
	}

	init() {
        // Initialize the total supply
        self.totalSupply = 0 as UInt64

        self.nextCardID = 0 as UInt64

        self.cardDatas = {}

        // Put a new Collection in storage
        self.account.save<@Collection>(<- create Collection(), to: /storage/YugiohCollection)
        // Create a public capability for the Collection

        self.account.link<&{YugiohCollectionPublic}>(
            /public/YugiohCollection, 
            target: /storage/YugiohCollection
        )

        // Create a Minter resource and save it to storage
        let minter <- create NFTMinter()
        self.account.save(<-minter, to: /storage/YugiohMinter)

        emit ContractInitialized()
	}
}




