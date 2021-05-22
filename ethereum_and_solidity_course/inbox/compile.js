const path = require('path');
const fs = require('fs');
const solc = require('solc');

const inboxPath = path.resolve(__dirname, 'contracts', 'Inbox.sol');
const source = fs.readFileSync(inboxPath, 'utf8');


//console.log (solc.compile(source, 1))
//We want to export only the contracts[':Inbox'] element of the object, which contains the bitecode and ABI(interface) code.
//We export the inbox element of the contract, so we can use it for deployment and interaction with the contract.
module.exports = solc.compile(source, 1).contracts[':Inbox'];

