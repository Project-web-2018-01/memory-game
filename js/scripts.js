$(function() {
	var gameDifficulty, itemsOrder, flippedCardCache, lockCardFlipping = false;
	var gamePairItems = ["1.png", "2.png", "3.png", "4.png", "5.png", "6.png", "7.png", "8.png", "9.png", "10.png"];

	$("#easy").click(function() { changeDifficulty("easy") });
	$("#normal").click(function() { changeDifficulty("normal") });
	$("#hard").click(function() { changeDifficulty("hard") });

	function changeDifficulty(level) {
		switch(level) {
			case "easy":
				gameDifficulty = "easy";
				$("#board-size-text").text("Board size: 4x3");
				break;
			case "normal":
				gameDifficulty = "normal";
				$("#board-size-text").text("Board size: 4x4");
				break;
			case "hard":
				gameDifficulty = "hard";
				$("#board-size-text").text("Board size: 5x4");
				break;
		}
	}

	changeDifficulty("easy");

	$("#play-btn").click(function() { startGame(); });

	function startGame() {
		$("#gameStarter").animate({"opacity": 0}, 500, function() {
			$("#gameStarter").css("display", "none");
			setBoard();
			$("#game-container").css("display", "grid");
			$("#game-container").animate({"opacity": 1}, 500);
		});
	}

	function setBoard() {
		switch(gameDifficulty) {
			case "easy":
				var numberOfItems = 12;
				$("#game-container").addClass("grid-easy");
				break;
			case "normal":
				var numberOfItems = 16;
				$("#game-container").addClass("grid-normal");
				break;
			case "hard":
				var numberOfItems = 20;
				$("#game-container").addClass("grid-hard");
				break;
		}
		AddItemsToBoard(numberOfItems);
	}

	function AddItemsToBoard(numberOfItems) {
		var itemsOrder = getItemsOrder(numberOfItems);

		for(var i = 0; i<numberOfItems; i++) {
			var pairId = "pair-"+itemsOrder[i],
			pairImg = "url(images/" + gamePairItems[itemsOrder[i]-1] + ")",

			$item = $("<div>").attr("data-pair-id", pairId).addClass("grid-item"),
			$itemBack = $("<div>").css("background-image", pairImg).addClass("item-back"),
			$itemFront = $("<div>").css("background-image", "url(images/questionmark.png)").addClass("item-front");
			$($item).append($itemBack, $itemFront);
			$item.on('click', function() { 
				revealCard(this); 
			});
			$("#game-container").append($item);
		}
	}

	function getItemsOrder(numberOfItems) {
		var beforeShuffle = [];

		for (var i = 1; i <= numberOfItems/2; i++) {
			beforeShuffle.push(i);
			beforeShuffle.push(i);
		}
		
		itemsOrder = shuffleArray(beforeShuffle);
		return itemsOrder;
	}

	function shuffleArray(array) {
		var j, cache;
		for (var i = array.length-1; i > 0; i--) {
			j = Math.floor(Math.random() * (i - 1));
			cache = array[i];
			array[i] = array[j];
			array[j] = cache;
		}
		return array;
	}

	function revealCard(element) {
		if (flippedCardCache === undefined && !lockCardFlipping) {
			lockCardFlipping = true;
			$(element).addClass("grid-item-flipped");
			flippedCardCache = element;
			lockCardFlipping = false;
		} else if ((typeof flippedCardCache) === 'object' && !lockCardFlipping){
			lockCardFlipping = true;
			var clickedPairId = $(element).data("pair-id");
			$(element).addClass("grid-item-flipped");

			if ($(flippedCardCache).data("pair-id") == clickedPairId) {
				console.log("para!");
				$(element).off('click');
				$(flippedCardCache).off('click');
				flippedCardCache = undefined;
			} else {
				setTimeout(function() {
					$(element).removeClass("grid-item-flipped");
					$(flippedCardCache).removeClass("grid-item-flipped");
					flippedCardCache = undefined;
				}, 1000);
			}

			setTimeout(function() { lockCardFlipping = false; }, 1000);
		}
	}
});



























































/*
var cards = ["ciri.png", "geralt.png", "jaskier.png", "jaskier.png", "iorweth.png", "triss.png", "geralt.png", "yen.png", "ciri.png", "triss.png", "yen.png", "iorweth.png"];

//alert(cards[4]);

//console.log(cards);

var c0 = document.getElementById('c0');
var c1 = document.getElementById('c1');
var c2 = document.getElementById('c2');
var c3 = document.getElementById('c3');

var c4 = document.getElementById('c4');
var c5 = document.getElementById('c5');
var c6 = document.getElementById('c6');
var c7 = document.getElementById('c7');

var c8 = document.getElementById('c8');
var c9 = document.getElementById('c9');
var c10 = document.getElementById('c10');
var c11 = document.getElementById('c11');

c0.addEventListener("click", function() { revealCard(0); });
c1.addEventListener("click", function() { revealCard(1); });
c2.addEventListener("click", function() { revealCard(2); });
c3.addEventListener("click", function() { revealCard(3); });

c4.addEventListener("click", function() { revealCard(4); });
c5.addEventListener("click", function() { revealCard(5); });
c6.addEventListener("click", function() { revealCard(6); });
c7.addEventListener("click", function() { revealCard(7); });

c8.addEventListener("click", function() { revealCard(8); });
c9.addEventListener("click", function() { revealCard(9); });
c10.addEventListener("click", function() { revealCard(10); });
c11.addEventListener("click", function() { revealCard(11); });

var oneVisible = false;
var turnCounter = 0;
var visible_nr;
var lock = false;
var pairsLeft = 6;

function revealCard(nr)
{
	var opacityValue = $('#c'+nr).css('opacity');
	
	//alert('Opacity: '+opacityValue);
	
	if (opacityValue != 0 && lock == false)
	{
		lock = true;
		
		//alert(nr);
	
		var obraz = "url(images/" + cards[nr] + ")";
		
		$('#c'+nr).css('background-image', obraz);
		$('#c'+nr).addClass('cardA');
		$('#c'+nr).removeClass('card');
		
		if(oneVisible == false)
		{
			//first card
			
			oneVisible = true;
			visible_nr = nr;
			lock = false;
		}
		else
		{
			//second card
			
			if(cards[visible_nr] == cards[nr])
			{
				//alert("para");
				
				setTimeout(function() { hide2Cards(nr, visible_nr) }, 750);
				
			}
			else
			{
				//alert("pudło");
				
				setTimeout(function() { restore2Cards(nr, visible_nr) }, 1000);
			}
			
			turnCounter++;
			$('.score').html('Turn counter: '+turnCounter);
			oneVisible = false;
		}
		
	}
	
}

function hide2Cards(nr1, nr2)
{
	$('#c'+nr1).css('opacity', '0');
	$('#c'+nr2).css('opacity', '0');
	
	pairsLeft--;
	
	if(pairsLeft == 0)
	{
		$('.board').html('<h1>You win!<br>Done in '+turnCounter+' turns</h1>');
	}
	
	lock = false;
}

function restore2Cards(nr1, nr2)
{
	$('#c'+nr1).css('background-image', 'url(../images/karta.png)');
	$('#c'+nr1).addClass('card');
	$('#c'+nr1).removeClass('cardA');	

	$('#c'+nr2).css('background-image', 'url(../images/karta.png)');
	$('#c'+nr2).addClass('card');
	$('#c'+nr2).removeClass('cardA');
	
	lock = false;
}
*/

