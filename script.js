//*Define global variables 
var cardsObjG = [];
var cardsObj = [];
var numberOfCards=52;
var cardSum=1;
var cardNumber = "A";
var cardSuit = "&spades";
var player1Total = 0;
var player1AltTotal = 0;
var player1AltTotalText = "";
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
var numbers = [];

//function to reset variables when dealing
var clearVariables = function () {
	player1AltTotal = 0;
	player1AltTotalText = "";
	player1Status = "";
	player1Total = 0;
	player1Status = "";
	dealerTotal = 0;
	dealerStatus = "";
	dealerTotalText = "";
	playerScore = 0;
	dealerScore = 0;
	winStatus = "";
	dealerCards=[];
	playerCards=[];
	numbers=[];
	for (i=0;i<52;i++) {numbers.push(i);}
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
var displayStash = function () {stashInfo.innerHTML="You have $"+ stash;};
displayStash();

//*****Generic Deck Creation***//
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
	if (dealerTotal==21 && dealerCards.length==2) {dealerStatus = "Dealer hit blackjack! "; dealerScore=100; console.log("updated Dealer status");}
	else if (dealerTotal<21 && dealerCards.length==5) {dealerStatus = "Dealer has 5 cards & less than 21! "; dealerScore=99; console.log("updated Dealer status");}
	else if (dealerTotal<22) {dealerScore = dealerTotal; console.log("updated Dealer status");}
	else if (dealerTotal >21) {dealerStatus = "Dealer has gone bust! "; dealerScore = 0; console.log("updated Dealer status");};
};

var updateWinStatus = function() {
		console.log("Update Win Status function ran - Player score: " +playerScore + ". Dealer score: " + dealerScore);
		if (playerScore<dealerScore) {winStatus = "Dealer wins! You lost $" + bet + "."; console.log("updated win status: " + winStatus);}
		else if (playerScore==dealerScore) {winStatus = "Tie!"; stash = stash + bet; displayStash(); console.log("updated win status: " + winStatus);}
		else {winStatus = "You won $"+bet+"!"; stash = stash + bet*2; displayStash();  console.log("updated win status: " + winStatus);}
};

var dealerHit = function() {
	while (dealerTotal<playerScore && playerScore<22 || dealerTotal<12) {
		dealerCards.push(numbers[Math.floor(Math.random()*numbers.length)]);
		var newCardIndex = dealerCards.length-1;
		numbers.splice(numbers.indexOf(dealerCards[newCardIndex]),1);
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
		cardSpacing(dealerCardShow[i],dealerCards[i]);
	}
	updateDealerStatus();
	updateWinStatus();
	infoArea.innerHTML="Your Total is " + player1Total +". "+ player1Status + dealerTotalText + dealerStatus + winStatus;
};

var playerAceCheck =function() {
	for (i=0; i<playerCards.length;i++) {
		if (playerCards[i]%13 == 0) {
			player1AltTotal=player1Total-10;
			player1AltTotalText = " or "+player1AltTotal;	
		}
	}
}

