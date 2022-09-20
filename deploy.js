const ethers = require('ethers');
const fs = require('fs-extra');
require("dotenv").config();

async function main() {
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
    // const encryptedJson = fs.readFileSync("./encryptedKey.js", "utf8");
    // let wallet = new ethers.Wallet.fromEncryptedJsonSync(
    //     encryptedJson,
    //     process.env.PRIVATE_KEY_PASSWORD
    // )
    // wallet = await wallet.connect(provider);
    const abi = fs.readFileSync("./bin/SimpleStorage.abi", "utf8");
    const binary = fs.readFileSync("./bin/SimpleStorage.bin", "utf8");
    const contractFactory = new ethers.ContractFactory(abi, binary, wallet);
    console.log("wait while deploying...")
    const contract = await contractFactory.deploy();
    //const transactionRecipt = await contract.deployTransaction.wait(1);
    const getFavouriteNum = await contract.retrieve();
    console.log(getFavouriteNum.toString())
    const transactionResponse = await contract.store("7");
    const transactionRecipt = await transactionResponse.wait(1);
    const updatedFavNum = await contract.retrieve();
    console.log(updatedFavNum.toString());

}



main().then(() => process.exit(0)).catch((error) => {
    console.error(error);
    process.exit(1);
})