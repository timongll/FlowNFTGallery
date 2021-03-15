import React from "react";
import styled from "styled-components";

const Card = styled.div`
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  cursor: pointer;
  overflow: hidden;
  justify-content: flex-start;
  align-items: flex-start;
  transition: opacity 200ms ease;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 5px 10px;
`;

const NFTImg = styled.div`
display: flex;
justify-content: center;
align-items: center;
  width: 250px;
  height: 250px;
  background-color: white;

`;

const NFTCard = ({ nft, width, height }) => {
  return (
    <Card >
      <NFTImg>
      <img src={nft} width= {width} height= {height} alt="NFT"/>
        </NFTImg>
    </Card>
  );
};

export default NFTCard;