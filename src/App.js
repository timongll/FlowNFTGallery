import React, { Component}  from "react"
import {AuthCluster} from "./authcluster"
import * as fcl from "@onflow/fcl"
//import * as t from "@onflow/types"
import "./App.css";
import {CopyToClipboard} from 'react-copy-to-clipboard'
import _ from "lodash"
import { styled } from '@material-ui/core/styles'
import zerotwo from './zerotwo-removebg-preview.png'
import {hasCollection} from "./flow/yugioh/scripts/hascollection.js"
import {hasCollection2} from "./flow/pokemon/scripts/hascollection.js"
import {hasCollection3} from "./flow/kittyitems/scripts/hascollection.js"
import {hasCollection4} from "./flow/versus/scripts/hascollection.js"
import {getMetadata} from "./flow/yugioh/scripts/getmetadata.js"
import {getMetadata2} from "./flow/pokemon/scripts/getmetadata.js"
import {getTypeIDs} from "./flow/kittyitems/scripts/gettypeid.js"
import {getArt} from "./flow/versus/scripts/getart.js"
import {getArtMetadata} from "./flow/versus/scripts/getartmetadata.js"
import {setupVersusAccount} from "./flow/versus/transactions/setupversusaccount.js"
import Button from '@material-ui/core/Button';
import Input from '@material-ui/core/Input';
const acc1 = "0x42de7e7e48d17e2a"
const acc2 = "0x1942195e827498b2"
const acc3 = "0xaa7ec3f99c04220b"
const acc4 = "0x6f2dc70deed7b20d"


var imgs
var imgs2
var imgs3temp
var imgs3 = []
var imgs4
var collectionArray = []
var a;
//todo: handle CSS separate folders
const MyButton = styled(Button)({
  backgroundColor:"white",
  borderRadius: "10px",
  borderColor: "white",
  borderWidth: "2px",
  color: "black",
  boxShadow: 'rgba(0, 0, 0, 0.2) 0px 5px 10px',
  margin: "10px",
  '&:hover': {
    backgroundColor: '#f8f8f8',
    borderWidth: "2px",
    borderColor: "#f8f8f8"
  },
  '&:focus': {
    borderColor: "black",
    borderWidth: "2px"
  }
})

class App extends Component {
  constructor(props){
    super(props);

   this.state={
     hello: "",
     imgs: [],
     imgs2: [],
     imgs3: [],
     imgs4: [],
     user: null,
     collectionArray: [],
     address: "",
     searched: false,
     show1: null,
     hidethis: true,
     buttonClicked: false,
     copied: false,
     showSupported: true,
     a: null

   }
  }

  componentDidMount = async () => {
    try {

    }catch (error) {
      console.error(error);
    }
  }

  //todo: SEPARATE TO DIFFERENT FOLDERS
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

    let hasArtCollection = await hasCollection4(address).then(answer =>{
      return answer});
    if(hasArtCollection){
      collectionArray.push("Art");
    }

    this.setState({collectionArray: collectionArray})
  }catch(error){
    console.log(error)
  }
  }

  async getAllCollections(address){
    try{
    await this.getMetadataYugioh(address)
    await this.getMetadataPokemon(address)
    await this.getMetadataKitty(address)
    await this.getMetadataArt(address)
    this.setState({searched: true});
  }catch(error){
    console.log(error);
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

  async getMetadataArt(address){
    await getArt(address).then(async result => {
      imgs4 = result;
    })
    this.setState({imgs4: imgs4})
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
        <table className = "table">
          <tbody>
            {
               _.chunk(this.state.imgs3, 3).map((chunk, i) => (
                    <tr key = {i}>{chunk.map((img, i) => 
                    (<td key = {i}>{this.renderImage(img, "170", "80")}</td>)
                     )}</tr>
                 ))
            }
          </tbody>
        </table>
        )
  }

  renderArt(){
    return (
        <table className = "table">
          <tbody>
            {
               _.chunk(this.state.imgs4, 3).map((chunk, i) => (
                    <tr key = {i}>{chunk.map((img, i) => 
                    (<td key = {i}>{this.renderImage(img, "150", "120")}</td>)
                     )}</tr>
                 ))
            }
          </tbody>
        </table>
        )
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

  renderImage(imageUrl, width, height) {
    return (
      <div>
        <img src={imageUrl} width = {width} height = {height}/>
      </div>
    );
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

        {(this.state.show1 === "Art")
      ?  <div>
        {this.state && this.state.collectionArray && 
        this.state.collectionArray.includes("Art") && this.renderArt()}
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
    imgs4 = [];
    this.setState({collectionArray: []});
    this.getAllCollections();
  }

  handleShowSupported = async (event) => {
    this.setState({showSupported: !this.state.showSupported})
  }

  handleChangeShowThis = async (name) => {
    this.setState({show1: name})
  }

  handleClick = async (name) => {
    this.setState({copied: true})
  }

  handleShowBrands = async (event) => {
    collectionArray = [];
    imgs = [];
    imgs2 = [];
    imgs3 = [];
    imgs4 = [];
    this.setState({collectionArray: []});
    this.setState({imgs: []});
    this.setState({imgs2: []});
    this.setState({imgs3: []});
    this.setState({imgs4: []});
    this.setState({searched: true});
    await this.getAllBrands(this.state.address);
    await this.getAllCollections(this.state.address);
  }


//todo: separate to different folders
  render(){
   return (
    <div className = "App">
      <AuthCluster />
      <div>
        <img className ="img-valign" width = "100px" height = "60px" src= {zerotwo} alt="" />
        <span className ="text2"><strong>Flow NFT Gallery</strong></span>
  
      </div>
      <div>Copy an account's address below and search for its FLOW NFT collection</div>
        <br></br>
        <br></br>
      <div>
        <Input 
          style={{ 
            borderRadius: 100,
            height: 30, 
          }}
          type="text" onChange={this.handleChangeAddress}
        />    
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
      ? <div>
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
      <br></br>
      <br></br>
      {(this.state.copied)
      ? <div style = {{color: "red"}}> Copied</div>
      : null
      }
    </div>
    )
  }
} export default App;

