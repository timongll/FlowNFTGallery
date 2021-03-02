import React, { Component}  from "react"
import * as fcl from "@onflow/fcl"
//import * as t from "@onflow/types"
import "./App.css";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import _ from "lodash";
import { styled } from '@material-ui/core/styles';
import zerotwo from './zerotwo-removebg-preview.png'
import {hasCollection} from "./flow/yugioh/scripts/hascollection.js"
import {hasCollection2} from "./flow/pokemon/scripts/hascollection.js"
import {hasCollection3} from "./flow/kittyitems/scripts/hascollection.js"
import {getMetadata} from "./flow/yugioh/scripts/getmetadata.js"
import {getMetadata2} from "./flow/pokemon/scripts/getmetadata.js"
import {setup} from "./flow/kittyitems/transactions/setup"
import {mintNFT} from "./flow/kittyitems/transactions/mintnft.js"
import {setupNFTAccount} from "./flow/yugioh/transactions/setupnftaccount.js"
import {getTypeIDs} from "./flow/kittyitems/scripts/gettypeid.js"
import {getIDs} from "./flow/yugioh/scripts/getids.js"
import {getIDs2} from "./flow/pokemon/scripts/getids.js"
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
import {transferNFT} from "./flow/yugioh/transactions/transfernft.js"
const acc1 = "0x42de7e7e48d17e2a"
const acc2 = "0x1942195e827498b2"
const acc3 = "0xaa7ec3f99c04220b"

const MyButton = styled(Button)({
  backgroundColor:"#f8f8f8",
  borderRadius: "10px",
  borderColor: "white",
  color: "black",
  boxShadow: 'rgba(0, 0, 0, 0.2) 0px 5px 10px',
  margin: "10px",
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    color: '#FFF',
    color: "black",
    borderColor: "black"
  }
})
/*mintCard2(acc1).then(answer => {
  console.log(answer);
})*/
/*transferNFT(acc3, 14).then(answer => {
  console.log(answer);
})*/

getIDs2(acc1).then(answer => {
  console.log(answer);
})




/*var imgs;
await getMetadata(acc1).then(async result => {
  imgs = result;
})
this.setState({imgs: imgs})
console.log(this.state.imgs)*/




//loadPics(imgs);
/*mintCard(acc1).then(answer => {
  console.log(answer);
})*/

/*setupNFTAccount().then(answer => {
  console.log(answer);
})*/

/*createCard().then(answer => {
  console.log(answer);
})*/

/*transferNFT(acc2, 2).then(answer => {
  console.log(answer);
})*/
var CONTRACT = `// This is an example implementation of a Flow Non-Fungible Token
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
    pub resource interface NFTCollectionPublic {
        pub fun deposit(token: @NonFungibleToken.NFT)
        pub fun batchDeposit(tokens: @NonFungibleToken.Collection)
        pub fun getIDs(): [UInt64]
        pub fun borrowNFT(id: UInt64): &NonFungibleToken.NFT
        pub fun borrowCardMetadatas(): [String]
        pub fun borrowCardIDs(): [UInt64]
        pub fun borrowCardKeys(): [&Yugioh.NFT]
    }
    pub resource Collection: NonFungibleToken.Provider, NonFungibleToken.Receiver, NonFungibleToken.CollectionPublic, NFTCollectionPublic {
        // dictionary of NFT conforming tokens
  
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
		pub fun mintNFT(recipient: &{Yugioh.NFTCollectionPublic}, cardID: UInt64) {

			// create a new NFT
			var newNFT <- create NFT(initID: Yugioh.totalSupply, cardID: cardID)

			// deposit it in the recipient's account using their reference
			recipient.deposit(token: <-newNFT)

            Yugioh.totalSupply = Yugioh.totalSupply + 1 as UInt64
		}

        pub fun batchMintNFT(recipient: &{Yugioh.NFTCollectionPublic}, quantity: UInt64, cardID: UInt64) {

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
        self.account.save<@Collection>(<- create Collection(), to: /storage/NFTCollection)
        // Create a public capability for the Collection

        self.account.link<&{NFTCollectionPublic}>(
            /public/NFTCollection, 
            target: /storage/NFTCollection
        )

        // Create a Minter resource and save it to storage
        let minter <- create NFTMinter()
        self.account.save(<-minter, to: /storage/NFTMinter)

        emit ContractInitialized()
	}
}
`

