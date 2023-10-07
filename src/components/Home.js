import React, { useState } from "react";
import { useWallet } from "@tronweb3/tronwallet-adapter-react-hooks";
// import abi from "../artifacts/DonateFunds.json";
import "../components/home.css";
const contractAddress = "TCg2meXEvMYubdBVnNmkqMZAS4gyDNJStJ";

function Home() {
  const { connected, address } = useWallet();
  const { tronWeb } = window;
  const [isPlaying, setIsPlaying] = useState(false);
  const toggleVideo = () => {
    setIsPlaying(!isPlaying);
  };
  const code1 = `npm i explorex`;
  const code2 = ` import { Widget } from "explorex";
  
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
  `;
  const code3 = `import { useWallet } from "@tronweb3/tronwallet-adapter-react-hooks";
import contractAbi from "./artifacts/Swap.json"; // Your contract abi

const contractAddress = "Your contract address";
  
  function Swap() {
    const { connected, address } = useWallet();
    const { tronWeb } = window;
    const swap= async () => {
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
      // other code
      <div className="App">
        <button onClick={() => swap()}>Swap tokens</button>
      </div>
    );
  }
  
  export default Swap;
  `;

  const donate = async () => {
    const abi = [
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_value",
            type: "uint256",
          },
        ],
        stateMutability: "nonpayable",
        type: "constructor",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        name: "Donated",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "user",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "amount",
            type: "uint256",
          },
        ],
        name: "DonationWithdraw",
        type: "event",
      },
      {
        inputs: [
          {
            internalType: "uint256",
            name: "_value",
            type: "uint256",
          },
        ],
        name: "changeMinimumDonation",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "newOwner",
            type: "address",
          },
        ],
        name: "changeOwner",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "donateFunds",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        name: "donatedFund",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "getContractBalance",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "minimumDonation",
        outputs: [
          {
            internalType: "uint256",
            name: "",
            type: "uint256",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "owner",
        outputs: [
          {
            internalType: "address",
            name: "",
            type: "address",
          },
        ],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          {
            internalType: "address",
            name: "_address",
            type: "address",
          },
          {
            internalType: "uint256",
            name: "_value",
            type: "uint256",
          },
        ],
        name: "withdrawDonation",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        stateMutability: "payable",
        type: "receive",
      },
    ];

    const contract = await tronWeb.contract(abi, contractAddress);
    let tx = await contract.donateFunds().send({
      callValue: "100000",
    });
    console.log(tx);
  };

  return (
    <div className="main-bg">
      <nav>
        <div className="nav-main">
          <img
            src="https://bafybeidewda6po5lmp2moos3vldlysavrtas6yjicav76fhkrhpxr7hk6e.ipfs.w3s.link/exploreX.png"
            style={{ width: "50%" }}
            className="m-logo"
          />
        </div>
        <div>
          <span
            style={{ padding: "20px", fontSize: "15px", letterSpacing: "1px" }}
            className="m-pkglink"
          >
            Package link :{" "}
            <a href="https://www.npmjs.com/package/explorex" target="_blank">
              www.npmjs.com/package/explorex
            </a>
          </span>
        </div>
      </nav>
      <div style={{ marginTop: "50px" }} className="m-home-main">
        <section className="s1">
          <div className="css-typing">
            <div className="title-heading">
              ExploreX seamlessly embeds vital explorer functions
            </div>

            <div className="title-heading ">
              directly into the user's DApp or browser
            </div>
          </div>
          <div
            style={{ margin: "20px auto", width: "50%" }}
            className="donate-btt-main"
          >
            <button
              className="search-button donate-btn"
              title="currently we are accepting donation on shashta network only"
              onClick={() => donate()}
            >
              Donate
            </button>
          </div>
        </section>
        <section className="s2">
          <div style={{ width: "90%", margin: "0 auto" }}>
            <video
              autoPlay
              loop
              muted
              className="p-middle-video"
              style={{ width: "60%", borderRadius: "5px" }}
              poster="home.png"
            >
              <source
                src="https://bafybeibfyyzr7lghgccdounpbqk3hgp2e776t2dima4avxtoqluo6f4yvm.ipfs.w3s.link/Untitled%20design.mp4"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          </div>
        </section>
        <section className="s3">
          <h1
            style={{ padding: "20px", fontSize: "2.3rem" }}
            className="step-heading"
          >
            Steps for using the Explorex widget
          </h1>
          <div>
            <h5 className="title1">Step1: Install the package.</h5>
            <div style={{ width: "100%", margin: "20px 0px" }}>
              <div className="code1-main">
                <code>
                  <pre>{code1}</pre>
                </code>
              </div>
            </div>
          </div>
          <div>
            <h5 className="title1">Step2: Import the Widget in App.js file.</h5>
            <div style={{ width: "100%", margin: "20px 0px" }}>
              <div className="code1-main">
                <code className="code-sub-div">
                  <pre>{code2}</pre>
                </code>
              </div>
            </div>
          </div>
          <div>
            <h5 className="title1">
              Step3: Call GetHash() function for every transaction you sent on
              the blockchain.{" "}
            </h5>
            <div style={{ width: "100%", margin: "20px 0px" }}>
              <div className="code1-main">
                <code>
                  <pre>{code3}</pre>
                </code>
              </div>
            </div>
          </div>
        </section>
        <div
          style={{
            padding: "15px 0px",
            boxShadow: "0 2px 20px #465b63c7",
            fontSize: "15px",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "5px",
          }}
          className="m-footer-main"
        >
          Powered by{" "}
          <img
            src="https://bafybeidewda6po5lmp2moos3vldlysavrtas6yjicav76fhkrhpxr7hk6e.ipfs.w3s.link/exploreX.png"
            style={{ width: "100px" }}
            className="footer-logo"
          />
        </div>
      </div>
    </div>
  );
}

export default Home;
