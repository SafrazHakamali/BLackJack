//*Define global variables 
var cardsObj = [];
var numberOfCards=52;
var cardSum=1;
var cardNumber = "A";
var cardSuit = "&spades";
var player1Total = 0;
var player1Status = "";
var playerCards= [];
var dealerCards = [];
var dealerTotal = 0;
var dealerStatus = "";
var dealerTotalText = "";
var playerScore = 0;
var dealerScore = 0;
var winStatus = "";
var stash = 1000;
var bet = 0;

//function to reset variables when dealing
var clearVariables = function () {
	player1Total = 0;
	player1Status = "";
	dealerTotal = 0;
	dealerStatus = "";
	dealerTotalText = "";
	playerScore = 0;
	dealerScore = 0;
	winStatus = "";
} 

//Define binary button availability
var dealButtonB = true;
var hitButtonB = false;
var standButtonB = false;

//Define binary button nodes 
var dealButton10 = document.querySelector('#deal10');
var dealButton20 = document.querySelector('#deal20');
var dealButton50 = document.querySelector('#deal50');
var hitButton = document.querySelector('#hit');
var standButton = document.querySelector('#stand');

//Function to check button visibility status and change on screen. Run once.
var checkButtons = function() {
	if (dealButtonB) {dealButton10.style.visibility="visible"; dealButton20.style.visibility="visible"; dealButton50.style.visibility="visible";} else {dealButton10.style.visibility="collapse"; dealButton20.style.visibility="collapse"; dealButton50.style.visibility="collapse";}
	if (hitButtonB) {hitButton.style.visibility="visible";} else {hitButton.style.visibility="collapse";}
	if (standButtonB) {standButton.style.visibility="visible";} else {standButton.style.visibility="collapse";}
};
checkButtons();

//Define nodes to edit and appendChild to: 
var stashInfo = document.querySelector('#stashInfo');
var playerArea = document.querySelector('#playerArea');
var infoArea = document.querySelector('.infoArea');
var dealerArea = document.querySelector('#dealerArea');

//update how much money is left
var displayStash = function () {stashInfo.innerHTML="You have $"+ stash +".";};
displayStash();

//*****Deck Creation***//
for (i=0; i<numberOfCards; i++) {
	if      (i%13 == 0) {cardSum = 11; cardNumber = "A";} 
	else if (i%13 < 10) {cardSum = i%13+1; cardNumber = i%13+1;} 
	else if (i%13 == 10) {cardSum = 10; cardNumber = "J";}
	else if (i%13 == 11) {cardSum = 10; cardNumber = "Q";}
	else if (i%13 == 12) {cardSum = 10; cardNumber = "K";}
	if (i<13) {cardSuit = '\u2666';} //diamonds
	else if (i<26) {cardSuit = '\u2663';} //clubs
	else if (i<39) {cardSuit = '\u2665';} //hearts
	else if (i<52) {cardSuit = '\u2660';} //spades
	cardsObj.push({});
	cardsObj[i]["cardSum"]=cardSum;
	cardsObj[i]["cardNumber"]=cardNumber;
	cardsObj[i]["cardSuit"]=cardSuit;
};

var clearCards = function() {
	while (playerArea.firstChild) {
    	playerArea.removeChild(playerArea.firstChild);
    }
	while (dealerArea.firstChild) {
    	dealerArea.removeChild(dealerArea.firstChild);
    }
};

var updateDealerStatus = function() {
	dealerTotalText="Dealer total is " + dealerTotal + ". ";
	if (dealerTotal<22) {dealerScore = dealerTotal; console.log("updated Dealer status");}
		else if (dealerTotal==21 && dealerCards.length==2) {dealerStatus = "Dealer hit blackjack! "; dealerScore=100; console.log("updated Dealer status");}
		else if (dealerTotal >21) {dealerStatus = "Dealer has gone bust! "; dealerScore = 0; console.log("updated Dealer status");};
};

var updateWinStatus = function() {
		console.log("Update Win Status function ran - Player score: " +playerScore + ". Dealer score: " + dealerScore);
		if (playerScore<dealerScore) {winStatus = "Dealer wins! You lost $" + bet + "."; console.log("updated win status: " + winStatus);}
		else if (playerScore==dealerScore) {winStatus = "Tie!"; stash = stash + bet; displayStash(); console.log("updated win status: " + winStatus);}
		else {winStatus = "You won $"+bet+"!"; stash = stash + bet*2; displayStash();  console.log("updated win status: " + winStatus);}
};