//mintCard("0x42de7e7e48d17e2a")
//var CODE_AS_HEX_STRING = Buffer.from(CONTRACT, "utf8").toString("hex")
var imgs
var imgs2
var imgs3temp
var imgs3 = []
var collectionArray = []
var brandArray = []
var supportedNFT = ["Yugioh", "Pokemon", "Kitty-Items"]
  /*async function doit() {
    const txId = await fcl.send([
      fcl.transaction`
        transaction(codeAsHexString: String) {
          prepare(contractOwner: AuthAccount) {
            contractOwner.contracts.add(name: "Yugioh", code: codeAsHexString.decodeHex())
          }
        }
      `,
      fcl.args([
        fcl.arg(CODE_AS_HEX_STRING, t.String),
      ]),
      fcl.proposer(fcl.authz),
      fcl.payer(fcl.authz),
      fcl.authorizations([
        fcl.authz,
      ])
    ]).then(fcl.decode)

    console.log(fcl.tx(txId).onceSealed())
  }*/

//createCard();

class App extends Component {
  constructor(props){
    super(props);

   this.state={
     hello: "",
     imgs: [],
     imgs2: [],
     imgs3: [],
     user: null,
     collectionArray: [],
     address: "",
     searched: false,
     show1: null,
     hidethis: true,
     buttonClicked: false,

   }
  }

  componentDidMount = async () => {
    try {
      //fcl.currentUser().subscribe(user => this.setState({ user }))
      

    }catch (error) {
      console.error(error);
    }
  }

  async getAllBrands(address){
    try{
    let hasYugiohCollection = await hasCollection(address).then(answer =>{
      return answer});
    if(hasYugiohCollection) {
      collectionArray.push("Yugioh")
    }
    let hasPokemonCollection = await hasCollection2(address).then(answer =>{
      return answer});

    if(hasPokemonCollection){
      collectionArray.push("Pokemon");
    }
    let hasKittyCollection = await hasCollection3(address).then(answer =>{
      return answer});
    if(hasKittyCollection){
      collectionArray.push("Kitty-Items");
    }
    this.setState({collectionArray: collectionArray})
    await getMetadata(acc1)
  }catch(error){
    console.log(error)
  }
  }

  async getAllCollections(address){
    try{
    await this.getMetadataYugioh(address)
    await this.getMetadataPokemon(address)
    await this.getMetadataKitty(address)
    
    await getMetadata(acc1)
    this.setState({searched: true});
  }catch(error){
    console.log(error)
  }
}

  async getMetadataYugioh(address){
      await getMetadata(address).then(async result => {
        imgs = result;
      })
      this.setState({imgs: imgs})
  }

  async getMetadataPokemon(address){
      await getMetadata2(address).then(async result => {
        imgs2 = result;
      })
      this.setState({imgs2: imgs2})

  }

  async getMetadataKitty(address){
      await getTypeIDs(address).then(answer => {
        imgs3temp = answer;
      })
      await getMetadata(acc1)
      var i
      for (i = 0; i < imgs3temp.length; i++) {
        if(i === 1){
          imgs3.push("https://ipfs.io/ipfs/QmWuwsLTewiC18Cvm1EQZrAx7HXmfwUueocU3iHzkJe9TL?filename=hat.jpg")
        } else {
          imgs3.push("https://ipfs.io/ipfs/QmTZwsFegaHCmahgfDB8mGgM1TdXNEVMmkEWRnft6Yjngi?filename=glasses.jpg")
        }
      }
      this.setState({imgs3: imgs3})
    

  }

  renderImage(imageUrl, width, height) {
    return (
      <div>
        <img src={imageUrl} width = {width} height = {height}/>
      </div>
    );
  }

  renderButton(){
    return (
    <table className = "table2">
        <tbody>
          <tr>
            <td className = "td2">
          {this.state.collectionArray.map((name, i) => {
            return (
              <MyButton key = {i}
              variant = "outlined" 
              color = "primary" 
              onClick={() => this.handleChangeShowThis(name)}>
              {name}
            </MyButton>
            );
        })
        }
        </td>
          </tr>
        </tbody>
      
    </table>
    )
  }

  renderYugioh(){
    return (
      <table className = "table" >
        <tbody>
          {_.chunk(this.state.imgs, 3).map((chunk, i) => (
                  <tr key = {i}>{chunk.map((img, i) => 
                  (<td key = {i}><div>{this.renderImage(img, "150", "215")}</div> </td>)
                   )}</tr>
               ))}
        </tbody>
      </table>
      )
  }
  
