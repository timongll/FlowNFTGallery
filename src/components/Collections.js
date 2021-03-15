import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import Trail from "./Trail";
import NFTCard from "./NFTCard";
import Spinner from "./Spinner/Spinner";
import ContractPill from "./ContractPill";
import { getYugiohImages } from "../flow/yugioh/scripts/getyugiohimages.js";
import { getPokemonImages } from "../flow/pokemon/scripts/getpokemonimages.js";
import { getKittyIDs } from "../flow/kittyitems/scripts/getkittyids";
import { getVersusImages } from "../flow/versus/scripts/getversusimages.js";

const ContractPillWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 20px;
  justify-content: center;
`;

const NFTsWrapper = styled.div`
  margin: auto;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 20px;
  align-items: flex-start;
  justify-content: center;
`;

const NoCollectionsMessage = styled.div``;

const Collections = ({
  NFTs,
  selectedContract,
  handleContractClick,
}) => {
  const { walletParam } = useParams();
  const [imageArray, setImageArray] = useState([]);
  const [loadingNFT, setLoadingNFT] = useState(true);
  const [width, setWidth] = useState("250px");
  const [height, setHeight] = useState("250px");

  useEffect(() => {
    setLoadingNFT(true);
    setWidth("250px");
    setHeight("250px");
    var array = []
    const getImageURLs = async () => {
      switch(selectedContract) {
        case "Yugioh":
          array = await getYugiohImages(walletParam)
          setWidth("180px")
          break;
        case "Pokemon":
          array = await getPokemonImages(walletParam)
          break;
        case "Kitty-Items":
          var typeIDs = await getKittyIDs(walletParam);
          var i
          for (i = 0; i < typeIDs.length; i++) {
            if(i === 1){
              array.push("https://ipfs.io/ipfs/QmWuwsLTewiC18Cvm1EQZrAx7HXmfwUueocU3iHzkJe9TL?filename=hat.jpg")
            } else {
              array.push("https://ipfs.io/ipfs/QmTZwsFegaHCmahgfDB8mGgM1TdXNEVMmkEWRnft6Yjngi?filename=glasses.jpg")
            }
          }
          setHeight("120px")
          break;  
        case "Versus":
          array = await getVersusImages(walletParam)
          break;
        default:
      }
      setImageArray(array);
      setLoadingNFT(false);
    }
    getImageURLs();
  },[selectedContract, walletParam]);

  return (
    <>
      <ContractPillWrapper>
        <Trail>
          {NFTs.length > 0 ? (
            NFTs.map((str) => (
              <ContractPill
                key = {str}
                contractKey={str}
                isSelected={selectedContract === str}
                handleContractClick={handleContractClick}
              />
            ))
          ) : (
            <NoCollectionsMessage>No collections yet.</NoCollectionsMessage>
          )}
        </Trail>
      </ContractPillWrapper>
      <div
        id="contractTitleScroll"
        style={{ margin: 10, height: 10, width: "100%" }}
      />
        {(selectedContract) ? (
        <>
          {!loadingNFT ? (
            <Trail key={selectedContract}>
              <NFTsWrapper>
                {imageArray.map((nft, index) => (
                  <NFTCard
                    nft={nft}
                    key={index}
                    width = {width}
                    height = {height}
                  />
                ))}
              </NFTsWrapper>
            </Trail>
          ) : (
            <Trail>
              <Spinner/>
            </Trail>
          )}
        </>
      ): null}
    </>
  );
};

export default Collections;
