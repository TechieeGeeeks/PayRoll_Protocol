
# [Payroll Protocol](https://t.me/payrollprotocolbot)

**Payroll Protocol** is a confidential money distribution platform built on top of BASE, designed to provide confidentiality during the distribution of funds on-chain. By leveraging FHE cryptography and smart contracts, Payroll Protocol ensures the **confidentiality**, security, and efficiency of money distribution.

## Video Demo - https://www.youtube.com/watch?v=Na9AG3bECS0&feature=youtu.be

## Protocol Arcitecture 
![image](https://github.com/TechieeGeeeks/PayRoll_Protocol/assets/99035115/f47981a2-395b-4c38-9f6b-47addb97732d)

## Overview

Payroll Protocol integrates **BICONOMY AA SDK, BASE, and INCO FHEVM** to enhance user experience while confidentially distributing money.

INCO FHEVM provides hidden states to store encrypted addresses that hold encrypted amounts on the INCO network, ensuring that all **transactions are secure and confidential**. This integration guarantees that money distribution details and recipient information remain confidential. It uses **modified Hyperlane infrastructure** to bridge these state values from BASE to INCO and vice versa.

## Key Features

1. **Encrypted USDC Distributions:** Protects sensitive information with robust encryption methods.
2. **User-Friendly Interface:** Simplifies the payroll process with one click, thanks to BICONOMY SDK.
3. **Stealth Hold:** Users can hold stablecoins for an indefinite amount of time without revealing the amount.
4. **Underline Distribution:** Users can completely hide their withdrawals by distributing the encrypted amount to different encrypted addresses on their behalf, providing an experience similar to Tornado Cash.

## Tech Stack

- **Frontend:** Next.js, Tailwind CSS
- **Authentication & Wallets:** Privy
- **Backend & Smart Contracts:** Node.js, Solidity
- **Blockchain:** BASE, INCO FHEVM
- **Account Abstraction & Gasless Transactions:** Biconomy
- **Encryption:** FHE schemes


## Usage

1. Connect your web3 wallet.
2. Navigate to the distribution page.
3. Enter the recipient addresses and amounts.
4. Confirm the transaction to distribute funds confidentially.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Biconomy](https://www.biconomy.io/)
- [BASE](https://base.org/)
- [INCO FHEVM](https://inco.org/)

