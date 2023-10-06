import React, { useState, useEffect } from "react";
import "./AddressWidget.css";

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
  const end = address.slice(address.length - 3, address.length);
  return `${start}...${end}`;
}
function truncateAdd(address: string): string {
  if (address.length <= 10) {
    return address;
  }
  const start = address.slice(0, 10);
  const end = address.slice(address.length - 10, address.length);
  return `${start}...${end}`;
}
// ...address validation..
function isAddressValid(address: string): boolean {
  // Check if the address has the correct length
  if (address.length !== 34) {
    return false;
  }
  // Check the address prefix
  if (!address.startsWith("T") && !address.startsWith("9")) {
    return false;
  }
  // Convert the address to lowercase
  const addressLowercase = address.toLowerCase();
  // Perform EIP-55 checksum validation
  for (let i = 2; i < addressLowercase.length; i++) {
    const charCode = addressLowercase.charCodeAt(i);
    const isChecksum =
      (charCode >= 97 && charCode <= 102) || (charCode >= 48 && charCode <= 57);
    if (!isChecksum) {
      return false;
    }
  }
  return true;
}
const AddressWidget: React.FC<AddressWidgetProps> = (props) => {
  const isValidAddress = isAddressValid(props.inputValue);
  const [copySuccessMap, setCopySuccessMap] = useState<{
    [key: string]: boolean;
  }>({});
  const [selectedDataSource, setSelectedDataSource] = useState("From");
  const [basicData, setBasicData] = useState<any>();
  const [resourceData, setResourceData] = useState<any>();
  const [transactionsData, setTransactionsData] = useState<any>();
  const [loading, setLoading] = useState<any>(true);
  const handleDataSourceChange = (newDataSource: string) => {
    setSelectedDataSource(newDataSource);
  };
  // const dataSource = selectedDataSource === "From" ? addDataFrom : addDataTo;
  // call the apis to get the account data
  const getCurrentAccountData = async () => {
    try {
      setLoading(true);
      // call the api to get the basic account data
      const apiUrl = props.selectedChain;
      const response = await fetch(`${apiUrl}/wallet/getaccount`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          address: props.inputValue,
          visible: true,
        }),
      });
      const resData = await response.json();
      console.log(resData);
      setBasicData(resData);
      // call the api to get all the transactions of the account
      const txResponse = await fetch(
        `https://api.trongrid.io/v1/accounts/${props.inputValue}/transactions`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const txResponseData = await txResponse.json();
      console.log(txResponseData.data);
      setTransactionsData(txResponseData.data);
      // call the api to get resources
      const resourcesResponse = await fetch(
        "https://api.trongrid.io/wallet/getaccountresource",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            address: props.inputValue,
            visible: true,
          }),
        }
      );
      const resourcesData = await resourcesResponse.json();
      console.log(resourcesData);
      setResourceData(resourcesData);
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
    getCurrentAccountData();
  }, [props.inputValue, props.selectedChain]);
  if (basicData && resourceData && transactionsData) {
    return (
      <div className="hash-value-widget">
        <div className="title">Address Details</div>
        <div className="hash-details-main">
          <div className="info-item">
            <div className="info-lable ">Address:</div>
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
            <div className="info-lable">Balance:</div>
            <div className="info-response-data result-color">
              {basicData.balance ? basicData.balance / 10 ** 6 : 0} TRX
            </div>
          </div>
          <div className="info-item">
            <div className="info-lable">Create_Time:</div>
            <div className="info-response-data">
              {basicData.create_time
                ? new Date(basicData.create_time).toLocaleString()
                : "Not Active"}
            </div>
          </div>
          <div className="info-item">
            <div className="info-lable">Bandwidth:</div>
            <div className="info-response-data">
              Available:{" "}
              {resourceData.NetLimit && resourceData.freeNetUsed
                ? resourceData.freeNetLimit +
                  resourceData.NetLimit -
                  resourceData.freeNetUsed
                : resourceData.NetLimit
                ? resourceData.freeNetLimit + resourceData.NetLimit
                : resourceData.freeNetUsed
                ? resourceData.freeNetLimit - resourceData.freeNetUsed
                : resourceData.freeNetLimit
                ? resourceData.freeNetLimit
                : 0}
              /
              {resourceData.NetLimit
                ? resourceData.freeNetLimit + resourceData.NetLimit
                : resourceData.freeNetLimit
                ? resourceData.freeNetLimit
                : 0}
            </div>
          </div>
          <div className="info-item">
            <div className="info-lable">Energy:</div>
            <div className="info-response-data">
              Available:{" "}
              {resourceData.EnergyLimit ? resourceData.EnergyLimit : 0}/
              {resourceData.EnergyLimit ? resourceData.EnergyLimit : 0}
            </div>
          </div>
          <div className="info-item">
            <div className="info-lable">Votes:</div>
            <div className="info-response-data">
              Voted:{" "}
              {resourceData.tronPowerUsed ? resourceData.tronPowerUsed : "0"}/
              {resourceData.tronPowerLimit ? resourceData.tronPowerLimit : "0"}
            </div>
          </div>
          <div className="info-item2">
            <div className="info-lable">Transactions</div>
            <table className="" id="transaction-table">
              <thead>
                <tr>
                  <th aria-controls="dtHorizontalVerticalExample">Hash</th>
                  <th aria-controls="dtHorizontalVerticalExample">Timestamp</th>
                  <th aria-controls="dtHorizontalVerticalExample">Status</th>
                  <th aria-controls="dtHorizontalVerticalExample">Block</th>
                </tr>
              </thead>
              <tbody>
                {transactionsData.length > 0
                  ? transactionsData.map((data: any, index: any) => (
                      <tr key={index}>
                        <td
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-evenly",
                          }}
                        >
                          {truncateAddress(data.txID)}
                          {copySuccessMap[data.txID] ? (
                            <img
                              src="https://bafybeigk6xicsfexybksnorw7wsdz23claloq5uweophepc2conxuq3reu.ipfs.w3s.link/mark-white.png"
                              style={{ width: "12px" }}
                            ></img>
                          ) : (
                            <img
                              src="https://bafybeidj7pnybhjnbalxjvrkj6xeywq4brzmv727hosfmgqizqa5dpfoza.ipfs.w3s.link/copy-white%20(1).png"
                              style={{ width: "12px" }}
                              onClick={() => handleCopyClick(data.txID)}
                            ></img>
                          )}
                        </td>
                        <td>
                          {new Date(data.block_timestamp).toLocaleString()}
                        </td>
                        <td>{data.blockNumber}</td>
                        <td>{data.ret[0].contractRet}</td>
                      </tr>
                    ))
                  : "No transactions yet!"}{" "}
              </tbody>
            </table>
          </div>
          ​
          <div className="info-item2">
            <div className="info-lable">Votes</div>
            <table className="vote_table" id="voter-table">
              <thead>
                <tr>
                  <th aria-controls="dtHorizontalVerticalExample">
                    Voter_address
                  </th>
                  <th aria-controls="dtHorizontalVerticalExample">
                    Voter_count
                  </th>
                </tr>
              </thead>
              <tbody>
                {basicData.votes
                  ? basicData.votes.map((data: any, index: any) => (
                      <tr key={index}>
                        <td
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-evenly",
                          }}
                        >
                          {truncateAddress(data.vote_address)}
                          {copySuccessMap[data.vote_address] ? (
                            <img
                              src="https://bafybeigk6xicsfexybksnorw7wsdz23claloq5uweophepc2conxuq3reu.ipfs.w3s.link/mark-white.png"
                              style={{ width: "12px" }}
                            ></img>
                          ) : (
                            <img
                              src="https://bafybeidj7pnybhjnbalxjvrkj6xeywq4brzmv727hosfmgqizqa5dpfoza.ipfs.w3s.link/copy-white%20(1).png"
                              style={{ width: "12px" }}
                              onClick={() => handleCopyClick(data.vote_address)}
                            ></img>
                          )}
                        </td>
                        <td>{data.vote_count}</td>
                      </tr>
                    ))
                  : "Have not done voting."}{" "}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  } else if (!isAddressValid(props.inputValue)) {
    return <div className="invalid-address">Invalid address provided.</div>;
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
export default AddressWidget;
