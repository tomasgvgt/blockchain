/*Script to deploy a contract to the rinkeby network*/

const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const {interface, bytecode} = require('./compile');

//Set up the provider with my ethereum account
const provider = new HDWalletProvider(
    'travel brush february basket best stairs juice emotion puzzle render this also', //Mnemonic from my account 
    'https://rinkeby.infura.io/v3/167eb28b357c4c1da332d77f5463d155' //Endpoint that specifies to which node I want to connect in the rinkeby network (We use infura API)
);

//Create a new web3 instance using the provider we just created
const web3 = new Web3(provider);

//We create a function so we can use asinc/await
const deploy = async () => {
    const accounts = await web3.eth.getAccounts(); //List all the wallets in this account
    console.log('Attempting to deploy from accout', accounts[0]);

    //create an instance of the contract
    const result = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: bytecode, arguments: ['Hi there!']})
        .send({gas: '1000000', from: accounts[0]});

    console.log('Contract deployed to', result.options.address);
};

// call the function deploy() to deploy the contract
deploy()