var dealerHit = function() {
	while (dealerTotal<playerScore && playerScore<22) {
		dealerCards.push(Math.floor(Math.random()*numberOfCards));
		var newCardIndex = dealerCards.length-1;
		var dealercardDisplay = document.createElement('div'); // creating div
		dealercardDisplay.className = "dealerCard";
		dealerArea.appendChild(dealercardDisplay);
		dealerTotal=dealerTotal+cardsObj[dealerCards[newCardIndex]]['cardSum'];
	}
};

var dealerFlip = function() {
	console.log("dealerFlip ran");
	for (i=0; i<2; i++) {
		dealerTotal=dealerTotal+cardsObj[dealerCards[i]]['cardSum'];
	}
	dealerHit();
	for (i=0; i<dealerCards.length; i++) {
		var dealerCardShow=document.querySelectorAll(".dealerCard");
		dealerCardShow[i].style.backgroundImage="none";
		dealerCardShow[i].innerHTML = cardsObj[dealerCards[i]]["cardNumber"] + " " +cardsObj[dealerCards[i]]["cardSuit"];
	}
	updateDealerStatus();
	updateWinStatus();
	infoArea.innerHTML="Your Total is " + player1Total +". "+ player1Status + dealerTotalText + dealerStatus + winStatus;
};

var totalCheck = function () {
	if (player1Total<16) {player1Status = "You need to Hit till above 15."; 	dealButtonB = false; hitButtonB = true; standButtonB = false; infoArea.innerHTML="Your Total is " + player1Total +". "+ player1Status;}
	else if (player1Total==21 && playerCards.length==2) {player1Status = "You hit BlackJack! "; dealButtonB = true; hitButtonB = false; standButtonB = false; playerScore = 100; dealerFlip();}
	else if (player1Total<22) {player1Status = ""; dealButtonB = false; hitButtonB = true; standButtonB = true; playerScore = player1Total; infoArea.innerHTML="Your Total is " + player1Total +". "+ player1Status;}
	else if (player1Total >21) {player1Status = "You have gone bust! "; dealButtonB = true; hitButtonB = false; standButtonB = false; playerScore = 0; dealerFlip();}
};

var deal = function () {
	clearVariables();
	playerCards=[Math.floor(Math.random()*numberOfCards),Math.floor(Math.random()*numberOfCards)];
	dealerCards=[Math.floor(Math.random()*numberOfCards),Math.floor(Math.random()*numberOfCards)];
	clearCards(); //clearing player & dealer area
	for (i=0; i<2; i++) { // cycling through playerCards
		var cardDisplay = document.createElement('div'); // creating div
		cardDisplay.className = "playingCard";
		cardDisplay.innerHTML = cardsObj[playerCards[i]]["cardNumber"] + " " +cardsObj[playerCards[i]]["cardSuit"];
		playerArea.appendChild(cardDisplay);
		player1Total=player1Total+cardsObj[playerCards[i]]['cardSum']; // obatin player1Total
		var dealercardDisplay = document.createElement('div'); // creating div
		dealercardDisplay.className = "dealerCard";
		dealerArea.appendChild(dealercardDisplay);
	}
	totalCheck(); // optains player1Status & update buttonStatus
	checkButtons(); // update button visibility
}

var hit = function () {
	playerCards.push(Math.floor(Math.random()*numberOfCards));
	var newCardIndex = playerCards.length-1;
	var cardDisplay = document.createElement('div'); // creating div
	cardDisplay.className = "playingCard";
	cardDisplay.innerHTML = cardsObj[playerCards[newCardIndex]]["cardNumber"] + " " +cardsObj[playerCards[newCardIndex]]["cardSuit"];
	playerArea.appendChild(cardDisplay);
	player1Total=player1Total+cardsObj[playerCards[newCardIndex]]['cardSum'];
	totalCheck();
	checkButtons();

}

var stand = function () {
	totalCheck();
	dealButtonB = true;
	hitButtonB = false;
	standButtonB = false;
	checkButtons();
	dealerFlip();
}

var deal10 = function () {
	bet = 10;
	stash = stash - bet;
	displayStash();
	deal ();
}

var deal20 = function () {
	bet = 20;
	stash = stash - bet;
	displayStash();	
	deal ();
}

var deal50 = function () {
	bet = 50;
	stash = stash - bet;
	displayStash();	
	deal ();
}

//Add event listeners to buttons
hitButton.addEventListener("click",hit);
dealButton10.addEventListener("click",deal10);
dealButton20.addEventListener("click",deal20);
dealButton50.addEventListener("click",deal50);
standButton.addEventListener("click",stand);