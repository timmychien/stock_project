var address ="0x83b04027B5C85A54f1c6f6D9ECf9546A08C5c49F";
var votingABI =[
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "address",
                "name": "newOwner",
                "type": "address"
            }
        ],
        "name": "addOwner",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "votingId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "participantId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "buyAmount",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "buyer",
                "type": "address"
            }
        ],
        "name": "Buy",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "string",
                "name": "tokenName",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "tokenSymbol",
                "type": "string"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "NFTaddress",
                "type": "address"
            }
        ],
        "name": "NFTCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "votingId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "nft",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "votes",
                "type": "uint256"
            }
        ],
        "name": "Vote",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "votingId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "symbol",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "uri",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "nftAddress",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "author",
                "type": "string"
            }
        ],
        "name": "addCandidate",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "string",
                "name": "topic",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "votingId",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "startAddTime",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "endAddTime",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "startVoteTime",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "endVoteTime",
                "type": "uint256"
            }
        ],
        "name": "addVoting",
        "type": "event"
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_votingId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "participantId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "price",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "buyAmount",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "buyer",
                "type": "address"
            }
        ],
        "name": "buy",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_votingId",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "_NFTName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_NFTSymbol",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_URI",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_author",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "authorAddress",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "createCandidate",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "string",
                "name": "_topic",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "_startAddTime",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_endAddTime",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_startVoteTime",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "_endVoteTime",
                "type": "uint256"
            }
        ],
        "name": "createVoting",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_votingId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "participantId",
                "type": "uint256"
            },
            {
                "internalType": "address payable",
                "name": "contractowner",
                "type": "address"
            }
        ],
        "name": "deleteworks",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "address",
                "name": "newAddress",
                "type": "address"
            }
        ],
        "name": "setPointAddress",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_votingId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "participantId",
                "type": "uint256"
            },
            {
                "internalType": "address",
                "name": "voter",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "_votes",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "timestamp",
                "type": "uint256"
            }
        ],
        "name": "vote",
        "outputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "_buyHistory",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "VotingId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "participantId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "buyAmounts",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "_candidate",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "VotingId",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "NFTName",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "NFTSymbol",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "URI",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "NFTAddress",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "author",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "votes",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "_voting",
        "outputs": [
            {
                "internalType": "string",
                "name": "topic",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "VotingId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "startAddTime",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "endAddTime",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "startVoteTime",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "endVoteTime",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "totalParticipant",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "_votingHistory",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "VotingId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "participantId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "votes",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "internalType": "uint256",
                "name": "votingId",
                "type": "uint256"
            }
        ],
        "name": "announceWinner",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "buyCounts",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "internalType": "address",
                "name": "buyer",
                "type": "address"
            }
        ],
        "name": "getbuyCounts",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "internalType": "address",
                "name": "buyer",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "buycount",
                "type": "uint256"
            }
        ],
        "name": "getbuyRecord",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "internalType": "uint256",
                "name": "votingId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "participantId",
                "type": "uint256"
            }
        ],
        "name": "getnftAddress",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "internalType": "uint256",
                "name": "votingId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "participantId",
                "type": "uint256"
            }
        ],
        "name": "getParticipant",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            },
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "internalType": "uint256",
                "name": "votingId",
                "type": "uint256"
            }
        ],
        "name": "getTotalParticipant",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "getTotalVoting",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "internalType": "address",
                "name": "voter",
                "type": "address"
            }
        ],
        "name": "getVoteCounts",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "internalType": "address",
                "name": "voter",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "votecount",
                "type": "uint256"
            }
        ],
        "name": "getVoteRecord",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "internalType": "address",
                "name": "caller",
                "type": "address"
            }
        ],
        "name": "isOwner",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "owners",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "point",
        "outputs": [
            {
                "internalType": "contract ERC777",
                "name": "",
                "type": "address"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [],
        "name": "totalVoting",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_votingId",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "participantId",
                "type": "uint256"
            }
        ],
        "name": "voteBalances",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "voteCounts",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    }
]
var contract = web3.eth.contract(votingABI).at(address);