import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import styled from "styled-components";
import SearchBar from "./components/SearchBar";
import Trail from "./components/Trail";
import Flow from "./assets/flow.png";
import Wallet from "./components/Wallet";
import {hasYugiohCollection} from "./flow/yugioh/scripts/hasyugiohcollection"
async function hi() {
  await hasYugiohCollection("0x42de7e7e48d17e2a").then(hi => {
    console.log(hi);
  })
}
hi();
const AppWrapper = styled.div`
  padding: 40px 30px 60px 30px;
  max-width: 850px;
  margin: auto;
  text-align: center;
  min-height: 100vh;
`;

export default function App() {
  return (
    <Router>
      <AppWrapper>
        <Trail>
          <div
            style={{
              margin: "auto",
              textAlign: "center",
              width: "max-content",
              padding: "15px",
            }}
          >
            <Link to="/">
              <img style={{ width: 100, }} alt="aas" src={Flow} />
            </Link>
          </div>
        </Trail>

        <Switch>
          <Route path="/:walletParam">
            <Wallet />
          </Route>
          <Route path="/">
            <SearchBar />
          </Route>
        </Switch>
      </AppWrapper>
    </Router>
  );
}