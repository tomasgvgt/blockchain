//Import dependencies
//import web3
const Web3 = require('web3');
//import ganache-cli for deployment
const ganache = require('ganache-cli');
//import assert for tests
const assert = require('assert');
//import commpiled contracts
const compiledGenerator = require('../ethereum/build/CrowdfundGenerator.json');
const compiledCrowdFund = require('../ethereum/build/Crowdfund.json');



//create an instance of web3
const web3 = new Web3(ganache.provider());
//variables
let accounts;
let generator;
let crowdfundAddress;
let crowdfund;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts(); 
    generator = await new web3.eth.Contract(JSON.parse(compiledGenerator.interface))
        .deploy({data: compiledGenerator.bytecode})
        .send({from: accounts[0], gas: "1000000"});
    
    //Use the createCampaign function to create a new instanne of the Crowdfund contract
    await generator.methods.createCampaign('100') //always in wey
        .send({from: accounts[0], gas: '1000000'});
    
    const adresses = await generator.methods.getDeployedCampaigns().call();
    crowdfundAddress = adresses[0];

    //Since the instance of Crowdfind contract was already deployed in an adress, we just have to pass the adress.
    crowdfund = await new web3.eth.Contract(JSON.parse(compiledCrowdFund.interface), crowdfundAddress);
});

describe('Crowdfunds', () => {
    //1. Verify the contracts where deployed correcly.
    it('deploys a generator and a crowdfund', () => {
        assert.ok(generator.options.address);
        assert.ok(crowdfund.options.address);
    });
    it('Sets as manager the account that called the createCampaign function', async () => {
        const manager = await crowdfund.methods.manager().call();
        assert.equal(accounts[0], manager);
    });
    it('Lets people contribute, and correclty give aproovers status', async () => {
        await crowdfund.methods.contribute().send({
            from: accounts[1],
            value: '100'
        });
        await crowdfund.methods.contribute().send({
            from: accounts[2],
            value: '10' //Contributed less than the required to be an aproover
        });
        const isAproover1 = await crowdfund.methods.approvers(accounts[1]).call();
        const isAproover2 = await crowdfund.methods.approvers(accounts[2]).call();
        //Accounts[1] showld be in aproovers, while accounts[2] showld not
        assert.equal(isAproover1, true);
        assert.equal(isAproover2, false);
    });

    // it('Doesnt let a non-manager account create or approve a request', async () => {
    //     try {
    //         await crowdfund.methods.
    //             createRequest("Pay someone", '10', accounts[5])
    //             .send({
    //                 from: accounts[0], //Not the manager's address
    //             });
    //         assert(false);
    //     } catch(err) {
    //         assert(err);
    //     }
    // });

    it('processes. aproves and finalizes requests', async () => {
        await crowdfund.methods.contribute().send({
            from: accounts[1],
            value: web3.utils.toWei('2', 'ether')
        });
        await crowdfund.methods.contribute().send({
            from: accounts[2],
            value: web3.utils.toWei('1', 'ether')
        })
        await crowdfund.methods
            .createRequest("Pay account[5]", web3.utils.toWei('2', 'ether'), accounts[5])
            .send({
                from: accounts[0],
                gas: '1000000'
            });
        let balance = await web3.eth.getBalance(accounts[5]);
        balance = web3.utils.fromWei(balance, 'ether');
        await crowdfund.methods.approveRequest(0)
            .send({
                from: accounts[1],
                gas: '1000000'
            });
        await crowdfund.methods.approveRequest(0)
            .send({
                from: accounts[2],
                gas: '1000000'
            });
        let request = await crowdfund.methods.requests(0).call();
        assert.equal(2, request.positive_votes);
        await crowdfund.methods.finalizeRequest(0)
            .send({
                from: accounts[0],
                gas: '1000000'
            });
        let new_balance = await web3.eth.getBalance(accounts[5]);
        new_balance = web3.utils.fromWei(new_balance, 'ether');
        assert(new_balance - balance > 1.5);
        request = await crowdfund.methods.requests(0).call();
        assert(true, request.complete);
    });
});

