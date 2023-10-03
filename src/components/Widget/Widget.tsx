import React, { useState } from "react";
import "./Widget.css";
import HashWidget from "../Hash/HashWidget";
import AddressWidget from "../Address/AddressWidget";
import CurrentAddressDetails from "../CurrentAddress/CurrentAddressDetails";
import { WidgetProvider, useWidget } from "../Context/WidgetContext";

interface WidgetProps {
  address: string;
}

const Widget: React.FC<WidgetProps> = ({ address }) => {
  // Use the useWidget hook to access context values
  const { showWidget, openWidget, closeWidget } = useWidget();

  // Set the initial state to true (open)
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [showDefaultWidgets, setShowDefaultWidgets] = useState<boolean>(true);
  const [inputValue, setInputValue] = useState<string>("");
  const [selectedChain, setSelectedChain] = useState<string>("");
  const [selectedChainURL, setSelectedChainURL] = useState<string>("");

  const handleClose = () => {
    const widgetContainer = document.getElementById("search-widget");
    widgetContainer.classList.remove("open");
    widgetContainer.classList.add("closed");
    setSelectedOption("");
    setInputValue("");
    setShowDefaultWidgets(true);
    closeWidget(); // Set isOpen to false when the close button is clicked
  };

  const chainURLs: { [key: string]: string } = {
    chain1: "https://api.trongrid.io",
    chain2: "https://api.shasta.trongrid.io",
    chain3: "https://nile.trongrid.io",
  };

  // const handleSearchButtonClick = () => {
  //   const select = document.querySelector("select");
  //   if (select) {
  //     const selectedValue = select.value;
  //     setSelectedOption(selectedValue);
  //     setShowDefaultWidgets(false);
  //     const selectedURL = chainURLs[selectedChain];
  //     setSelectedChainURL(selectedURL); // Set the selected chain URL in state
  //     // Now you can use selectedChainURL for API requests based on the selected chain
  //     console.log("Selected URL:", selectedChainURL);
  //   }

  //   const input = document.querySelector("#inputText") as HTMLInputElement;
  //   const selectedValue = input.value;
  //   setInputValue(selectedValue);
  // };
  const handleSearchButtonClick = () => {
    const selectOption = document.querySelector(
      "#select-option"
    ) as HTMLSelectElement;
    const selectChain = document.querySelector(
      "#select-chain"
    ) as HTMLSelectElement;

    const selectedOption = selectOption.value;
    const selectedChain = selectChain.value;

    if (selectedOption && selectedChain) {
      // Both options are selected, proceed with the search
      setSelectedOption(selectedOption);
      setShowDefaultWidgets(false);
      const selectedURL = chainURLs[selectedChain];
      setSelectedChainURL(selectedURL);
      console.log("Selected URL:", selectedChainURL);

      const input = document.querySelector("#inputText") as HTMLInputElement;
      const selectedValue = input.value;
      setInputValue(selectedValue);
    } else {
      // Display an alert message if one or both options are not selected
      alert("Please select both options from the drop-down.");
    }
  };

  return (
    <>
      <button className="search-btn" onClick={openWidget}>
        <img
          src="https://bafybeifg6gbg7xs6vtoa6rbklqf7mqbp72ed4vdwueg667kszf4hwx7dfe.ipfs.w3s.link/ExploreX%20logo%20(2).png"
          style={{ width: "100px" }}
        />
      </button>
      <div
        className={`search-widget ${showWidget ? "open" : "closed"}`}
        id="search-widget"
      >
        <div className="w-sec1-flex">
          <div style={{ width: "30%" }}>
            <img
              src="https://bafybeidewda6po5lmp2moos3vldlysavrtas6yjicav76fhkrhpxr7hk6e.ipfs.w3s.link/exploreX.png"
              style={{ width: "100%" }}
            />
          </div>
          <button className="close-button" onClick={handleClose}>
            ✖
          </button>
        </div>
        <div>
          <div className="w-sec2-flex">
            <input
              type="text"
              id="inputText"
              placeholder=" Enter Address / Txn Hash "
              className="search-input"
              // value={inputValue}
              // onChange={(e) => setInputValue(e.target.value)}
            />
            <select id="select-option" required>
              <option value="option1">Select...</option>
              <option value="option2">Address</option>
              <option value="option3">Hashvalue</option>
            </select>

            <select id="select-chain" required>
              <option value="">Select...</option>
              <option value="chain1">Mainnet</option>
              <option value="chain2">Shasta</option>
              <option value="chain3">Nile</option>
            </select>
          </div>
          <div style={{ display: "flex", justifyContent: "space-evenly" }}>
            <button className="search-button" onClick={handleSearchButtonClick}>
              Search
            </button>
            <button
              className="search-button donate-btn"
              title="currently we are accepting donation on shashta network only"
            >
              Donate
            </button>
          </div>
        </div>

        {showDefaultWidgets && <CurrentAddressDetails address={address} />}

        {selectedOption === "option2" && !showDefaultWidgets && (
          <AddressWidget inputValue={inputValue} />
        )}
        {selectedOption === "option3" && !showDefaultWidgets && (
          <HashWidget inputValue={inputValue} />
        )}
        <div
          style={{
            padding: "10px 0px",
            backgroundColor: "#20293a",
            fontSize: "12px",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: "5px",
          }}
        >
          Powered by{" "}
          <img
            src="https://bafybeidewda6po5lmp2moos3vldlysavrtas6yjicav76fhkrhpxr7hk6e.ipfs.w3s.link/exploreX.png"
            style={{ width: "70px" }}
          />
        </div>
      </div>
    </>
  );
};

const WidgetWithProvider: React.FC<WidgetProps> = ({ address }) => {
  return (
    <WidgetProvider>
      <Widget address={address} />
    </WidgetProvider>
  );
};

export default WidgetWithProvider;
