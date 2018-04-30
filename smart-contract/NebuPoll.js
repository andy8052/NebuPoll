"use strict";

var NebuPoll = function () {
    LocalContractStorage.defineMapProperty(this, "polls");
    LocalContractStorage.defineMapProperty(this, "usersToPolls");
};

NebuPoll.prototype = {
    init: function () {
        LocalContractStorage.set("pollCount", 0);
    },
    getPollCount: function () {
        return LocalContractStorage.get("pollCount");
    },
    createPoll: function (question, answer1, answer2) {
        var from = Blockchain.transaction.from;
        var pollCount = LocalContractStorage.get("pollCount");

        var poll = '{"question": "' + question + '","one": {"answer": "' + answer1 + '","votes": 0},"two": {"answer": "' + answer2 + '","votes": 0}}'
        this.polls.set(pollCount, poll);

        LocalContractStorage.set("pollCount", pollCount + 1);

        return pollCount;
    },
    getPoll: function (pollId) {
        return this.polls.get(pollId);
    },
    vote: function (pollId, voteId) {
        var pollCount = LocalContractStorage.get("pollCount");
        if (pollId >= pollCount) {
            throw new Error("Invalid poll id.")
        }
        if (voteId != 2 && voteId != 1) {
            throw new Error("Invalid vote.");
        }

        var from = Blockchain.transaction.from;
        var userToPolls = JSON.parse(this.usersToPolls.get(from));

        if (userToPolls == null) {
            userToPolls = [];
        }

        for (var x = 0; x < userToPolls.length; x++) {
            if (userToPolls[x] == pollId) {
                throw new Error("You have already voted on this poll.")
            }
        }

        userToPolls.push(pollId);
        this.usersToPolls.set(from, JSON.stringify(userToPolls));

        var poll = JSON.parse(this.polls.get(pollId));
        if (voteId == 1) {
            poll.one.votes += 1;
        }
        if (voteId == 2) {
            poll.two.votes += 1;
        }
        this.polls.set(pollId, JSON.stringify(poll));

        return true;
    }
};

module.exports = NebuPoll;
