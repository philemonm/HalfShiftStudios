(function () {
  "use strict";

  var SnakeLogic = window.SnakeLogic;
  var scoreElement = document.getElementById("score");
  var messageElement = document.getElementById("message");
  var boardElement = document.getElementById("board");
  var pauseButton = document.getElementById("pause-button");
  var restartButton = document.getElementById("restart-button");
  var controlButtons = Array.prototype.slice.call(document.querySelectorAll("[data-direction]"));
  var TICK_MS = 140;
  var state = SnakeLogic.createState();
  var cells = [];
  var queuedDirection = null;
  var loopId = null;
  var controlsByKey = {
    ArrowUp: "up",
    ArrowDown: "down",
    ArrowLeft: "left",
    ArrowRight: "right",
    w: "up",
    W: "up",
    a: "left",
    A: "left",
    s: "down",
    S: "down",
    d: "right",
    D: "right"
  };

  function setMessage(text) {
    messageElement.textContent = text;
  }

  function ensureLoop() {
    if (loopId !== null) {
      return;
    }

    loopId = window.setInterval(function () {
      if (queuedDirection) {
        state = SnakeLogic.applyDirection(state, queuedDirection);
        queuedDirection = null;
      }

      state = SnakeLogic.stepGame(state);
      render();

      if (state.status === "gameover" || state.status === "won") {
        stopLoop();
      }
    }, TICK_MS);
  }

  function stopLoop() {
    if (loopId !== null) {
      window.clearInterval(loopId);
      loopId = null;
    }
  }

  function startGame() {
    if (state.status === "ready") {
      state = SnakeLogic.togglePause(state);
    }

    if (state.status === "paused") {
      state = SnakeLogic.togglePause(state);
    }

    if (state.status === "running") {
      ensureLoop();
      render();
    }
  }

  function restartGame() {
    stopLoop();
    queuedDirection = null;
    state = SnakeLogic.createState();
    render();
  }

  function queueDirection(direction) {
    if (!direction || state.status === "gameover" || state.status === "won") {
      return;
    }

    queuedDirection = direction;
    startGame();
  }

  function togglePause() {
    if (state.status === "gameover" || state.status === "won") {
      return;
    }

    state = SnakeLogic.togglePause(state);

    if (state.status === "running") {
      ensureLoop();
    } else {
      stopLoop();
    }

    render();
  }

  function renderBoard() {
    var snakeCells = state.snake.map(function (segment) {
      return segment.x + ":" + segment.y;
    });
    var snakeLookup = Object.create(null);
    var i;

    for (i = 0; i < snakeCells.length; i += 1) {
      snakeLookup[snakeCells[i]] = i === 0 ? "head" : "body";
    }

    cells.forEach(function (cell) {
      var pointKey = cell.dataset.x + ":" + cell.dataset.y;
      cell.className = "cell";

      if (state.food && state.food.x === Number(cell.dataset.x) && state.food.y === Number(cell.dataset.y)) {
        cell.classList.add("cell--food");
      }

      if (snakeLookup[pointKey] === "body") {
        cell.classList.add("cell--snake");
      }

      if (snakeLookup[pointKey] === "head") {
        cell.classList.add("cell--head");
      }
    });
  }

  function render() {
    scoreElement.textContent = String(state.score);
    pauseButton.textContent = state.status === "paused" ? "Resume" : "Pause";

    if (state.status === "ready") {
      setMessage("Press any arrow key or WASD to start.");
    } else if (state.status === "paused") {
      setMessage("Paused. Press Space or Resume to continue.");
    } else if (state.status === "gameover") {
      setMessage("Game over. Press Restart to play again.");
    } else if (state.status === "won") {
      setMessage("Board cleared. Press Restart to play again.");
    } else {
      setMessage("Use arrows or WASD to steer.");
    }

    renderBoard();
  }

  function buildBoard() {
    var row;
    var column;
    var fragment = document.createDocumentFragment();

    boardElement.innerHTML = "";
    cells = [];

    for (row = 0; row < state.rows; row += 1) {
      for (column = 0; column < state.columns; column += 1) {
        var cell = document.createElement("div");
        cell.className = "cell";
        cell.dataset.x = String(column);
        cell.dataset.y = String(row);
        cell.setAttribute("role", "gridcell");
        fragment.appendChild(cell);
        cells.push(cell);
      }
    }

    boardElement.appendChild(fragment);
  }

  document.addEventListener("keydown", function (event) {
    var direction = controlsByKey[event.key];

    if (event.key === " " || event.key === "Spacebar" || event.key === "Space") {
      event.preventDefault();
      togglePause();
      return;
    }

    if (!direction) {
      return;
    }

    event.preventDefault();
    queueDirection(direction);
  });

  controlButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      queueDirection(button.dataset.direction);
    });
  });

  pauseButton.addEventListener("click", togglePause);
  restartButton.addEventListener("click", restartGame);

  buildBoard();
  render();
}());
