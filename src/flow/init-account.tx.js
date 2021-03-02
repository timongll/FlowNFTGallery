// File: ./src/flow/init-account.tx.js

import * as fcl from "@onflow/fcl"

export async function initAccount() {
  const txId = await fcl
    .send([
      // Transactions use fcl.transaction instead of fcl.script
      // Their syntax is a little different too
      fcl.transaction`
        import Profile from 0xProfile

        transaction {
          // We want the accounts address for later so we can verify if the account was initialized properly
          let address: Address

          prepare(account: AuthAccount) {
            // save the address for the post check
            self.address = account.address

            // Only want to initialize the account if it hasnt already been initialized
            if (!Profile.check(self.address)) {
              // This creates and stores the Profile in the users account
              account.save(<- Profile.new(), to: Profile.privatePath)

              // This creates the public capability that lets applications read the profiles info
              account.link<&Profile.Base{Profile.Public}>(Profile.publicPath, target: Profile.privatePath)
            }
          }

          // verify the account has been initialized
          post {
            Profile.check(self.address): "Account was not initialized"
          }
        }
      `,
      fcl.payer(fcl.authz), // current user is responsible for paying for the transaction
      fcl.proposer(fcl.authz), // current user acting as the nonce
      fcl.authorizations([fcl.authz]), // current user will be first AuthAccount
      fcl.limit(35), // set the compute limit
    ])
    .then(fcl.decode)

  return fcl.tx(txId).onceSealed()
}