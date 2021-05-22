/*Script to deploy contract to the rinkeby network*/
//import libraries
const Web3 = require('web3');
const HDWalletProvider = require('truffle-hdwallet-provider');
//Compiled contract
const compiledGenerator = require('./build/CrowdfundGenerator.json');
//New hdwalletprorivder, using our wallet and the infura API for the rinkebi network
const provider = new HDWalletProvider('travel brush february basket best stairs juice emotion puzzle render this also',
    "https://rinkeby.infura.io/v3/167eb28b357c4c1da332d77f5463d155")
//New instance of web3 using provider
const web3 = new Web3(provider);

const deploy = async () => {
    const accounts = await web3.eth.getAccounts();

    console.log("Attempting to deploy from account ", accounts[0]);
    
    const result = await new web3.eth.Contract(JSON.parse(compiledGenerator.interface))
        .deploy({data: compiledGenerator.bytecode})
        .send({
            from: accounts[0],
            gas: '1000000'
        })
    console.log(compiledGenerator.interface);
    console.log(`Contract deployed to: ${result.options.address}`);
}

deploy();