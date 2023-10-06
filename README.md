# ExploreX

![npm version](https://img.shields.io/npm/v/ascai-trx.svg?style=flat-square)

## Overview

ExploreX is a TypeScript library designed to elevate the user experience of decentralized applications (DApps). This innovative library empowers users to seamlessly navigate within the same page while conveniently accessing and reviewing their wallet details and transaction history. By seamlessly integrating a compact widget into your DApp, ExploreX brings explorer functionality to your website, providing users with a streamlined and immersive experience.

## Installation

**You can install explorex using npm or yarn:**

    npm  install  explorex

    ## OR

    yarn  add  explorex

## Usage

**To use explorex in your project, follow these steps:**

**Import the explorex Widget component into your main file(app.js):**

  import  {Widget}  from  "explorex";

  import { Widget } from "explorex";
  
  function App() {
    // Your code
    return (
      <div className="App">
        <Widget address="Connected wallet address" />
      </div>
      // Your code
    );
  }
  
  export default App;

**Call GetHash() function for every transaction you sent on the blockchain.**

  import { useWallet } from "@tronweb3/tronwallet-adapter-react-hooks"; <br>
  import contractAbi from "./artifacts/Swap.json"; // Your contract abi <br>

  const contractAddress = "Your contract address"; <br>
  
  function Swap() {<br>
    const { connected, address } = useWallet();<br>
    const { tronWeb } = window;<br>
    const swap= async () => {<br>
      const contract = await tronWeb.contract(contractAbi, contractAddress);<br>
      let tx = await contract.swap().send({<br>
        callValue: "100000",<br>
      });<br>
      GetHash(<br>
          tx,<br>
          "Enter connected chain" // Mainnet, Shasta, Nile<br>
        );<br>
    };<br>
    return (<br>
      // other code<br>
      <div className="App"><br>
        <button onClick={() => swap()}>Swap tokens</button><br>
      </div><br>
    );<br>
  }<br>
  
  export default Swap;<br>
