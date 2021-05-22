/*Script to deploy the Lottery contract to the rinkeby network*/

const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const {bytecode, interface} = require('./compile');

//set up provider with my ethereum account, creating a new instance of HDWalletProvider
const provider = new HDWalletProvider(
    'travel brush february basket best stairs juice emotion puzzle render this also', //Mnemonic from my account 
    'https://rinkeby.infura.io/v3/167eb28b357c4c1da332d77f5463d155' //Endpoint that specifies to which node I want to connect in the rinkeby network, using the infura API
);

//New Web3 instance with the provider previously created
const web3 = new Web3(provider);

//Function to deploy contract
const deploy = async () => {
    const accounts = await web3.eth.getAccounts();
    console.log(`Attempting to deploy from account: ${accounts[0]}`);

    const result = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: bytecode})
        .send({from: accounts[0], gas: '1000000'});
    
    console.log(interface)
    console.log(`Tomas, you just deployed a Contract to ${result.options.address}`);
}

deploy();
