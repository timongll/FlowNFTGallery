import {hasYugiohCollection} from "./yugioh/scripts/hasyugiohcollection.js"
import {hasPokemonCollection} from "./pokemon/scripts/haspokemoncollection.js"
import {hasKittyCollection} from "./kittyitems/scripts/haskittycollection.js"
import {hasVersusCollection} from "./versus/scripts/hasversuscollection.js"
export async function getNFTs(address){
    var collectionArray = []

    let hasYugiohCollectionTemp = await hasYugiohCollection(address).then(answer =>{
      return answer});
    if(hasYugiohCollectionTemp) {
      collectionArray.push("Yugioh")
    }

    let hasPokemonCollectionTemp = await hasPokemonCollection(address).then(answer =>{
      return answer});

    if(hasPokemonCollectionTemp){
      collectionArray.push("Pokemon");
    }

    let hasKittyCollectionTemp = await hasKittyCollection(address).then(answer =>{
      return answer});

    if(hasKittyCollectionTemp){
      collectionArray.push("Kitty-Items");
    }
    
    let hasVersusCollectionTemp = await hasVersusCollection(address).then(answer =>{
      return answer});
    if(hasVersusCollectionTemp){
      collectionArray.push("Versus");
    }
    
    return collectionArray
}