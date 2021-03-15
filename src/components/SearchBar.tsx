import React, { useState } from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import Trail from "./Trail";

// const HeroTitle = styled.h1`
//   font-size: 2rem;
//   font-weight: 500;
// `;

const SearchBarWrapper = styled.div``;

const InnerWrapper = styled.div`
  max-width: 400px;
  margin: auto;
`;

const AddyInput = styled.input`
  padding: 15px;
  font-family: inherit;
  font-size: 1.5rem;
  border: 3px solid transparent;
  border-radius: 10px;
  text-align: center;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 5px 10px;
  &:hover {
    border: 3px solid #eee;
  }
  &:focus {
    border: 3px solid #aaa;
    border-radius: 10px;
  }
  transition: all 200ms ease;
`;

const AddySubmit = styled.button`
  padding: 15px;
  font-family: inherit;
  font-size: 1.5rem;
  color: #fff;
  background-color: #000;
  border-radius: 10px;
  cursor: pointer;
  border: none;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 5px 10px;
  border: 3px solid transparent;
  &:hover {
    opacity: 0.9;
  }
  &:active {
    opacity: 0.7;
  }
  &:focus {
    outline: none;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  transition: all 200ms ease;
`;

const AddyForm = styled.div`
  font-family: inherit;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Footer = styled.div`
  margin: 20px auto;
  color: #bbb;
  font-size: 1.25rem;
`;

const cleanAddress = (addy: string | undefined) => {
  if (!addy) {
    return null;
  }
  return addy;
};

const SearchBar: React.FC = () => {
  let history = useHistory();
  const [addyInput, setAddyInput] = useState<string>("0x42de7e7e48d17e2a");

  const handleSubmit = (event) => {
    event.preventDefault();
    const cleanedAddress = cleanAddress(addyInput);
    if (cleanedAddress) {
      history.push(`/${cleanedAddress}`);
    }
  };
  return (
    <SearchBarWrapper>
      <InnerWrapper>
        <Trail>
          <AddyForm>
            <AddyInput
              type="text"
              value={addyInput}
              onChange={(e) => {
                setAddyInput(e.target.value);
              }}
              placeholder="address"
              name="addy"
            />
            <AddySubmit
              type="submit"
              disabled={!addyInput}
              onClick={handleSubmit}
            >
              Search
            </AddySubmit>
          </AddyForm>
          <Footer>flowgallery ©2021</Footer>
        </Trail>
      </InnerWrapper>
    </SearchBarWrapper>
  );
};

export default SearchBar;