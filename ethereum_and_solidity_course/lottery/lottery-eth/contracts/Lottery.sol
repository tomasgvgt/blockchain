/*Ethereum contract for a lottery*/

pragma solidity ^0.4.17;

contract Lottery {
    //variable of type adress, public to everyone
    address public manager;
    
    //Dinamic array of adresses
    address[] public players;
    
    //Current winner
    address public winner;

    //Constructor function
    function Lottery() public {
        //Adress of the person who created the contracct, (for that we use the 'msg' global variable)
        manager = msg.sender;
    } 
    
    //Function to enter to the lottery (the player must send ehter to enter the lottery)
    function enter() public payable {
        //require is used to veryfy something to continue running the next code
        //verify that the player at least sent .01 ether 
        require(msg.value > .01 ether);
        //Pushes the players adress who called the function, to the array that holds the adresses of the players.
        players.push(msg.sender);
    }
    
    //Function to genrate random number
    //it is private and returns an unsigned integer
    function random() private view returns (uint){
        //keccak256 is a global function to generates a hash (really big number) from a given data
        //we feed it with 3 datas:
        //block.diffuculty is the difficulty of the current block, now is the time, players is the adress of playes
        //we convert the hash returned by keccak256 into an unsigned integer
        uint rand_num = uint(keccak256(block.difficulty, now, players));
        return(rand_num);
    
    }
    
    //Function to pick the random winner from all players, has the only_manager modifier
    function pickWinner() public only_manager{
        //We get the index of the player in the array of adresses
        uint index = random() % players.length;
        
        //transfers all the money in the contract to the adress of the winner.
        players[index].transfer(this.balance);
        winner = players[index];
        //Erase players so the lottery is reset
        players = new address[](0);
    }

    //Funtion to get all the players whi are currently in the lottery
    function getPlayers() public view returns(address[]) {
        return(players);
    }
    
    //Modifier: all the functions who have this modifier, will have its lines of code.
    modifier only_manager() {
        require(msg.sender == manager);
        _;
    }
}
