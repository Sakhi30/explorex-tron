import React from "react";
import Widget from "../Widget/Widget"; // Make sure to provide the correct path

export const GetHash = (hashValue: string, selectedChainValue: string) => {
  const widgetContainer = document.getElementById("search-widget");
  console.log(hashValue);

  const inputElement = document.getElementById("inputText");

  if (inputElement && inputElement instanceof HTMLInputElement) {
    inputElement.value = hashValue;
  }

  const selectElement = document.getElementById("select-option");
  if (selectElement && selectElement instanceof HTMLSelectElement) {
    selectElement.value = "option3"; // Change this line to set the value to "option3"
  }
  const selectChainElement = document.getElementById("select-chain");

  if (selectChainElement && selectChainElement instanceof HTMLSelectElement) {
    console.log("out");
    // Set the value of selectChainElement to the provided selectedChainValue
    selectChainElement.value = selectedChainValue;
  }

  const button = document.getElementById("search");

  if (button) {
    console.log("in");

    button.addEventListener("click", (event) => {
      event.preventDefault();
    });
    button.click();
  }

  if (widgetContainer) {
    widgetContainer.classList.remove("closed");
    widgetContainer.classList.add("open");
  }
};
