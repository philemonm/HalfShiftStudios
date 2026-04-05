(function (globalScope) {
  "use strict";

  var DIRECTIONS = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 }
  };

  function createInitialSnake(columns, rows) {
    var startX = Math.floor(columns / 2);
    var startY = Math.floor(rows / 2);

    return [
      { x: startX, y: startY },
      { x: startX - 1, y: startY },
      { x: startX - 2, y: startY }
    ];
  }

  function cloneSegments(segments) {
    return segments.map(function (segment) {
      return { x: segment.x, y: segment.y };
    });
  }

  function samePoint(a, b) {
    return a.x === b.x && a.y === b.y;
  }

  function createFood(snake, columns, rows, randomFn) {
    var freeCells = [];
    var x;
    var y;

    for (y = 0; y < rows; y += 1) {
      for (x = 0; x < columns; x += 1) {
        if (!snake.some(function (segment) { return segment.x === x && segment.y === y; })) {
          freeCells.push({ x: x, y: y });
        }
      }
    }

    if (freeCells.length === 0) {
      return null;
    }

    return freeCells[Math.floor(randomFn() * freeCells.length)];
  }

  function createState(options, randomFn) {
    var settings = options || {};
    var columns = settings.columns || 16;
    var rows = settings.rows || 16;
    var rng = randomFn || Math.random;
    var snake = cloneSegments(settings.snake || createInitialSnake(columns, rows));

    return {
      columns: columns,
      rows: rows,
      snake: snake,
      direction: settings.direction || "right",
      food: settings.food || createFood(snake, columns, rows, rng),
      score: settings.score || 0,
      status: settings.status || "ready"
    };
  }

  function isOppositeDirection(currentDirection, nextDirection) {
    return (
      (currentDirection === "up" && nextDirection === "down") ||
      (currentDirection === "down" && nextDirection === "up") ||
      (currentDirection === "left" && nextDirection === "right") ||
      (currentDirection === "right" && nextDirection === "left")
    );
  }

  function applyDirection(state, nextDirection) {
    if (!DIRECTIONS[nextDirection]) {
      return state;
    }

    if (isOppositeDirection(state.direction, nextDirection) && state.snake.length > 1) {
      return state;
    }

    return Object.assign({}, state, { direction: nextDirection });
  }

  function getNextHead(state) {
    var currentHead = state.snake[0];
    var movement = DIRECTIONS[state.direction];

    return {
      x: currentHead.x + movement.x,
      y: currentHead.y + movement.y
    };
  }

  function hitsBoundary(point, state) {
    return point.x < 0 || point.y < 0 || point.x >= state.columns || point.y >= state.rows;
  }

  function hitsSnake(point, snake) {
    return snake.some(function (segment) {
      return samePoint(segment, point);
    });
  }

  function stepGame(state, randomFn) {
    var rng = randomFn || Math.random;
    var nextHead;
    var nextSnake;
    var ateFood;
    var food;

    if (state.status === "gameover" || state.status === "paused") {
      return state;
    }

    nextHead = getNextHead(state);
    ateFood = state.food ? samePoint(nextHead, state.food) : false;
    nextSnake = [nextHead].concat(cloneSegments(state.snake));

    if (!ateFood) {
      nextSnake.pop();
    }

    if (hitsBoundary(nextHead, state) || hitsSnake(nextHead, nextSnake.slice(1))) {
      return Object.assign({}, state, { status: "gameover" });
    }

    food = ateFood ? createFood(nextSnake, state.columns, state.rows, rng) : state.food;

    return {
      columns: state.columns,
      rows: state.rows,
      snake: nextSnake,
      direction: state.direction,
      food: food,
      score: state.score + (ateFood ? 1 : 0),
      status: food ? "running" : "won"
    };
  }

  function togglePause(state) {
    if (state.status === "ready") {
      return Object.assign({}, state, { status: "running" });
    }

    if (state.status === "running") {
      return Object.assign({}, state, { status: "paused" });
    }

    if (state.status === "paused") {
      return Object.assign({}, state, { status: "running" });
    }

    return state;
  }

  var api = {
    DIRECTIONS: DIRECTIONS,
    applyDirection: applyDirection,
    createFood: createFood,
    createState: createState,
    getNextHead: getNextHead,
    isOppositeDirection: isOppositeDirection,
    stepGame: stepGame,
    togglePause: togglePause
  };

  globalScope.SnakeLogic = api;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
}(typeof window !== "undefined" ? window : globalThis));