  renderPokemon(){
    return (
        <table className = "table">
          <tbody>
            {
               _.chunk(this.state.imgs2, 3).map((chunk, i) => (
                    <tr key = {i}>{chunk.map((img, i) => 
                    (<td key = {i}>{this.renderImage(img, "150", "150")}</td>)
                     )}</tr>
                 ))
            }
          </tbody>
        </table>
        )
  }

  renderKitty(){
    return (
    <table className = "table" >
      <tbody>
        <tr>
        {this.state.imgs3.map((imageUrl, i) => {
            return (
                <td key = {i}>{this.renderImage(imageUrl, "170", "80")}</td>
            );
        })
        }
        </tr>
      </tbody>
    </table>
    )
  }
  
  renderCollection(){
    return (
      <div>
        {(this.state.show1 === "Yugioh")
      ?  <div>
        {this.state && this.state.collectionArray && 
        this.state.collectionArray.includes("Yugioh") && this.renderYugioh()}
        </div>
      : null
      }
        {(this.state.show1 === "Pokemon")
      ?  <div>
        {this.state && this.state.collectionArray && 
        this.state.collectionArray.includes("Pokemon") && this.renderPokemon()}
        </div>
      : null
      }
              {(this.state.show1 === "Kitty-Items")
      ?  <div>
        {this.state && this.state.collectionArray && 
        this.state.collectionArray.includes("Kitty-Items") && this.renderKitty()}
        </div>
      : null
      }
      </div>
    )
  }

  handleChangeAddress = async (event) => {
    this.setState({address: event.target.value})
  }

  handleShowNFT = async (event) => {
    collectionArray = []
    imgs = [];
    imgs2 = [];
    imgs3 = [];
    this.setState({collectionArray: []});
    this.getAllCollections();
  }

  handleChangeShowThis = async (name) => {
    this.setState({show1: name})
  }

  handleShowBrands = async (event) => {
    collectionArray = [];
    imgs = [];
    imgs2 = [];
    imgs3 = [];
    this.setState({collectionArray: []});
    this.setState({imgs: []});
    this.setState({imgs2: []});
    this.setState({imgs3: []});
    this.setState({searched: true});
    
    await this.getAllBrands(this.state.address);
    await this.getAllCollections(this.state.address);


  }

  render(){
   return (
    <div className = "App">
      <h1><img src = {zerotwo} width= "80px" height = "50px"></img>Flow NFT Gallery</h1>
      <div>Search address to see its FLOW NFT collection</div>
      <br></br>
      <br></br>
      <Button 
          style= {{
            height: "40px",
            borderRadius: "10px",
            backgroundColor: "black",
            color: "white",
            fontSize: "16px",
            boxShadow: 'rgba(0, 0, 0, 0.2) 0px 5px 10px',
          }}
          variant = "outlined" 
          color = "primary" 
          >
          Supported NFTs
        </Button>
      <br></br>
      <br></br>
      {supportedNFT.map((name, i) => {
        return (
          <MyButton key = {i} variant = "outlined" color = "primary" >
            {name}
          </MyButton>
        );
      })
        }
      <br></br>
      <br></br>
      
        <div>
        <Input 
          style={{ 
            borderRadius: 100,
            height: 30, 
          }} 
          
          type="text" onChange={this.handleChangeAddress}/>    
        &nbsp;
        <MyButton 
          variant = "outlined" 
          color = "primary" 
          onClick={this.handleShowBrands}>
          Search
        </MyButton>

        </div>
        <div>
      {(this.state.searched)
      ?       <div>
        <br></br>
        <div> 
        <Button 
          style= {{
            height: "40px",
            borderRadius: "10px",
            backgroundColor: "black",
            color: "white",
            fontSize: "16px",
            boxShadow: 'rgba(0, 0, 0, 0.2) 0px 5px 10px',
          }}
          variant = "outlined" 
          color = "primary" 
          >
          Collection
        </Button>
          {this.renderButton()}</div>
      <strong>{this.renderCollection()}</strong>

    </div>
      : null


      }
    </div>
    <CopyToClipboard text={acc1} onCopy={this.onCopy}>
            <MyButton variant="outlined" color="primary" onClick={this.handleClick}>test account 1</MyButton>
          </CopyToClipboard>
          <CopyToClipboard text={acc2} onCopy={this.onCopy}>
            <MyButton variant="outlined" color="primary" onClick={this.handleClick}>test account 2</MyButton>
          </CopyToClipboard>
    </div>
    )
  }
} export default App;

