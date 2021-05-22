pragma solidity ^0.4.17;

//Contract that deploys new crowdfund campaign contracts and stores its adresses.
contract CrowdfundGenerator {
    address[] public deployedCampaigns;
    address public manager;
    //mapping(address => bool) public crowdfunders;
    
    modifier only_manager(){
        require (msg.sender == manager);
        _;
    }
    
    // modifier only_crowdfunder (){
    //     require (crowdfunders[msg.sender]);
    //     _;
    // }
    
    function CrowdfundGenerator() public {
        manager = msg.sender;
    }
    
    // function newCrowdfunder(address crowdfunder) public only_manager{
    //     crowdfunders[crowdfunder] = true;
    // }
    
    function createCampaign(uint minimum) public{
        //Create a new contract Campaign.
        address newCampaign = new Crowdfund(minimum, msg.sender);
        deployedCampaigns.push(newCampaign);
        //crowdfunders[msg.sender] = false;
    }
    
    function getDeployedCampaigns() public view returns(address[]){
        return (deployedCampaigns);
    }
}


//Contract for each crowdfund campaign
contract Crowdfund {
    
    struct Request {
        string description;
        uint value;
        address recipient;
        mapping (address => bool) voters;
        uint positive_votes;
        bool complete;
        
    }
    
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public approvers;
    Request[] public requests;
    uint approvers_count;
    
    //uint public positiveVotes;
    
    modifier only_manager() {
        require(msg.sender == manager);
        _;
    }
    function Crowdfund(uint minimum, address creator) public{
        manager = creator;
        minimumContribution = minimum;
        approvers_count = 0;
    }
    
    function contribute() public payable{
        if (msg.value >= minimumContribution)
        {
            approvers[msg.sender] = true;
            approvers_count++;
        }
    }
    
    function createRequest(string descript, uint val, address recep) public only_manager {
            
        //create a new instance on the Request struct called newRequest
        Request memory newRequest = Request({
            description: descript,
            value: val,
            recipient: recep,
            // remember mapping (address => bool) voters; ?
            //mappings dont have to be initialized untill yo enter new atrributes to it
            positive_votes: 0,
            complete: false
        });
        
        //You can also use this syntax for creating the new instance
        //Request memory newRequest = Request(descript, val, recep, false);
        
        
        requests.push(newRequest);
        
    }
    
    function approveRequest(uint index) public{
        require(approvers[msg.sender] == true);
        require(requests[index].voters[msg.sender] == false);
        requests[index].positive_votes++;
        requests[index].voters[msg.sender] = true;
        
    }
    
    
    function finalizeRequest (uint index) public only_manager{
        require (requests[index].positive_votes > approvers_count / 2);
        require (requests[index].complete == false);
        requests[index].recipient.transfer(requests[index].value);
        requests[index].complete = true;
        
    }
}
