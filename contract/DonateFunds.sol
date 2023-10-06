// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract DonateFunds {
    address public owner;
    uint public minimumDonation;
    mapping(address => uint256) public donatedFund;

    constructor(uint256 _value) {
        owner = msg.sender;
        minimumDonation = _value;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    event Donated(address indexed user, uint256 amount);
    event DonationWithdraw(address indexed user, uint256 amount);

    function donateFunds() public payable {
        require(msg.value > minimumDonation, "Not enough value");
        donatedFund[msg.sender] += msg.value;
        emit Donated(msg.sender, msg.value);
    }

    function withdrawDonation(address _address, uint _value) public onlyOwner {
        require(msg.sender == owner, "Only owner can call this function");
        uint Balance = address(this).balance;
        require(Balance > _value, "Error! Not enough Balance to withdraw");
        payable(_address).transfer(_value);
        emit DonationWithdraw(_address, _value);
    }

    // Receive function to accept Ether
    receive() external payable {}

    function changeOwner(address newOwner) public onlyOwner {
        require(newOwner != address(0), "New owner address cannot be zero");
        owner = newOwner;
    }

    function changeMinimumDonation(uint256 _value) public onlyOwner {
        minimumDonation = _value;
    }

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }
}
