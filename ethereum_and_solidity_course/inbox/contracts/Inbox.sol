//Ethereum contract
pragma solidity ^0.4.17;

//contract is a keyword to define a contract
contract Inbox {
    //instance variable of type string that will always be in the contract
    string public message;
    
    function Inbox(string initialMessage) public {
        message = initialMessage;
    }
    //public -> Anyone can call this function.que 
    function setMessage(string newMessage) public {
        message = newMessage;
    }
    
    //view -> Used to access data but not modify it.
    //returns is used to specify what type of data will be returned by the function
    //This next function is commented, beacuse by creating a public variable on the top, solidity automatically creates a function that we can call to get the content of that variable.

    //function getMessage() public view returns (string) {
        //return message;
    //}
}