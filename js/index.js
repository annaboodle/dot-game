$(document).ready(function() {
  const $window = $(window);
  const $gameArena = $('.game');
  const $slider = $('.controls__slider')[0];
  const $speed = $('.controls__value')[0];

  let score = 0;
  let gameRunning = false;
  let generateDotInterval;
  let moveDotsInterval;
  let removeDotsInterval;

  const gameWidth = $gameArena.width();

  $speed.innerHTML = $slider.value;

  $slider.addEventListener('input', function() {
    $speed.innerHTML = this.value;
  })

  function generateDot() {
    const randomValue = generateRandomNumber(1, 10);
    const randomSize = (11 - randomValue) * 10;
    const randomStartPosition = generateRandomNumber(0, gameWidth - randomSize);
    const className = 'dot';
    const $dot = $('<div>')
      .addClass(`${className} ${className}--${randomSize}`)
      .css({
        'left': randomStartPosition,
        'width': `${randomSize}px`,
        'height': `${randomSize}px`,
      })
      .click(function() {
        const $clickedDot = $(this);
        $clickedDot.animate(
          { opacity: 0 },
          1000,
          'linear', 
          function() {
            $clickedDot.remove();
          }
        );
        score += randomValue;
        $('.controls__score')[0].innerHTML = score;
      });
    $gameArena.append($dot);
  };

  function generateRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  function moveDots() {
    const speed = $slider.value / 10;
    $('.dot').animate({ top: `+=${speed}` }, 100, 'linear');
  }

  function pauseGame() {
    clearInterval(generateDotInterval);
    clearInterval(moveDotsInterval);
  };

  function startGame() {
    generateDotInterval = setInterval(generateDot, 1000);
    moveDotsInterval = setInterval(moveDots, 100);
    removeDotsInterval = setInterval(removeDots, 1000);
  };

  function removeDots() {
    const screenHeight = window.innerHeight;
    const currentDots =  $('.dot');
    for (let i = 0; i < currentDots.length; i++) {
      if ($(currentDots[i]).offset().top >= screenHeight) {
        $(currentDots[i]).remove();
      }
    }
  }

  function togglePlayPauseState() {
    if (gameRunning) {
      startGame();
    } else {
      pauseGame();
    }
  }

  $('.controls__btn').click(function() {
    gameRunning = !gameRunning;
    this.textContent = gameRunning ? 'Pause' : 'Start';
    $(this).toggleClass('controls__btn--pause');
    togglePlayPauseState();
  })
});