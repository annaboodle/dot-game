const slider = $(".speed__slider")[0];
const speed = $(".speed__value")[0];
let score = 0;
let gameRunning = false;
let generateDotInterval;
let moveDotsInterval;
let removeDotsInterval;

const gameArena = $(".game");
const gameWidth = gameArena.width();

let focusLost = false;
const $window = $(window);

speed.innerHTML = slider.value;

slider.oninput = function() {
  speed.innerHTML = this.value;
}

function generateDot(){

	// generate random size for dot (in pixels)
	const randomValue = generateRandom(1,10);
	const randomSize = (11 - randomValue) * 10;

	// generate random x-axis start position that won't "hang" off the edge
	const randomStartPosition = generateRandom(0, gameWidth - randomSize);

	const className = "dot";

	const dot = $("<div>")
		.addClass(className + " " + className + "--" + randomSize)
		.css({
			"left": randomStartPosition,
			"width": randomSize + "px",
			"height": randomSize + "px",
		})
		.click(function() {
			const clickedDot = $(this);
			clickedDot.animate({
					width: 0,
					height: 0,
				},
				100,
				"linear",
				function() { 
					clickedDot.remove(); 
				}
			);

			score += randomValue;
			$(".controls__score")[0].innerHTML = score;
		});

	gameArena.append(dot);

};

function generateRandom(min, max){

	const randomNum = Math.floor(Math.random()*(max-min+1)+min);
	return randomNum;

};

function moveDots(){

	const speed = slider.value;

	$(".dot")
		.animate({
			top: "+=" + speed,
		}, 
		1000, 
		"linear"
	);

}

function pauseGame(){

	clearInterval(generateDotInterval);
	clearInterval(moveDotsInterval);

};

function startGame(){

	generateDotInterval = setInterval(generateDot, 1000);
	moveDotsInterval = setInterval(moveDots, 1000);
	removeDotsInterval = setInterval(removeDots, 1000);

};

// remove dots from DOM when they exit the viewport
function removeDots() {

	const screenHeight = window.innerHeight;
	const currentDots =  $(".dot");

	for(i=0; i<currentDots.length; i++){
		if ($(currentDots[i]).offset().top >= screenHeight){
			$(currentDots[i]).remove();
		}
	}

}

function updateGame() {

	if (gameRunning){
		startGame();
	} else {
		pauseGame();
	}

}

$(document).ready(function() {

	$(".controls__btn").click(function() {

		gameRunning = !gameRunning;

		this.textContent = gameRunning ? "Pause" : "Start";

		$(this).toggleClass("controls__btn--pause");

		updateGame();

	});

});

function pauseOnFocusLost() {
	if (gameRunning){
		focusLost = true;
		pauseGame();
	} 
}

function startOnFocusReturn() {
	if (gameRunning && focusLost){
		startGame();
	} 
}

// pause game when focus on window is lost
$window.on("blur", 
	pauseOnFocusLost
)

// restart game when focus returns
$window.on("focus", 
	startOnFocusReturn
)