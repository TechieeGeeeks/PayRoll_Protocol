const express = require("express");
const { ethers } = require("ethers");
require("dotenv").config();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 8080;

// Load environment variables
const BASE_SEPOLIA_PROVIDER_URL = process.env.BASE_SEPOLIA_PROVIDER_URL;
const BASE_SEPOLIA_PRIVATE_KEY = process.env.BASE_SEPOLIA_PRIVATE_KEY;
const BASE_SEPOLIA_CONTRACT_ADDRESS = "0x540af881A76ff8d8fd75f741D88ecABB8b8C229c";

const INCO_PROVIDER_URL = process.env.INCO_PROVIDER_URL;
const INCO_PRIVATE_KEY = process.env.INCO_PRIVATE_KEY;
const INCO_CONTRACT_ADDRESS = "0x46547de0F612Af9c30A4c35EC4e32933FBd44694";

const incoDomainId = 9090;
const baseSepoliaDomainId = 84532;

const ABI = require("./contractAbi.json"); // Load the contract ABI

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});


// Setup provider and wallet for Sepolia
const baseSepoliaProvider = new ethers.providers.JsonRpcProvider(
    BASE_SEPOLIA_PROVIDER_URL
);
const baseSepoliaWallet = new ethers.Wallet(
    BASE_SEPOLIA_PRIVATE_KEY,
    baseSepoliaProvider
);
const baseSepoliaContract = new ethers.Contract(
    BASE_SEPOLIA_CONTRACT_ADDRESS,
    ABI,
    baseSepoliaWallet
);

// Setup provider and wallet for Inco
const incoProvider = new ethers.providers.JsonRpcProvider(INCO_PROVIDER_URL);
const incoWallet = new ethers.Wallet(INCO_PRIVATE_KEY, incoProvider);
const incoContract = new ethers.Contract(
    INCO_CONTRACT_ADDRESS,
    ABI,
    incoWallet
);


// Event listener function for Sepolia
async function listenToEventsBaseSepolia() {
    console.log("Listening for Dispatch events on Base Sepolia...");
    baseSepoliaContract.on(
        "DispatchProxy",
        async (destination, recipient, actualMessage, event) => {
            console.log(`Dispatch event detected on Sepolia:
            Destination: ${destination}
            Recipient: ${recipient}
            Message: ${actualMessage}`);
            // Convert recipient bytes32 to address
            actualRecipient = "0x" + recipient.substring(26, 66);
            try {
                // Call handle function on Inco
                const senderBytes = await ethers.utils.hexZeroPad(ethers.utils.hexlify(BASE_SEPOLIA_CONTRACT_ADDRESS), 32);
                await callHandleOnInco(
                    baseSepoliaDomainId,
                    senderBytes,
                    actualRecipient,
                    actualMessage
                );
            } catch (error) {
                console.error("Error processing Dispatch event on Sepolia:", error);
            }
        }
    );
}

// Event listener function for Inco
async function listenToEventsInco() {
    console.log("Listening for Dispatch events on Inco...");

    incoContract.on(
        "DispatchProxy",
        async (destination, recipient, actualMessage, event) => {
            console.log(`Dispatch event detected on Inco:
            Destination: ${destination}
            Recipient: ${recipient}
            Message: ${actualMessage}`);
            // Convert recipient bytes32 to address
            actualRecipient = "0x" + recipient.substring(26, 66);
            try {
                // Call handle function on Inco
                const senderBytes = await ethers.utils.hexZeroPad(ethers.utils.hexlify(INCO_CONTRACT_ADDRESS), 32);
                await callHandleOnBaseSepolia(
                    incoDomainId,
                    senderBytes,
                    actualRecipient,
                    actualMessage
                );
            } catch (error) {
                console.error("Error processing Dispatch event on Sepolia:", error);
            }
        }
    );
}

// Function to call handle on Inco
async function callHandleOnInco(origin, sender, recipientAddress, message) {
    try {
        const contractToCall = new ethers.Contract(
            recipientAddress,
            ABI,
            incoWallet
        );
        const tx = await contractToCall.handle(origin, sender, message, {
            gasLimit: ethers.BigNumber.from(2000000), // Adjust gas limit as needed
        });
        await tx.wait();

        console.log(`handle function called on Inco with tx: ${tx.hash}`);
    } catch (error) {
        console.error("Error calling handle function on Inco:", error);
    }
}

// Function to call handle on Sepolia
async function callHandleOnBaseSepolia(
    origin,
    sender,
    recipientAddress,
    message
) {
    try {
        const contractToCall = new ethers.Contract(
            BASE_SEPOLIA_CONTRACT_ADDRESS,
            ABI,
            baseSepoliaWallet
        );
        const tx = await contractToCall.handle(9090, sender, message, {
            gasLimit: ethers.BigNumber.from(2000000), // Adjust gas limit as needed
        });
        await tx.wait();
    } catch (error) {
        console.error("Error calling handle function on Base Sepolia:", error);
    }
}

app.get('/api/sendEth/:address', async (req, res) => {
    try {
        const recipientAddress = req.params.address;

        // Validate the recipient address
        if (!ethers.utils.isAddress(recipientAddress)) {
            return res.status(400).json({ error: 'Invalid Ethereum address' });
        }

        // Send 0.001 ETH
        const tx = {
            to: recipientAddress,
            value: ethers.utils.parseEther('0.001')
        };

        const transactionResponse = await incoWallet.sendTransaction(tx);
        await transactionResponse.wait();

        res.json({
            message: 'Transaction successful',
            transactionHash: transactionResponse.hash
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the Express server
const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    // Start listening to events on both chains
    listenToEventsBaseSepolia().catch(console.error);
    listenToEventsInco().catch(console.error);
});

server.on('error', (error) => {
    console.error('Server error:', error);
});