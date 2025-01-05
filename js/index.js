let web3;
let contract;
let userAddress;

const contractAddress = "0x171052533faDD294E210d262C93eFE883A6Ae7E4";
const abi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"pollId","type":"uint256"},{"indexed":false,"internalType":"string","name":"title","type":"string"}],"name":"PollCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"pollId","type":"uint256"}],"name":"PollDeleted","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"pollId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"optionId","type":"uint256"},{"indexed":false,"internalType":"address","name":"voter","type":"address"}],"name":"Voted","type":"event"},{"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"title","type":"string"},{"internalType":"string[]","name":"options","type":"string[]"}],"name":"createPoll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"pollId","type":"uint256"}],"name":"deletePoll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"pollId","type":"uint256"}],"name":"getPoll","outputs":[{"internalType":"string","name":"","type":"string"},{"internalType":"string[]","name":"","type":"string[]"},{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pollCounter","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"polls","outputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"string","name":"title","type":"string"},{"internalType":"bool","name":"exists","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"pollId","type":"uint256"},{"internalType":"uint256","name":"optionId","type":"uint256"}],"name":"vote","outputs":[],"stateMutability":"nonpayable","type":"function"}];

async function connectMetaMask() {
    if (window.ethereum) {
        try {
            const accounts = await ethereum.request({ method: "eth_requestAccounts" });
            userAddress = accounts[0];
            web3 = new Web3(window.ethereum);
            contract = new web3.eth.Contract(abi, contractAddress);
            document.getElementById("login").style.display = "none";

            localStorage.setItem("userAddress", userAddress);
            localStorage.setItem("contractAddress", contractAddress);
            localStorage.setItem("abi", JSON.stringify(abi));

            window.location.href = "polls.html";
        } catch (error) {
            console.error("MetaMask connection failed", error);
        }
    } else {
        alert("Please install MetaMask!");
    }
}