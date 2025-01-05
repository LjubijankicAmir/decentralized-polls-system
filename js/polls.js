let web3;
let contract;
let userAddress;

window.addEventListener("load", async () => {
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
  for (let i = 1; i <= pollCount; i++) {
    const poll = await contract.methods.getPoll(i).call();
    const pollDiv = document.createElement("div");
    pollDiv.className = "mb-3";
    pollDiv.innerHTML = `
                    <h4>${poll[0]}</h4>
                    <p>${poll[1].join(", ")}</p>
                    <button class="btn btn-danger" onclick="deletePoll(${i})">Delete</button>
                `;
    pollList.appendChild(pollDiv);
  }
}

async function loadPollsForUser() {
  const pollCount = await contract.methods.pollCounter().call();

  const pollListUser = document.getElementById("poll-list-user");
  pollListUser.innerHTML = "";

  for (let i = 1; i <= pollCount; i++) {
    try {
      const poll = await contract.methods.getPoll(i).call();

      const title = poll[0];
      const options = poll[1];
      const voteCounts = poll[2].map((vote) => parseInt(vote, 10));

      let totalVotes = 0;
      for (let j = 0; j < voteCounts.length; j++) {
        totalVotes += voteCounts[j];
      }

      const pollElement = document.createElement("div");
      pollElement.className = "card mb-3";
      pollElement.innerHTML = `
              <div class="card-body">
                  <h4 class="card-title" style="margin-bottom: 16px">${title} - ${totalVotes} vote(s)</h4>
                  <ul class="list-group list-group-flush">
                      ${options
                        .map((option, index) => {
                          const votePercentage =
                            totalVotes > 0 ? ((voteCounts[index] / totalVotes) * 100).toFixed(1): 0;
                          return `<li class="list-group-item" style="border: 0px; font-weight: bold;">
                                  ${option}
                                  <div class="progress">
                                      <div class="progress-bar" role="progressbar" style="width: ${votePercentage}%;" aria-valuenow="${votePercentage}" aria-valuemin="0" aria-valuemax="100">${votePercentage}%</div>
                                  </div>
                                  <button class="btn btn-primary btn-sm float-end" onclick="vote(${i}, ${index})">Vote</button>
                              </li>`;
                        }).join("")}
                  </ul>
              </div>
          `;
      pollListUser.appendChild(pollElement);
    } catch (error) {
      //
    }
  }
}

async function deletePoll(pollId) {
  await contract.methods.deletePoll(pollId).send({ from: userAddress });
  loadPollsForAdmin();
}

async function vote(pollId, optionId) {
  await contract.methods.vote(pollId, optionId).send({ from: userAddress });
  loadPollsForUser();
}

document
  .getElementById("create-poll-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = document.getElementById("poll-title").value;
    const options = document
      .getElementById("poll-options")
      .value.split(",")
      .map((opt) => opt.trim());
    await contract.methods
      .createPoll(title, options)
      .send({ from: userAddress });
    loadPollsForAdmin();
  });
