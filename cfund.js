web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8545"));

var abi = [
	{
		"constant": false,
		"inputs": [],
		"name": "checkGoalReached",
		"outputs": [],
		"payable": false,
		"type": "function",
		"stateMutability": "nonpayable"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "fund",
		"outputs": [],
		"payable": true,
		"type": "function",
		"stateMutability": "payable"
	},
	{
		"constant": false,
		"inputs": [],
		"name": "kill",
		"outputs": [],
		"payable": false,
		"type": "function",
		"stateMutability": "nonpayable"
	},
	{
		"inputs": [
			{
				"name": "_goalAmount",
				"type": "uint256"
			}
		],
		"payable": false,
		"type": "constructor",
		"stateMutability": "nonpayable"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "ended",
		"outputs": [
			{
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"type": "function",
		"stateMutability": "view"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "goalAmount",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"type": "function",
		"stateMutability": "view"
	},
	{
		"constant": true,
		"inputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"name": "investors",
		"outputs": [
			{
				"name": "addr",
				"type": "address"
			},
			{
				"name": "amount",
				"type": "uint256"
			}
		],
		"payable": false,
		"type": "function",
		"stateMutability": "view"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "numInvestors",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"type": "function",
		"stateMutability": "view"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"name": "",
				"type": "address"
			}
		],
		"payable": false,
		"type": "function",
		"stateMutability": "view"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "status",
		"outputs": [
			{
				"name": "",
				"type": "string"
			}
		],
		"payable": false,
		"type": "function",
		"stateMutability": "view"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "totalAmount",
		"outputs": [
			{
				"name": "",
				"type": "uint256"
			}
		],
		"payable": false,
		"type": "function",
		"stateMutability": "view"
	}
];

const cfAbi = web3.eth.contract(abi);
const cfObj = cfAbi.at("0x798A726dA6852Dc34D58177BBaEA2ae291eA4Aa9");
const accounts = web3.eth.accounts;
const CA = cfObj.address;

function refereshAccountsTable() {
	let innerHtml = "<caption><b>Users</b></caption><thead><th>Account</th><th>Balance</th></thead>";

	innerHtml = innerHtml + "<tbody>"

	for (var i=0; i < accounts.length; i++) {
			var account = accounts[i];
			var balance = web3.fromWei(web3.eth.getBalance(account),"ether");
			
			innerHtml = innerHtml + "<tr><td>" + account + "</td><td>" + balance + "</td></tr>";
	}

	innerHtml += "</tbody>"
	$("#accountsBalanceTable").html(innerHtml);
}

function transferCoins() {
	const sender = document.querySelector("#from");
	const tokensToTransfer = document.querySelector("#amount");
	const password = document.querySelector("#password");
	
	web3.personal.unlockAccount(sender.value, password.value, 600);

  cfObj.fund({from: sender.value, value:tokensToTransfer.value, gas: 200000}, function(e, result){
    if(!e)
			console.log("Success")
    else 
      console.log(e);
  });

	sender.value = "";
	tokensToTransfer.value = "";
	password.value = "";
}

function refreshStatusTable(){
	const statusBody = document.querySelectorAll("#status tbody td");
	statusBody[0].innerText = cfObj.goalAmount();
	statusBody[1].innerText = cfObj.totalAmount();
}

function refreshHistoryTable(){
	const hist = document.getElementById("history");
	const numInvestors = cfObj.numInvestors();

	hist.innerHTML = ""
	for(let i=0; i<numInvestors; i++){
		hist.innerHTML += `<tr><td>${cfObj.investors(i)[0]}</td><td>${cfObj.investors(i)[1]}</td></tr>`
	}
}


$(document).ready(function() {
	refereshAccountsTable();
	refreshHistoryTable();
	const transferBtn = document.querySelector("#transferBtn");
	transferBtn.addEventListener('click', transferCoins);
	refreshStatusTable()
});

setInterval(refereshAccountsTable, 3000);
setInterval(refreshHistoryTable, 3000);
setInterval(refreshStatusTable, 3000);