import React, { useEffect, useState } from "react";
import "./HashWidget.css";

interface AddressWidgetProps {
  inputValue: string; // Define the prop here
  selectedChain: string;
}
interface HashDetailsProps {
  hash: string;
}
function truncateAddress(address: string): string {
  if (address.length <= 3) {
    return address;
  }
  const start = address.slice(0, 3);
  const end = address.slice(-3);
  return `${start}...${end}`;
}
function truncateAdd(address: string): string {
  if (address.length <= 10) {
    return address;
  }
  const start = address.slice(0, 10);
  const end = address.slice(-10);
  return `${start}...${end}`;
}
const isTransactionHashValid = (txHash: string): boolean => {
  // Check if the transaction hash has the correct length
  if (txHash.length !== 64) {
    return false;
  }
  // Check if the transaction hash consists of hexadecimal characters
  const isHex = /^[0-9a-fA-F]+$/.test(txHash);
  return isHex;
};
const HashWidget: React.FC<AddressWidgetProps> = (props) => {
  console.log(props);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copySuccessMap, setCopySuccessMap] = useState<{
    [key: string]: boolean;
  }>({});
  const [transactionData, setTransactionData] = useState<any>();
  const [transactionInfo, setTransactionInfo] = useState<any>();
  const [loading, setLoading] = useState<any>(true);

  const getTransactionData = async () => {
    console.log(props.inputValue);
    try {
      setLoading(true);
      // call the api to get the transaction data
      const apiUrl = props.selectedChain;
      const response = await fetch(`${apiUrl}/wallet/gettransactionbyid`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          value: props.inputValue,
          visible: true,
        }),
      });
      const resData = await response.json();
      if (Object.keys(resData).length === 0) {
        // Handle empty data here and set the error message
        console.log("no data");
        setErrorMessage("No data available");

        return;
      } else {
        console.log(resData);
        setTransactionData(resData);
      }

      const txResponse = await fetch(
        "https://api.trongrid.io/wallet/gettransactioninfobyid",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            value: props.inputValue,
          }),
        }
      );

      const txResData = await txResponse.json();
      if (Object.keys(txResData).length === 0) {
        // Handle empty data here and set the error message
        console.log("no data");
        setErrorMessage("No data available");

        return;
      } else {
        console.log(txResData);
        setTransactionData(txResData);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
    }
  };

  const handleCopyClick = (address: string) => {
    const textArea = document.createElement("textarea");
    textArea.value = address;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      const copySuccess = document.execCommand("copy");
      if (copySuccess) {
        setCopySuccessMap((prevState) => ({
          ...prevState,
          [address]: true,
        }));
        setTimeout(() => {
          setCopySuccessMap((prevState) => ({
            ...prevState,
            [address]: false,
          }));
        }, 1500); // Reset the "Copied!" message after 1.5 seconds
      } else {
        setCopySuccessMap((prevState) => ({
          ...prevState,
          [address]: false,
        }));
      }
    } catch (error) {
      console.error("Copy failed:", error);
      setCopySuccessMap((prevState) => ({
        ...prevState,
        [address]: false,
      }));
    } finally {
      document.body.removeChild(textArea);
    }
  };
  useEffect(() => {
    getTransactionData();
  }, [props.inputValue, props.selectedChain]);

  if (transactionData && transactionInfo) {
    return (
      <div className="hash-value-widget">
        <div className="title">Hash Details</div>
        <div className="hash-details-main">
          <div className="info-item">
            <div className="info-lable ">Tx Hash:</div>
            <div className="info-response-data add-color">
              {" "}
              {truncateAdd(props.inputValue)}
              {copySuccessMap[props.inputValue] ? (
                <img src="https://bafybeiaw4tjekiob3atick7xyrsdvx4qap2ohxzisbokzktkwufdvnreoq.ipfs.w3s.link/mark.png"></img>
              ) : (
                <img
                  src="https://bafybeihox6phvkten27p5afegb7erbl3knwdcguc6fvgliwxof433354pu.ipfs.w3s.link/copy%20(1).png"
                  style={{ width: "12px" }}
                  onClick={() => handleCopyClick(props.inputValue)}
                ></img>
              )}
            </div>
          </div>
          <div className="info-item">
            <div className="info-lable">Result:</div>
            <div className="info-response-data result-color">
              {transactionData.ret[0].contractRet
                ? transactionData.ret[0].contractRet
                : "NA"}
            </div>
          </div>
          <div className="info-item">
            <div className="info-lable">Block:</div>
            <div className="info-response-data">
              {transactionInfo.blockNumber ? transactionInfo.blockNumber : "NA"}
            </div>
          </div>
          <div className="info-item">
            <div className="info-lable">Time:</div>
            <div className="info-response-data">
              {transactionData.raw_data.timestamp
                ? new Date(transactionData.raw_data.timestamp).toLocaleString()
                : "NA"}
            </div>
          </div>
          <div className="info-item">
            <div className="info-lable">Fee (TRX):</div>
            <div className="info-response-data">
              {transactionInfo.fee
                ? (transactionInfo.fee / 1_000_000).toFixed(6) + " TRX"
                : "NA"}
            </div>
          </div>
          <div className="info-item">
            <div className="info-lable">Value (TRX):</div>
            <div className="info-response-data">
              {transactionData.raw_data.contract[0].parameter.value.amount
                ? (
                    transactionData.raw_data.contract[0].parameter.value
                      .amount / 1_000_000
                  ).toFixed(6) + " TRX"
                : (
                    transactionData.raw_data.contract[0].parameter.value
                      .call_value / 1_000_000
                  ).toFixed(6) + " TRX"}
            </div>
          </div>
          <div className="info-item">
            <div className="info-lable">Owner address:</div>
            <div className="info-response-data">
              {transactionData.raw_data.contract[0].parameter.value
                .owner_address
                ? truncateAdd(
                    transactionData.raw_data.contract[0].parameter.value
                      .owner_address
                  )
                : "NA"}
              {copySuccessMap[
                transactionData.raw_data.contract[0].parameter.value
                  .owner_address
              ] ? (
                <img
                  src="https://bafybeigk6xicsfexybksnorw7wsdz23claloq5uweophepc2conxuq3reu.ipfs.w3s.link/mark-white.png"
                  style={{ width: "12px" }}
                ></img>
              ) : (
                <img
                  src="https://bafybeidj7pnybhjnbalxjvrkj6xeywq4brzmv727hosfmgqizqa5dpfoza.ipfs.w3s.link/copy-white%20(1).png"
                  style={{ width: "12px" }}
                  onClick={() =>
                    handleCopyClick(
                      transactionData.raw_data.contract[0].parameter.value
                        .owner_address
                    )
                  }
                ></img>
              )}
            </div>
          </div>
          <div className="info-item">
            <div className="info-lable">
              {transactionData.raw_data.contract[0].parameter.value.to_address
                ? "To address:"
                : "contract address"}
            </div>
            <div className="info-response-data">
              {transactionData.raw_data.contract[0].parameter.value.to_address
                ? truncateAdd(
                    transactionData.raw_data.contract[0].parameter.value
                      .to_address
                  )
                : truncateAdd(
                    transactionData.raw_data.contract[0].parameter.value
                      .to_address
                  )}
              {copySuccessMap[
                transactionData.raw_data.contract[0].parameter.value.to_address
              ] ? (
                <img
                  src="https://bafybeigk6xicsfexybksnorw7wsdz23claloq5uweophepc2conxuq3reu.ipfs.w3s.link/mark-white.png"
                  style={{ width: "12px" }}
                ></img>
              ) : (
                <img
                  src="https://bafybeidj7pnybhjnbalxjvrkj6xeywq4brzmv727hosfmgqizqa5dpfoza.ipfs.w3s.link/copy-white%20(1).png"
                  style={{ width: "12px" }}
                  onClick={() =>
                    handleCopyClick(
                      transactionData.raw_data.contract[0].parameter.value
                        .to_address
                    )
                  }
                ></img>
              )}
            </div>
          </div>
          <div className="info-item">
            <div className="info-lable">Transaction action:</div>
            <div className="info-response-data">
              {transactionData.raw_data.contract[0].type
                ? transactionData.raw_data.contract[0].type
                : "NA"}
            </div>
          </div>
        </div>
      </div>
    );
  } else if (!isTransactionHashValid(props.inputValue)) {
    return (
      <div className="invalid-address">Invalid transaction hash provided.</div>
    );
  } else if (errorMessage) {
    // Display the error message
    return <div className="error-message">{errorMessage}</div>;
  } else {
    return (
      <div className="loader-container">
        <svg
          width="40"
          height="40"
          viewBox="0 0 135 135"
          xmlns="http://www.w3.org/2000/svg"
          fill="#ffb46a"
        >
          <path d="M67.447 58c5.523 0 10-4.477 10-10s-4.477-10-10-10-10 4.477-10 10 4.477 10 10 10zm9.448 9.447c0 5.523 4.477 10 10 10 5.522 0 10-4.477 10-10s-4.478-10-10-10c-5.523 0-10 4.477-10 10zm-9.448 9.448c-5.523 0-10 4.477-10 10 0 5.522 4.477 10 10 10s10-4.478 10-10c0-5.523-4.477-10-10-10zM58 67.447c0-5.523-4.477-10-10-10s-10 4.477-10 10 4.477 10 10 10 10-4.477 10-10z">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 67 67"
              to="-360 67 67"
              dur="1s"
              repeatCount="indefinite"
            />
          </path>
          <path d="M28.19 40.31c6.627 0 12-5.374 12-12 0-6.628-5.373-12-12-12-6.628 0-12 5.372-12 12 0 6.626 5.372 12 12 12zm30.72-19.825c4.686 4.687 12.284 4.687 16.97 0 4.686-4.686 4.686-12.284 0-16.97-4.686-4.687-12.284-4.687-16.97 0-4.687 4.686-4.687 12.284 0 16.97zm35.74 7.705c0 6.627 5.37 12 12 12 6.626 0 12-5.373 12-12 0-6.628-5.374-12-12-12-6.63 0-12 5.372-12 12zm19.822 30.72c-4.686 4.686-4.686 12.284 0 16.97 4.687 4.686 12.285 4.686 16.97 0 4.687-4.686 4.687-12.284 0-16.97-4.685-4.687-12.283-4.687-16.97 0zm-7.704 35.74c-6.627 0-12 5.37-12 12 0 6.626 5.373 12 12 12s12-5.374 12-12c0-6.63-5.373-12-12-12zm-30.72 19.822c-4.686-4.686-12.284-4.686-16.97 0-4.686 4.687-4.686 12.285 0 16.97 4.686 4.687 12.284 4.687 16.97 0 4.687-4.685 4.687-12.283 0-16.97zm-35.74-7.704c0-6.627-5.372-12-12-12-6.626 0-12 5.373-12 12s5.374 12 12 12c6.628 0 12-5.373 12-12zm-19.823-30.72c4.687-4.686 4.687-12.284 0-16.97-4.686-4.686-12.284-4.686-16.97 0-4.687 4.686-4.687 12.284 0 16.97 4.686 4.687 12.284 4.687 16.97 0z">
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 67 67"
              to="360 67 67"
              dur="8s"
              repeatCount="indefinite"
            />
          </path>
        </svg>
      </div>
    );
  }
};
export default HashWidget;
