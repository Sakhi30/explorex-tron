# ExploreX

![npm version](https://img.shields.io/npm/v/explorex.svg?style=flat-square)

## Overview

ExploreX is a TypeScript library designed to elevate the user experience of decentralized applications (DApps). This innovative library empowers users to seamlessly navigate within the same page while conveniently accessing and reviewing their wallet details and transaction history. By seamlessly integrating a compact widget into your DApp, ExploreX brings explorer functionality to your website, providing users with a streamlined and immersive experience.

## Installation

You can install ExploreX using npm or yarn:

```bash
npm install explorex

# OR

yarn add explorex
```

## Usage

To use ExploreX in your project, follow these steps:

Import the ExploreX Widget component into your main file (app.js):

```bash

import { Widget } from "explorex";

function App() {
  return (
    <div className="App">
      <Widget address="Connected wallet address" chain="Mainnet or Shasta or Nile" /> /*keep the condition wallet must be connected using ternary operator o/w it will give an error.*/
    </div>
  );
}

export default App;

```

Call GetHash() function for every transaction you send on the blockchain:

```bash

import { useWallet } from "@tronweb3/tronwallet-adapter-react-hooks";
import contractAbi from "./artifacts/Swap.json"; // Your contract ABI

const contractAddress = "Your contract address";

function Swap() {
  const { connected, address } = useWallet();
  const { tronWeb } = window;

  const swap = async () => {
    const contract = await tronWeb.contract(contractAbi, contractAddress);
    let tx = await contract.swap().send({
      callValue: "100000",
    });

    GetHash(
      tx,
      "Enter connected chain" // Mainnet, Shasta, Nile
    );
  };

  return (
    // Other code

    <div className="App">
      <button onClick={() => swap()}>Swap tokens</button>
    </div>
  );
}

export default Swap;

```

Make sure to replace placeholders like "Connected wallet address", "Mainnet or Shasta or Nile", and others with actual values relevant to your project.
