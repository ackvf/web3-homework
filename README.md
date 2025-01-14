# React & Ethereum Development Assignment

## **Overview**
Your task is to create a React-based frontend application that interacts with an Ethereum-compatible network using EIP-4337 Account Abstraction. The app should provide users with the ability to:

1. **Create a Smart Contract Wallet** (or simulate its creation).
2. **Send transactions** (ETH or ERC-20 tokens) using the Smart Contract Wallet.
3. **View transaction history** for the wallet.

This assignment is designed to test your React skills, Ethereum development expertise, and ability to integrate third-party APIs.

---

## **Features**

### **1. Smart Contract Wallet Integration**
- Use an EIP-4337 bundler service to manage smart contract wallets.
- Provide functionality to create or simulate the creation of a Smart Contract Wallet.

### **2. Send Transactions**
- Allow the user to:
  - Input the recipient’s address.
  - Specify the amount of ETH or ERC-20 tokens to send.
  - Optionally customize the gas fee.

### **3. Transaction History**
- Display the transaction history of the wallet by fetching data using an Ethereum provider or a service like the Etherscan API.

### **4. Live Updates (Bonus)**
- Implement WebSocket updates or polling to refresh the transaction list when new transactions occur.

---

## **Technical Requirements**

### **Frontend Framework**
- Use React with functional components and hooks.
- TypeScript is mandatory for type safety.

### **Ethereum Interaction**
- Use Ethers.js, Viem or a similar library to interact with the Ethereum blockchain.
- Integrate with a wallet provider like MetaMask or WalletConnect.

### **EIP-4337**
- Utilize an open EIP-4337 bundler service for wallet creation and transactions.
- You can use a pre-existing implementation of a Smart Contract Wallet compatible with EIP-4337.

### **Styling**
- Use a modern CSS framework like TailwindCSS, Material-UI, or similar to style the application.

### **Error Handling**
- Handle errors gracefully with appropriate messages (e.g., invalid addresses, insufficient gas, or network issues).

---

## **Bonus Points**
1. Add a cool feature of your choice 


## **Submission Guidelines**

1. **Code Repository:** Provide a link to your GitHub repository.
   - Ensure the repository is public or add ahmed@neo.co as a contributor.
   - Include a clear commit history.
2. **Documentation:**
   - Include details in the README of your repository with:
     - Overview of the project.
     - Any assumptions or design decisions.
     - Steps to run the app locally.
   - Document any known issues or limitations.

---

## **Evaluation Criteria**
1. **Code Quality:**
   - Clean, modular, and reusable components.
   - Proper use of TypeScript for type safety.
2. **Functionality:**
   - All required features should work as expected.
3. **UI/UX:**
   - Intuitive, responsive, and well-styled user interface.
4. **Blockchain Integration:**
   - Proper interaction with Ethereum and EIP-4337.
5. **Error Handling:**
   - Robust handling of edge cases and clear error messages.

---

## **Resources**
- [EIP-4337 Documentation](https://eips.ethereum.org/EIPS/eip-4337)
- [Ethers.js Documentation](https://docs.ethers.io/v5/)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

---
Reach out to ahmed@neo.co with any questions.
Good luck, and happy coding!
