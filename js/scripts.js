$(function() {
	var gameDifficulty, itemsOrder, flippedCardCache, lockCardFlipping = false , pairsLeft;
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
		pairsLeft = numberOfItems / 2;
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
			$(element).addClass("grid-item-flipped").off('click'); // prevent clicking the same card twice
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
				animateCardPick(true, element, flippedCardCache);
				flippedCardCache = undefined;
				pairsLeft--;
			} else {
				animateCardPick(false, element, flippedCardCache);
				setTimeout(function() {
					$(element).removeClass("grid-item-flipped");
					$(flippedCardCache).removeClass("grid-item-flipped");
					flippedCardCache = undefined;
				}, 1200);
			}

			setTimeout(function() { lockCardFlipping = false; }, 1250);

			$(flippedCardCache).on('click', function() { // prevent clicking the same card twice
				revealCard(this); 
			});
			checkGameEnd();
		}
	}

	function animateCardPick(matchingPair, element1, element2) {
		if (matchingPair) {
			$(element1).addClass("card-pick-animation-matching");
			$(element2).addClass("card-pick-animation-matching");
			setTimeout(function() {
				$(element1).addClass("matched-pairs");
				$(element2).addClass("matched-pairs");
			}, 1450);
		} else {
			$(element1).addClass("card-pick-animation-not-matching");
			$(element2).addClass("card-pick-animation-not-matching");
			setTimeout(function() {
				$(element1).removeClass("card-pick-animation-not-matching");
				$(element2).removeClass("card-pick-animation-not-matching");
			}, 1400);
		}
	}

	function checkGameEnd() {
		
	}
});