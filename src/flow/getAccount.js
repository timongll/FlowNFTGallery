import * as sdk from "@onflow/sdk";

export async function getAccount(account){
    try {
      await sdk.send(
        await sdk.build([sdk.getAccount(account)])
      );
      return true;
    } catch {
      return false;
    }
  };