var totalCheck = function () {
	if (player1Total<16) {player1Status = "You need to Hit till above 15."; 	dealButtonB = false; hitButtonB = true; standButtonB = false; infoArea.innerHTML="Your Total is " + player1Total +player1AltTotalText +". "+ player1Status;}
	else if (player1Total==21 && playerCards.length==2) {player1Status = "You hit BlackJack! "; dealButtonB = true; hitButtonB = false; standButtonB = false; playerScore = 100; dealerFlip();}
	else if (player1Total<22 && playerCards.length==5) {player1Status = "You got 5 cards under 21! "; dealButtonB = true; hitButtonB = false; standButtonB = false; playerScore = 99; dealerFlip();}
	else if (player1AltTotal>0 && player1AltTotal<22 && playerCards.length==5) {player1Total=player1AltTotal; player1Status = "You got 5 cards under 21! "; dealButtonB = true; hitButtonB = false; standButtonB = false; playerScore = 99; dealerFlip();}
	else if (player1Total<22) {player1Status = ""; dealButtonB = false; hitButtonB = true; standButtonB = true; playerScore = player1Total; infoArea.innerHTML="Your Total is " + player1Total +player1AltTotalText +". "+ player1Status;}
	else if (player1AltTotal>0 && player1AltTotal<22) {player1Status = ""; dealButtonB = false; hitButtonB = true; standButtonB = true; playerScore = player1AltTotal; infoArea.innerHTML="Your Total is " + player1AltTotal +". "+ player1Status;}
	else if (player1Total >21 && player1AltTotal==0) {player1Status = "You have gone bust! "; dealButtonB = true; hitButtonB = false; standButtonB = false; playerScore = 0; dealerFlip();}
	else if (player1AltTotal>21) {player1Total=player1AltTotal; player1Status = "You have gone bust! "; dealButtonB = true; hitButtonB = false; standButtonB = false; playerScore = 0; dealerFlip();}
};

var cardSpacing = function(doms,pc) {
	//if 10
	if (pc==9 || pc == 22 || pc == 35 ||pc == 48) {
		doms.innerHTML = cardsObj[pc]["cardNumber"] + " &nbsp;  &nbsp; &nbsp; &nbsp; &nbsp;" +cardsObj[pc]["cardSuit"];
	//if Q or K	
	} else if (pc==11 || pc == 24 || pc == 37 ||pc == 50 || pc==12 || pc == 25 || pc == 38 ||pc == 51) {
		doms.innerHTML = cardsObj[pc]["cardNumber"] + " &nbsp;  &nbsp; &nbsp; &nbsp; &nbsp;" +cardsObj[pc]["cardSuit"];
	} else {
		doms.innerHTML = cardsObj[pc]["cardNumber"] + " &nbsp;  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;" +cardsObj[pc]["cardSuit"];
	}
}

var deal = function () {
	clearVariables();
	clearCards();
	for (i=0; i<2;i++) {
		//get a random number out of 52 and remove that number from a list of 52 
		playerCards.push(numbers[Math.floor(Math.random()*numbers.length)]);
		numbers.splice(numbers.indexOf(playerCards[i]),1);
		dealerCards.push(numbers[Math.floor(Math.random()*numbers.length)]);
		numbers.splice(numbers.indexOf(dealerCards[i]),1);
		// cycling through playerCards
		var cardDisplay = document.createElement('div'); // creating div
		cardDisplay.className = "playingCard";
		cardSpacing(cardDisplay,playerCards[i]);
		playerArea.appendChild(cardDisplay);
		player1Total=player1Total+cardsObj[playerCards[i]]['cardSum']; // obatin player1Total
		var dealercardDisplay = document.createElement('div'); // creating div
		dealercardDisplay.className = "dealerCard";
		dealerArea.appendChild(dealercardDisplay);
	}
	playerAceCheck();
	totalCheck(); // optains player1Status & update buttonStatus
	checkButtons(); // update button visibility
}

var hit = function () {
	playerCards.push(numbers[Math.floor(Math.random()*numbers.length)]);
	var newCardIndex = playerCards.length-1;
	numbers.splice(numbers.indexOf(playerCards[newCardIndex]),1);
	var cardDisplay = document.createElement('div'); // creating div
	cardDisplay.className = "playingCard";
	cardSpacing(cardDisplay,playerCards[newCardIndex]);
	playerArea.appendChild(cardDisplay);
	console.log(player1Total+" + "+cardsObj[playerCards[newCardIndex]]['cardSum']);
	player1Total=player1Total+cardsObj[playerCards[newCardIndex]]['cardSum'];
	playerAceCheck();
	totalCheck();
	checkButtons();

}

var stand = function () {
	totalCheck();
	dealButtonB = true;
	hitButtonB = false;
	standButtonB = false;
	if (player1AltTotal>0 && player1Total>21) {
		player1Total=player1AltTotal;
	}
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