//Import modules
//File system module
const fs = require('fs-extra');
//path module
const path = require('path');
//compiler
const solc = require('solc');

//Delete the build directory
const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

//Indicate the path of the contracts source code
const crowdfundPath = path.resolve(__dirname, 'contracts', 'Crowdfund.sol');
//Read sourcecode and store it in a variable
const source = fs.readFileSync(crowdfundPath, 'utf8');
//Compile files
const contractsCompiled = solc.compile(source, 1).contracts;
//Create directory to store new compiled files
fs.ensureDirSync(buildPath);
//Store each complied file in its correspondant file
for (let contract in contractsCompiled) {
    fs.outputJsonSync(
        //Specify the name of the file
        path.resolve(buildPath, contract.replace(':', '') + '.json'),
        //What will be stored in the file?
        contractsCompiled[contract]
    );
    }

