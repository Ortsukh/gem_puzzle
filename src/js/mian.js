import NPuzzleSolver from "../solver/NPuzzleSolver.js";
import AStar from "../algorithm/aStar.js";
import State from "../algorithm/State.js";


let arrterm = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0]


let sol = []



let field = document.createElement("div");
field.className = "field";
const menu = document.createElement("div");
menu.className = "menu ";


let solution;
let cellSize = 100;
let sizeG;
let sizeFor = 4;
let numbers;
let cells = [];
let digitGame;
let intervalID;
let solveArr = [
  [],
  [],
  [],
  []
];
let solveArr1 = []
let index = 0
let menuContent = `<section id='new_game'>New Game</section>
`;
const buttonSolution = document.createElement("div");
buttonSolution.className = "buttonMute";
const lockedScreen = document.createElement("div");
lockedScreen.className = "menu_active ";
buttonSolution.innerText = 'Solution'
menu.innerHTML = menuContent;
menu.onclick = function () {
  field.innerHTML = " ";
  cells = [];
  sizeG = 4;
  solution = null;
  digitGame = true;
  solveArr = [
    [],
    [],
    [],
    []
  ];
  index = 0
  createDesk(sizeFor);
  clearInterval(intervalID);
  buttonSolution.addEventListener("click", solveListener1);
  buttonSolution.classList.remove("buttonMute_active")
  lockedScreen.classList.remove("menu_active_unlock")


};
const body = document.querySelector("body");
body.append(menu, lockedScreen, field, buttonSolution, );

function solveListener() {
  buttonSolution.classList.add("buttonMute_active")
  lockedScreen.classList.add("menu_active_unlock")
  for (let i = 0; i < sizeG; i++) {
    for (let j = 0; j < sizeG; j++) {
      if (cells.find(e => e.left === j && e.top === i).value === 16) {
        solveArr[i].push("")
      } else {
        solveArr[i].push(cells.find(e => e.left === j && e.top === i).value)
      }
    }
  }
  solution = new NPuzzleSolver(solveArr).solve();
  intervalID = setInterval(() => intervalSolve(), 500);
}
function solveListener1() {
  buttonSolution.classList.add("buttonMute_active")
  lockedScreen.classList.add("menu_active_unlock")
  for (let i = 0; i < sizeG; i++) {
    for (let j = 0; j < sizeG; j++) {
      if (cells.find(e => e.left === j && e.top === i).value === 16) {
        solveArr1.push(0)
      } else {
        solveArr1.push(cells.find(e => e.left === j && e.top === i).value)
      }
    }
  }
  console.log(solveArr1);
const astar = new AStar(sizeG, arrterm);
const arrOfTiles = astar.search(new State(null, solveArr1));

for(let i = 0; i < arrOfTiles.length-1; i++){
  const j = i + 1;
  const oldEmptyIndex = arrOfTiles[i].indexOf(0);
  const number = arrOfTiles[j][oldEmptyIndex];
  sol.push(number)
}
intervalID = setInterval(() => intervalSolve(), 500);

 console.log(sol);
}

function intervalSolve() {
  buttonSolution.removeEventListener("click", solveListener);
  move(cells.findIndex(e => e.value === sol[index]));

  index++
}

function createNumber() {
  let numbersArr = [...Array(15).keys()]
    .map((x) => x + 1)
    .sort(() => Math.random() - 0.5);
  if (!isSolution(numbersArr)) {
    [numbersArr[0], numbersArr[1]] = [numbersArr[1], numbersArr[0]];
  }
  return numbersArr;
}

function move(index, size = 4) {
  const cell = cells[index];
  const empty = cells[size ** 2 - 1];
  const leftDiff = Math.abs(empty.left - cell.left);
  const topDiff = Math.abs(empty.top - cell.top);
  if (leftDiff + topDiff > 1) {
    return;
  }
  cell.element.style.left = `${
    empty.left * (cellSize + 20 / size) + 20 / size
  }px`;
  cell.element.style.top = `${
    empty.top * (cellSize + 20 / size) + 20 / size
  }px`;
  empty.element.style.left = `${
    cell.left * (cellSize + 20 / size) + 20 / size
  }px`;
  empty.element.style.top = `${
    cell.top * (cellSize + 20 / size) + 20 / size
  }px`;
  const emptyLeft = empty.left;
  const emptyTop = empty.top;
  empty.left = cell.left;
  empty.top = cell.top;
  cell.left = emptyLeft;
  cell.top = emptyTop;

  const isFinished = cells.every((cell) => {

    return cell.value === cell.top * size + cell.left + 1;
  });

  empty.element.classList.remove("trueEl");
  if (isFinished) {
    alert(
      `You win`
    );
  }

}

function isSolution(arr) {

  let kDisorder = 0
  for (let i = 1, len = arr.length; i < len; i++) {
    for (let j = i - 1; j >= 0; j--) {
      if (arr[j] > arr[i]) kDisorder++;
    }
  }

  return !(kDisorder % 2);
}

function createDesk(size) {
  numbers = createNumber();
  let currentItem;
  const cellEmpty = document.createElement("div");
  cellEmpty.className = "cell_empty";
  const empty = {
    value: size ** 2,
    top: size - 1,
    left: size - 1,
    element: cellEmpty,
  };

  cellEmpty.style.left = `${(size - 1) * (cellSize + 20 / size) + 20 / size}px`;
  cellEmpty.style.top = `${(size - 1) * (cellSize + 20 / size) + 20 / size}px`;
  cellEmpty.style.width = `${cellSize}px`;
  cellEmpty.style.height = `${cellSize}px`;
  field.append(cellEmpty);
  cellEmpty.addEventListener("drop", function (e) {
    e.preventDefault();

    move(currentItem, size);
  });
  cellEmpty.addEventListener("dragover", function (e) {
    e.preventDefault();
  });
  cellEmpty.addEventListener("dragenter", function () {
    const cell = cells[currentItem];

    const leftDiff = Math.abs(empty.left - cell.left);
    const topDiff = Math.abs(empty.top - cell.top);
    if (leftDiff + topDiff > 1) {
      cellEmpty.classList.add("falseEl");
    } else {
      cellEmpty.classList.add("trueEl");
    }
  });
  cellEmpty.addEventListener("dragleave", function () {
    cellEmpty.classList.remove("trueEl");
    cellEmpty.classList.remove("falseEl");
  });
  for (let i = 0; i < size ** 2 - 1; i++) {
    const cell = document.createElement("div");

    cell.setAttribute("draggable", "true");
    cell.className = "cell";
    const value = numbers[i];

    const left = i % size;
    const top = (i - left) / size;
    cells.push({
      value: value,
      left: left,
      top: top,
      element: cell,
    });
    cell.style.width = `${cellSize}px`;
    cell.style.height = `${cellSize}px`;
    if (digitGame) {
      cell.innerHTML = value;
      if (window.innerWidth < 400) {
        cell.style.fontSize = `${50 - size * 3}px`;
      } else {
        cell.style.fontSize = `${50 - size}px`;
      }
      cell.style.left = `${left * (cellSize + 20 / size) + 20 / size}px`;
      cell.style.top = `${top * (cellSize + 20 / size) + 20 / size}px`;
    }
    field.append(cell);
    cell.addEventListener("click", () => {
      move(i, size);
    });
    cell.addEventListener("dragstart", function () {
      cell.classList.add("active");
      currentItem = i;
    });

    cell.addEventListener("drag", function () {});
    cell.addEventListener("dragend", function () {
      cell.classList.remove("active");
      cellEmpty.classList.remove("falseEl");
    });
  }
  cells.push(empty);
}
