// Class definitions
// -------------------------------------------------------------------------------------------------

// Class to handle audio (from loading files to playing them)
class AudioController {
	constructor() {
		// https://freesound.org/people/OwlStorm/sounds/404780/
		this.moveSound = new Audio("assets/sounds/movement.wav");
		this.moveSound.volume = 0.2;
	}

	movement () {
		this.moveSound.play();
	}
};

// Class to handle the whole gameplay
class MainGame {
	constructor(counterElement, gridArray) {
		// Array with all the grid items
		this.gridItems = gridArray;
		this.playerIcon = "<img src=\"assets/images/player-icon.png\" class=\"player-icon\" />";
		this.playerIndex = 0;
		this.enemyIcon = "<img src=\"assets/images/enemy-icon.png\" class=\"enemy-icon\" />";
		this.enemyIndex = Math.floor(Math.random()*35+1);
		this.crossIcon = "<img src=\"assets/images/crossed-path.png\" class=\"cross-icon\" />";
		this.crossIndex = Math.floor(Math.random()*35+1);
		// Array with all the indices of the crossed grid items
		this.crossedIndices = [];
		// Counter of eaten bugs
		this.bugsCounter = 0;
		this.bugsCounterElement = counterElement;
		this.audioController = new AudioController();
	}

	// Method to spawn the player
	spawnPlayer () {
		this.gridItems[this.playerIndex].classList.add("player-grid");
		this.gridItems[this.playerIndex].innerHTML = this.playerIcon;
	}

	// Method to check if the played ate a bug and handle the consequent actions
	eatBug () {
		// If the player collides with the enemy
		if (this.playerIndex===this.enemyIndex) {
			// Put an enemy in a random position of the grid
			this.gridItems[this.enemyIndex].innerHTML = "";
			this.gridItems[this.enemyIndex].classList.remove("enemy-grid");
			this.spawnEnemy();
			// this.gridItems[this.playerIndex].innerHTML = this.playerIcon;
			this.bugsCounter += 1;
			this.bugsCounterElement.innerText = this.bugsCounter;
			this.spawnCross();
			this.gridItems[this.playerIndex].innerHTML = this.playerIcon;
		}
	}

	collideCross () {
		if (this.crossedIndices.indexOf(this.playerIndex)!==-1) {
			alert(`Game Over! You ate ${this.bugsCounter} bugs.\nPress F5 to play again!`)
		}
	}

	spawnCross () {
		this.crossIndex = Math.floor(Math.random()*35+1);
		// Make sure we don't spawn a cross on top of the player or an enemy
		// Purposely don't check if the grid item already has a cross, to give the player\
		// some advantage
		while ( (this.crossIndex===this.playerIndex) || (this.crossIndex===this.enemyIndex) ) {
			this.crossIndex = Math.floor(Math.random()*35+1);
		}
		this.gridItems[this.crossIndex].innerHTML = this.crossIcon;
		this.gridItems[this.crossIndex].classList.add("cross-grid");
		this.crossedIndices.push(this.crossIndex);
	}

	// Method to spawn the enemy at a random location (never in the same grid item\
	// as the player)
	spawnEnemy () {
		this.enemyIndex = Math.floor(Math.random()*35+1);
		// Keep generating a new place to spawn the enemy until it's not where\
		// the player is
		while ( (this.enemyIndex===this.playerIndex)  || (this.crossedIndices.indexOf(this.enemyIndex)!==-1) ) {
			this.enemyIndex = Math.floor(Math.random()*35+1);
		}
		this.gridItems[this.enemyIndex].innerHTML = this.enemyIcon;
		this.gridItems[this.enemyIndex].classList.add("enemy-grid");
	}

