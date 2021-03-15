import React from "react";
import styled from "styled-components";
// import { Map, Package } from "react-feather";

const CategoriesWrapper = styled.div`
  margin: 0px auto 20px auto;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  //background-color: #f0f0f0;
  border-radius: 15px;
  width: max-content;
  padding: 10px;
`;

const CategoryWrapper = styled.div`
  border-radius: 12px;
  align-items: center;
  padding: 12px 20px;
  width: max-content;
  display: flex;
  justify-content: center;
  gap: 5px;
  color: white;
  background-color: #333;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 5px 10px;

  transition: all 200ms ease;
`;

const CategoryTitle = styled.p`
  margin: 0;
  font-size: 1.2rem;
`;

const CategoriesMenu = () => {
  return (
    <CategoriesWrapper>
      <CategoryWrapper>
        {/* <Map strokeWidth={2} /> */}
        <CategoryTitle>Collections</CategoryTitle>
      </CategoryWrapper>
    </CategoriesWrapper>
  );
};

export default CategoriesMenu;