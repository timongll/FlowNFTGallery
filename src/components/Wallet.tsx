import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import styled from "styled-components";
import Trail from "./Trail";
import {getAccount} from "../flow/getAccount";
import Spinner from "./Spinner/Spinner";
import Collections from "./Collections";
import {getNFTs} from "../flow/getNFTs";
import CategoriesMenu from "./CategoriesMenu";

interface Params {
  walletParam: string;
}

const WalletWrapper = styled.div``;

const Wallet: React.FC = () => {

  const { walletParam } = useParams<Params>();
  const [isAccount, setIsAccount] = useState<boolean>();
  const [loadingWalletHeader, setLoadingWalletHeader] = useState<boolean>(true);
  const [NFTs, setNFTs] = useState<string[]>();
  const [selectedContract, setSelectedContract] = useState<string>();

  useEffect(() => {
    const getAccountAndCollection = async () => {
      try {
      const isAccountParam = await getAccount(walletParam);
      setIsAccount(isAccountParam);
      setLoadingWalletHeader(false);
      var collections = await getNFTs(walletParam);
      setNFTs(collections)
      }catch (error){
      }
    }; 
      getAccountAndCollection();
    },[isAccount, walletParam]);

  const handleContractClick = (contractName: string): void => {
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
