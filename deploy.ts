import { ethers } from "ethers"
import * as fs from "fs-extra"
import "dotenv/config"

async function main() {
  let provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL!)
  let wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider)
  const abi = fs.readFileSync("./Storage_sol_Storage.abi", "utf8")
  const binary = fs.readFileSync("./Storage_sol_Storage.bin", "utf8")

  const contractFactory = new ethers.ContractFactory(abi, binary, wallet)
  console.log("Deploying, please wait...")
  const contract = await contractFactory.deploy()
  const deploymentReceipt = await contract.deployTransaction.wait()
  console.log(`Deployed to ${contract.address}`)

  let currentFavoriteNumber = await contract.retrieve()
  console.log(`Current Favorite Number: ${currentFavoriteNumber}`)
  console.log("Updating favorite number...")
  let transactionResponse = await contract.store(10)
  let transactionReceipt = await transactionResponse.wait()
  currentFavoriteNumber = await contract.retrieve()
  console.log(`New Favorite Number: ${currentFavoriteNumber}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