	// Method to handle player movement
	direction (event) {
		// For each condition below, check if moving the player in the desired direction doesn't\
		// go out of bounds. If it doesn't, then move the player icon to the new grid item: remove\
		// the image and relative HTML class from the current grid item and put them in the grid\
		// item the player moves to. Movement also involves updating the `playerIndex`\
		// approppriately, as well as playing a sound effect

		// If the player presses the left arrow and moving left doesn't go out of bounds, then\
		// move the player one space left
		if ( (event.keyCode==37) && ([-1, 5, 11, 17, 23, 29].indexOf(this.playerIndex-1)===-1 ) ) {
			this.gridItems[this.playerIndex].classList.remove("player-grid");
			this.gridItems[this.playerIndex].innerHTML = "";
			this.audioController.movement();
			this.playerIndex -= 1;
			this.gridItems[this.playerIndex].classList.add("player-grid");
			this.gridItems[this.playerIndex].innerHTML = "<img src=\"assets/images/player-icon.png\" class=\"player-icon\" />";
		}
		// If the player presses the up arrow and moving up doesn't go out of bounds, then\
		// move the player one space up
		else if ( (event.keyCode==38) && ((this.playerIndex-6)>=0) ) {
			this.gridItems[this.playerIndex].classList.remove("player-grid");
			this.gridItems[this.playerIndex].innerHTML = "";
			this.audioController.movement();
			this.playerIndex -= 6;
			this.gridItems[this.playerIndex].classList.add("player-grid");
			this.gridItems[this.playerIndex].innerHTML = "<img src=\"assets/images/player-icon.png\" class=\"player-icon\" />";
		}
		// If the player presses the right arrow and moving right doesn't go out of bounds, then\
		// move the player one space right
		else if ( (event.keyCode==39) && ([6, 12, 18, 24, 30, 36].indexOf(this.playerIndex+1)===-1 ) ) {
			this.gridItems[this.playerIndex].classList.remove("player-grid");
			this.gridItems[this.playerIndex].innerHTML = "";
			this.audioController.movement();
			this.playerIndex += 1;
			this.gridItems[this.playerIndex].classList.add("player-grid");
			this.gridItems[this.playerIndex].innerHTML = "<img src=\"assets/images/player-icon.png\" class=\"player-icon\" />";
		}
		// If the player presses the down arrow and moving down doesn't go out of bounds, then\
		// move the player one space down
		else if ( (event.keyCode==40) && ((this.playerIndex+6) <= 35) ) {
			this.gridItems[this.playerIndex].classList.remove("player-grid");
			this.gridItems[this.playerIndex].innerHTML = "";
			this.audioController.movement();
			this.playerIndex += 6;
			this.gridItems[this.playerIndex].classList.add("player-grid");
			this.gridItems[this.playerIndex].innerHTML = "<img src=\"assets/images/player-icon.png\" class=\"player-icon\" />";
		}

		// Check if the player ate a bug (the player moved to a grid item where there was a bug)
		this.eatBug();
		this.collideCross();
	}

}


// Main functions
// --------------------------------------------------------------------------------------------------------

// This function puts the script up and running
function ready() {
	// Get an array with all the grid items' HTML
	let gridArray = Array.from(document.getElementsByClassName("grid-item"));
	// Get the element with the counter of bugs eaten
	let counterElement = document.getElementById("eaten-counter");
	// Create an object of the class responsible for handling the whole game
	var gameplayClass = new MainGame(counterElement, gridArray);
	// Spawn the player (top left corner)
	gameplayClass.spawnPlayer();
	// Spawn the first enemy
	gameplayClass.spawnEnemy();
	// Cross off the first grid item
	gameplayClass.spawnCross();
	// Add an event listener to the document so that we can call a function to take handle\
	// player movement using keyboard inputs
	document.addEventListener("keydown", gameplayClass.direction.bind(gameplayClass));
}

// ------------------------------------------------------------------------------------------------------------

// Wait for the DOM to load to run this script
// If the HTML content is still loading
if (document.readyState === "loading") {
	// Then add an event listener which is triggered when all\ 
	// the HTML is loaded and calls the `ready()` function
	document.addEventListener("DOMContentLoaded", ready());
}
// Otherwise, call `ready()`
else {
	ready();
}