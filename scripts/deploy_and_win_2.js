// add the game address here and update the contract name if necessary
let gameAddr = "";
const contractName = "Game2";
const assert = require('assert');

async function main() {

    async function deploy() {
      const Game = await hre.ethers.getContractFactory(contractName);
      // if you need to add constructor arguments for the particular game, add them here:
      const game = await Game.deploy();
      console.log(`${contractName} deployed to address: ${game.address}`);
      return {game};
    }
    
    if (gameAddr === "") {
      const {game} = await deploy();
      gameAddr = game.address;
    }
    //console.log(gameAddr); 
    const game = await hre.ethers.getContractAt(contractName, gameAddr);
    // get signer
    const signer = await hre.ethers.provider.getSigner();
    const signerAddr = await signer.getAddress();
    // call win
    await game.connect(signer).setX(42);
    await game.connect(signer).setY(8);
    const tx = await game.connect(signer).win();
  
    const receipt = await tx.wait();
    // get the logs array
    const logs = receipt.logs;

    // get the events array
    const events = receipt.events;
    // check if signer address is in Winner event
    const winner = events.filter(event => event.event === "Winner");
    // assert if winner event is emmitted and winner is signer address
    // take last element of winner array
    const winnerAddr = winner[winner.length - 1].args.winner;
    assert(winner.length === 1 && winnerAddr === signerAddr);    
    console.log("Win event triggered with ", winnerAddr);
  }

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
