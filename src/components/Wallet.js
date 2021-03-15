import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import Trail from "./Trail";
import {getAccount} from "../flow/getAccount";
import Spinner from "./Spinner/Spinner";
import Collections from "./Collections";
import {getNFTs} from "../flow/getNFTs";
import CategoriesMenu from "./CategoriesMenu";

const WalletWrapper = styled.div``;

const Wallet = () => {

  const { walletParam } = useParams();
  const [isAccount, setIsAccount] = useState();
  const [loadingWalletHeader, setLoadingWalletHeader] = useState(true);
  const [NFTs, setNFTs] = useState();
  const [selectedContract, setSelectedContract] = useState();

  useEffect(() => {
    const getWeb3 = async () => {
      try {
      const isAccountParam = await getAccount(walletParam);
      setIsAccount(isAccountParam);
      setLoadingWalletHeader(false);
      var collections = await getNFTs(walletParam);
      setNFTs(collections)
      }catch (error){
        console.log(error);
      }
    }; 
      getWeb3();
    },[isAccount, walletParam]);

  const handleContractClick = (contractName) => {
    setSelectedContract(contractName);
  };

  if (!loadingWalletHeader && !isAccount) {
    return (
      <Trail>
        <p>Address not found</p>
        <Link to="/">
          <p style={{ fontWeight: 700 }}>Try again?</p>
        </Link>
      </Trail>
    );
  }
  return (
      <WalletWrapper>

        {loadingWalletHeader  ? (
          <div>
            <Trail>
              <Spinner />
            </Trail>
          </div>
        ) : (
          <Trail>
              {!NFTs ? (
                  <Trail>
                    <Spinner />
                  </Trail>
                ) : (
                  <div>
                  <CategoriesMenu/>
                  <Collections
                    NFTs={NFTs}
                    selectedContract={selectedContract}
                    handleContractClick={handleContractClick}
                  />
                </div>)}
        </Trail>
        )}
    </WalletWrapper>
  );
};

export default Wallet;
