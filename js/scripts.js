$(function() {
	/*

	var gameDifficulty, itemsOrder, flippedCardCache, lockCardFlipping = false , pairsLeft;
	var gamePairItems = ["1.png", "2.png", "3.png", "4.png", "5.png", "6.png", "7.png", "8.png", "9.png", "10.png"];

	*/
	var basicGameObject = {
		gameDifficulty: "easy",
		itemsOrder: null,
		flippedCardCache: undefined,
		lockCardFlipping: false,
		pairsLeft: null,
		gamePairItems: ["1.png", "2.png", "3.png", "4.png", "5.png", "6.png", "7.png", "8.png", "9.png", "10.png"]
	};

	var gameObject = basicGameObject;

	$("#easy").click(function() { changeDifficulty("easy") });
	$("#normal").click(function() { changeDifficulty("normal") });
	$("#hard").click(function() { changeDifficulty("hard") });

	function changeDifficulty(level) {
		switch(level) {
			case "easy":
				gameObject.gameDifficulty = "easy";
				$("#board-size-text").text("Board size: 4x3");
				break;
			case "normal":
				gameObject.gameDifficulty = "normal";
				$("#board-size-text").text("Board size: 4x4");
				break;
			case "hard":
				gameObject.gameDifficulty = "hard";
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
		switch(gameObject.gameDifficulty) {
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
		gameObject.pairsLeft = numberOfItems / 2;
		AddItemsToBoard(numberOfItems);
	}

	function AddItemsToBoard(numberOfItems) {
		getItemsOrder(numberOfItems);

		for(var i = 0; i<numberOfItems; i++) {
			var pairId = "pair-"+gameObject.itemsOrder[i],
			pairImg = "url(images/" + gameObject.gamePairItems[gameObject.itemsOrder[i]-1] + ")",

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
		
		gameObject.itemsOrder = shuffleArray(beforeShuffle);
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
		if (gameObject.flippedCardCache === undefined && !gameObject.lockCardFlipping) {
			gameObject.lockCardFlipping = true;
			$(element).addClass("grid-item-flipped").off('click'); // prevent clicking the same card twice
			gameObject.flippedCardCache = element;
			gameObject.lockCardFlipping = false;
		} else if ((typeof gameObject.flippedCardCache) === 'object' && !gameObject.lockCardFlipping){
			gameObject.lockCardFlipping = true;
			var clickedPairId = $(element).data("pair-id");
			$(element).addClass("grid-item-flipped");

			if ($(gameObject.flippedCardCache).data("pair-id") == clickedPairId) {
				console.log("para!");
				$(element).off('click');
				$(gameObject.flippedCardCache).off('click');
				animateCardPick(true, element, gameObject.flippedCardCache);
				gameObject.flippedCardCache = undefined;
				gameObject.pairsLeft--;
			} else {
				animateCardPick(false, element, gameObject.flippedCardCache);
				setTimeout(function() {
					$(element).removeClass("grid-item-flipped");
					$(gameObject.flippedCardCache).removeClass("grid-item-flipped");
					gameObject.flippedCardCache = undefined;
				}, 1200);
			}

			setTimeout(function() { gameObject.lockCardFlipping = false; }, 1250);

			$(gameObject.flippedCardCache).on('click', function() { // prevent clicking the same card twice
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
		if(gameObject.pairsLeft===0) {
			setTimeout(endGame, 1500);
		}
	}

	function endGame() {
		$("#game-container").animate({"opacity": 0}, 500, function() {
			$("#game-container").css("display", "none");
			gameObject = basicGameObject;
			$("#game-container").empty();
			$("#chooseDifficultyP").css("display", "none");
			$("#playAgainP").css("display", "block");
			$("#gameStarter").css("display", "block");
			$("#gameStarter").animate({"opacity": 1}, 500);
		});
	}
});