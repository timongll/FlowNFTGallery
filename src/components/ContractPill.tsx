import React from "react";
import styled from "styled-components";
import { Link } from "react-scroll";

const Pill = styled.div<{ isSelected: boolean }>`
  border: ${(p) => (p.isSelected ? "3px solid #333" : "3px solid transparent")};
  display: flex;
  // font-size: 0.9em;
  // font-weight: 500;
  cursor: pointer;
  width: max-content;
  padding: 5px;
  border-radius: 12px;
  justify-content: flex-start;
  align-items: center;
  text-align: center;
  gap: 6px;
  &:hover {
    background-color: #f0f0f0;
  }
  &:active {
    background-color: #e0e0e0;   
  }333;
  }
  transition: background-color 150ms ease, border 150ms ease;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 5px 10px;
`;

const ContractTitle = styled.p`
  text-align: center;
  margin: 5px 5px 5px 5px;
`;

interface Props {
  contractKey: string;
  isSelected: boolean;
  handleContractClick: (contractKey: string) => void;
}

const ContractPill: React.FC<Props> = ({
  contractKey,
  isSelected,
  handleContractClick,
}) => {
  return (
    <Link
    to="contractTitleScroll"
    // spy={true}
    smooth={true}
    offset={-70}
    duration={500}
  >
      <Pill
      onClick={() => {
        handleContractClick(contractKey);
      }}
        isSelected={isSelected}>
        
        <ContractTitle>{contractKey}</ContractTitle>
      </Pill>
      </Link>
  );
};

export default ContractPill;
