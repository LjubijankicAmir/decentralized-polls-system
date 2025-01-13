// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

contract DecentralizedPollSystem {
    
    struct Poll {
        uint id;
        string title;
        string[] options;
        mapping(uint => uint) votes; // Option ID => Vote count
        mapping(address => bool) hasVoted; 
        bool exists;
    }

    address public admin;
    uint public pollCounter;
    mapping(uint => Poll) public polls;

    event PollCreated(uint pollId, string title);
    event PollDeleted(uint pollId);
    event Voted(uint pollId, uint optionId, address voter);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can perform this action");
        _;
    }

    modifier pollExists(uint pollId) {
        require(polls[pollId].exists, "Poll does not exist");
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    function createPoll(string memory title, string[] memory options) public onlyAdmin {
        require(options.length > 1, "Poll must have at least two options");

        pollCounter++;
        Poll storage newPoll = polls[pollCounter];
        newPoll.id = pollCounter;
        newPoll.title = title;
        newPoll.exists = true;

        for (uint i = 0; i < options.length; i++) {
            newPoll.options.push(options[i]);
        }

        emit PollCreated(pollCounter, title);
    }

    function deletePoll(uint pollId) public onlyAdmin pollExists(pollId) {
        delete polls[pollId];
        emit PollDeleted(pollId);
    }

    function vote(uint pollId, uint optionId) public pollExists(pollId) {
        Poll storage poll = polls[pollId];

        require(!poll.hasVoted[msg.sender], "You have already voted in this poll");
        require(optionId < poll.options.length, "Invalid option");

        poll.votes[optionId]++;
        poll.hasVoted[msg.sender] = true;

        emit Voted(pollId, optionId, msg.sender);
    }

    function getPoll(uint pollId) public view pollExists(pollId) returns (string memory, string[] memory, uint[] memory) {
        Poll storage poll = polls[pollId];
        uint[] memory voteCounts = new uint[](poll.options.length);

        for (uint i = 0; i < poll.options.length; i++) {
            voteCounts[i] = poll.votes[i];
        }

        return (poll.title, poll.options, voteCounts);
    }
}
