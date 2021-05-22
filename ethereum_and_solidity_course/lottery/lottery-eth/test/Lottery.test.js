const { AssertionError } = require('assert');
const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const {interface, bytecode} = require('../compile');

const web3 = new Web3(ganache.provider());
let accounts;
let lottery;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    //When deployed, the lottery vaariable will hold the instance of the contract so we can interact with it
    lottery = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: bytecode})
        .send({from: accounts[0], gas: '1000000'});
});

describe('Lottery', () =>{
    it('Deploys a contract', () => {
        assert.ok(lottery.options.address);
    });

    it('Allows a player to enter the Lottery', async () => {
        //Call the enter method in the contract, that entes a new player in the lottery.
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.011', 'ether') //Send 0.011 ether beacuse it is required to enter the lottery
        });

        //Call the getPlayers() method to get a list of the current players in the lottery
        const players = await lottery.methods.getPlayers().call({
            from: accounts[0],
        });

        //Verify that the player that entered the lottery is the correctone
        assert.equal(accounts[0], players[0]); //When using assertion.equal , always put first the value that showld be.

        //verify that there is only one player (becaouse we only enetered one)
        assert.equal(1, players.length);
    });

    it('Allows multiple players to enter the Lottery', async () => {
        //Call the enter method in the contract, that entes the first player in the lottery.
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('0.011', 'ether')
        });
        //Call the enter method in the contract, that entes the second player in the lottery.
        await lottery.methods.enter().send({
            from: accounts[1],
            value: web3.utils.toWei('0.011', 'ether')
        });

        //Call the enter method in the contract, that entes the third player in the lottery.
        await lottery.methods.enter().send({
            from: accounts[2],
            value: web3.utils.toWei('0.011', 'ether')
        });

        //Call the getPlayers() method to get a list of the current players in the lottery
        const players = await lottery.methods.getPlayers().call({
            from: accounts[0],
        });

        //Verify that the players that entered the lottery is the correctones
        assert.equal(accounts[0], players[0]);
        assert.equal(accounts[1], players[1]);
        assert.equal(accounts[2], players[2]);

        //verify that there are  3 players
        assert.equal(3, players.length);
    });

    it ('requires a minumum ammout of  > 0.1 ether to enter the lottery', async () => {
        try {
            //By sending < 0.01 ether, there should be an error
            await lottery.methods.enter().send({
                from: accounts[0],
                value: web3.utils.toWei('0.009', 'ether')
            });
            // If no error happens, it means people can send less ammount of the eth required (Which sould not be allowed to happen)
            assert(false); //If we get to this line of code, fail the test.
        } catch(err) {
            assert(err);
        }
    });

    it ('only manager can call pickWinner()', async() => {
        try {
            //try to call pickWinner() from an account who is not the manager
            await lottery.methods.pickWinner().send({
                from: accounts[1]
            });
            //If it lets you, fail the test.
            assert(false);
        } catch(err) {
            assert(err);
        }
    });

    it('Sends money to the winner and resets the players array', async() => {
        await lottery.methods.enter().send({
            from: accounts[0],
            value: web3.utils.toWei('1', 'ether')
        });
        const balance = await web3.eth.getBalance(accounts[0]);

        await lottery.methods.pickWinner().send({
            from: accounts[0]
        });
        const new_balance = await web3.eth.getBalance(accounts[0]);
        const players = await lottery.methods.getPlayers().call({
            from: accounts[0]
        });
        //Verifies the winning accout got its price (not 1 ehter because there are commisons)
        assert(new_balance - balance > web3.utils.toWei('0.9', 'ether'))

        //verifies the lottery was reset after a winner was picked
        assert(players.length == 0);

        const lottery_balance = await web3.eth.getBalance(lottery.options.address);
        //verifies all the funds from the lottery where sent
        assert.equal(0, lottery_balance);
    });
});
