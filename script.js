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

//Define binary button availability
var dealButtonB = true;
var hitButtonB = false;
var standButtonB = false;

//Define binary button nodes 
var dealButton = document.querySelector('#deal');
var hitButton = document.querySelector('#hit');
var standButton = document.querySelector('#stand');

//Function to check button visibility status and change on screen. Run once.
var checkButtons = function() {
	if (dealButtonB) {dealButton.style.visibility="visible";} else {dealButton.style.visibility="collapse";}
	if (hitButtonB) {hitButton.style.visibility="visible";} else {hitButton.style.visibility="collapse";}
	if (standButtonB) {standButton.style.visibility="visible";} else {standButton.style.visibility="collapse";}
};
checkButtons();

//Define nodes to edit and appendChild to: 
var playerArea = document.querySelector('#playerArea');
var infoArea = document.querySelector('.infoArea');
var dealerArea = document.querySelector('#dealerArea');

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

var dealerFlip = function() {
	dealerTotal=0;
	for (i=0; i<2; i++) {
		dealerTotal=dealerTotal+cardsObj[dealerCards[i]]['cardSum'];
	}
	while (dealerTotal<18) {
		dealerCards.push(Math.floor(Math.random()*numberOfCards));
		var newCardIndex = dealerCards.length-1;
		var dealercardDisplay = document.createElement('div'); // creating div
		dealercardDisplay.className = "dealerCard";
		dealerArea.appendChild(dealercardDisplay);
		dealerTotal=dealerTotal+cardsObj[dealerCards[newCardIndex]]['cardSum'];
	}
	for (i=0; i<dealerCards.length; i++) {
	var dealerCardShow=document.querySelectorAll(".dealerCard");
	dealerCardShow[i].style.backgroundImage="none";
	dealerCardShow[i].innerHTML = cardsObj[dealerCards[i]]["cardNumber"] + " " +cardsObj[dealerCards[i]]["cardSuit"];
	}
};

var totalCheck = function () {
	if (player1Total<16) {player1Status = "You need to Hit till above 15"; 	dealButtonB = false; hitButtonB = true; standButtonB = false;}
	else if (player1Total<21) {player1Status = ""; dealButtonB = false; hitButtonB = true; standButtonB = true;}
	else if (player1Total==21 && playerCards.length==2) {player1Status = "Blackjack!"; dealButtonB = true; hitButtonB = false; standButtonB = false; dealerFlip();}
	else if (player1Total==21) {player1Status = ""; dealButtonB = true; hitButtonB = false; standButtonB = false; dealerFlip();}
	else if (player1Total >21) {player1Status = "Bust!"; dealButtonB = true; hitButtonB = false; standButtonB = false; dealerFlip();}
};

var deal = function () {
	playerCards=[Math.floor(Math.random()*numberOfCards),Math.floor(Math.random()*numberOfCards)];
	dealerCards=[Math.floor(Math.random()*numberOfCards),Math.floor(Math.random()*numberOfCards)];
	clearCards(); //clearing player & dealer area
    player1Total = 0; //setting player1Total to be 0 
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
	infoArea.innerHTML="Your Total is " + player1Total +". "+ player1Status;
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
	infoArea.innerHTML="Your Total is " + player1Total +". "+ player1Status;
	checkButtons();
}

var stand = function () {
	dealButtonB = true;
	hitButtonB = false;
	standButtonB = false;
	checkButtons();
	dealerFlip();
}

//Add event listeners to buttons
hitButton.addEventListener("click",hit);
dealButton.addEventListener("click",deal);
standButton.addEventListener("click",stand);





var dealerCheck = function () {};

