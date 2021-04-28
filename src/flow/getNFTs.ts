import {hasYugiohCollection} from "./yugioh/scripts/hasyugiohcollection"
import {hasPokemonCollection} from "./pokemon/scripts/haspokemoncollection"
import {hasKittyCollection} from "./kittyitems/scripts/haskittycollection"
//import {hasVersusCollection} from "./versus/scripts/hasversuscollection"

export async function getNFTs(address: string){
    var collectionArray: string[] = [] 

    let hasYugiohCollectionTemp = await hasYugiohCollection(address)
    if(hasYugiohCollectionTemp) {
      collectionArray.push("Yugioh")
    }

    let hasPokemonCollectionTemp = await hasPokemonCollection(address)

    if(hasPokemonCollectionTemp){
      collectionArray.push("Pokemon");
    }

    let hasKittyCollectionTemp = await hasKittyCollection(address)

    if(hasKittyCollectionTemp){
      collectionArray.push("Kitty-Items");
    }
    
  // let hasVersusCollectionTemp = await hasVersusCollection(address)
  // if(hasVersusCollectionTemp){
  //  collectionArray.push("Versus");
  // }
    return collectionArray
}