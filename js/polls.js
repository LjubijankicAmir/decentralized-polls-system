let web3;
let contract;
let userAddress;

window.addEventListener('load', async () => {
    userAddress = localStorage.getItem("userAddress");
    const contractAddress = localStorage.getItem("contractAddress");
    const abi = JSON.parse(localStorage.getItem("abi"));

    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        contract = new web3.eth.Contract(abi, contractAddress);
    } else {
        alert("Please install MetaMask!");
    }

    const adminAddress = await contract.methods.admin().call();
    if (userAddress.toLowerCase() === adminAddress.toLowerCase()) {
        document.getElementById("admin-section").style.display = "block";
        loadPollsForAdmin();
    } else {
        document.getElementById("user-section").style.display = "block";
        loadPollsForUser();
    }
});

async function loadPollsForAdmin() {
    const pollCount = await contract.methods.pollCounter().call();
    const pollList = document.getElementById("poll-list");
    pollList.innerHTML = "";

    for (let i = 0; i < pollCount; i++) {
        const poll = await contract.methods.polls(i).call();
        if (poll.exists) {
            const pollElement = document.createElement("div");
            pollElement.innerHTML = `<h4>${poll.title}</h4>`;
            pollList.appendChild(pollElement);
        }
    }
}

async function loadPollsForUser() {
    const pollCount = await contract.methods.pollCounter().call();
    const pollListUser = document.getElementById("poll-list-user");
    pollListUser.innerHTML = "";

    for (let i = 0; i < pollCount; i++) {
        const poll = await contract.methods.polls(i).call();
        if (poll.exists) {
            const pollElement = document.createElement("div");
            pollElement.innerHTML = `<h4>${poll.title}</h4>`;
            pollListUser.appendChild(pollElement);
        }
    }
}

document.getElementById("create-poll-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const title = document.getElementById("poll-title").value;
    const options = document.getElementById("poll-options").value.split(",");
    await contract.methods.createPoll(title, options).send({ from: userAddress });
    loadPollsForAdmin();
});