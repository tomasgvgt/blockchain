/*Script to do tests on a eth contract that:
    THe contract is deployed on a local network (ganache)
    Tests:
        Deployment of the contract
        getting the ,esssage when the instance of the contract is deployed using the message() method in the contract
        Changing the message in the contract with the setMessage() method in the contract
*/

const assert = require('assert');
const ganache = require('ganache-cli'); //Locan test network
const Web3 = require('web3');
//Create an instance of Web3 class, that conects to the newtork we specify (ganache)
const web3 = new Web3(ganache.provider());
//import the interface and bytecode from the compiled contract.
const { interface, bytecode } = require("../compile");

let accounts;
let inbox; //contract
//Use beforeEach to execute some general code always before each test (So there is no neeed to repeat code)
//Async/await for asynchronous 
beforeEach(async () => {
    //Get a list of all accounts int the ethereum network
    accounts = await web3.eth.getAccounts();

    // Use one of those accounts to deploy the contract
    inbox = await new web3.eth.Contract(JSON.parse(interface)) //pass the contract (interface) to web3
        .deploy({data: bytecode, arguments: ['Hi there!'] }) //Deploy the new contract and pass the argument to the contract 
        .send({from: accounts[0], gas: '1000000'}) //Send a transaction that creates a new contract, specify from which account it will be deployed and how much gass to use.
});

describe('Inbox', () => {
    it('deploys a contract', () => {
        assert.ok(inbox.options.address); //Does the contract have a value adress?
    });
    it('has a default message', async () => {
        const message = await inbox.methods.message() //call the message() method in the contract,
            .call(); //Use the call() method.
        assert.equal(message, 'Hi there!'); //Is the message thesame as the one we passed as argument when we created the contract?
    });
    it('can change the message', async () => {
        await inbox.methods.setMessage('bye') //call the setMessage() method in the function, to modify the message to 'bye.
            .send({from: accounts[0]}) //Since setMesssage() modifies data, we have to use send() to send a transaction.
        const message = await inbox.methods.message().call();
        assert.equal(message, 'bye'); // Is the new message 'bye'?
    })
});
