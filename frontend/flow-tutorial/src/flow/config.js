const fcl = require("@onflow/fcl");

fcl.config({
  "app.detail.title": "Flow Mint Page Tutorial", // this adds a custom name to our wallet
  "app.detail.icon": "https://pbs.twimg.com/profile_images/1521569689494646784/mPyrajYy_400x400.jpg",
  "accessNode.api": "https://rest-testnet.onflow.org", // this is for the local emulator
  "discovery.wallet": "https://fcl-discovery.onflow.org/testnet/authn", // this is for the local dev wallet
})