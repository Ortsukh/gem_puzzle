import State from "./State.js";

export default class AStar {
  constructor(fieldSize, terminateState) {
    this.sideSize = fieldSize;
    this.size = this.sideSize * this.sideSize;
    this.terminateState = terminateState;
    this.actions = [-this.sideSize, this.sideSize, -1, 1];
  }

  /**
   * Применяет алгоритм А* для поиска крадчайшего пути до терминального
   * состоянияот указанного.
   * @param startState - начальное состояние.
   * @return последовательность состояний от заданного до терминального.
   */
  search(state) {
    const startState = state;
    const close = [];
    const open = [];
    open.push(startState);
    startState.g = 0;
    startState.h = this.getH(startState);
    while (open.length !== 0) {
      const x = this.getStateWithMinF(open);
      if (this.isTerminate(x)) {

        return this.completeSolution(x);
      }
      open.splice(open.indexOf(x), 1);
      close.push(x.hash);
      const neighbors = this.getNeighbors(x);
      // eslint-disable-next-line no-restricted-syntax
      for (const neighbor of neighbors) {
        if (close.includes(neighbor.hash)) {
          continue;
        }
        const g = x.g + this.getDistance(x, neighbor);
        let isGBetter;
        if (!open.find((item) => item.equals(neighbor))) {
          neighbor.h = this.getH(neighbor);
          open.push(neighbor);
          isGBetter = true;
        } else {
          isGBetter = g < neighbor.g;
        }
        if (isGBetter) {
          neighbor.parent = x;
          neighbor.g = g;
        }
      }
    }
    return null;
  }

  /**
   * Находит вершину в списке open с наименьшим значением веса.
   *
   * @param open список открытых вершин.
   * @return вершину с наименьшим весом.
   */
  getStateWithMinF(open) {
    return open.reduce((i, ac) => (i.getF() < ac.getF() ? i : ac));
  }

  completeSolution(terminate) {
    const path = [];
    let c = terminate;
    while (c != null) {
      path.unshift(c.field);
      c = c.parent;
    }
    return path;
  }

  isTerminate(state) {
    return this.terminateState.toString() === state.hash;
  }

  /**
   * Подсчитывает количество родительских сотояний от a до b.
   *
   * @param a
   *            первое состояние. Должно быть среди состояний, предшествующих
   *            b.
   * @param b
   *            второе состояние.
   * @return количество переходов от a до b.
   */
  getDistance(a, b) {
    let c = b;
    let res = 0;
    while (c != null && !c.equals(a)) {
      c = c.parent;
      res++;
    }
    return res;
  }

  /**
   * Эвристика вычисляется как Manhattan distance и last move
   */
  manh_dst_matrix(a, b) {
    return (
      Math.abs((a % this.sideSize) - (b % this.sideSize)) +
      Math.abs(Math.floor(a / this.sideSize) - Math.floor(b / this.sideSize))
    );
  }

  getManh_dst(state) {
    let res = 0;
    let row = false;
    let col = true;
    state.field.forEach((number, i) => {
      if (number === this.size - 1) {
        // находим число 15
        if (Math.floor(i / this.sideSize) === this.sideSize - 1) {
          row = true; // если число 15 находится в последнем (нижнем ряду), то true
        }
      } else if (number === this.size - this.sideSize) {
        // находим число 12
        if (i % this.sideSize === this.sideSize - 1) {
          col = true; // если число 12 находится в последнем (правом столбце), то true
        }
      }
      res += this.manh_dst_matrix((number - 1) % this.size, i);
    });
    if (!row && !col) res += 2;
    return res;
  }

  last_move(state) {
    let row = false;
    let col = false;
    if (
      Math.floor(state.field.indexOf(this.size - 1) / this.sideSize) ===
      this.sideSize - 1
    ) {
      row = true; // если число 15 находится в последнем (нижнем ряду), то true
    }
    if (
      state.field.indexOf(this.size - this.sideSize) % this.sideSize ===
      this.sideSize - 1
    ) {
      col = true; // если число 12 находится в последнем (правом столбце), то true
    }
    if (!row || !col) {
      return 2; // если и 15, и 12 находятся не в своем ряду (столбце), то прибавляем 2
    }
    return 0;
  }

  getH(state) {
    return this.getManh_dst(state);
  }

  getNeighbors(currentState) {
    const res = [];
    this.actions.forEach((action) => {
      const field = this.doAction(currentState.field, action);
      if (field == null) {
        return;
      }
      const state = new State(currentState, field);
      res.push(state);
    });
    return res;
  }

  /**
   * Применяет к состоянию правило.
   *
   * @param field
   *            начальное состояние.
   * @param action
   *            применяемое правило.
   * @return новое состояние, полученное в результате применения правила. null
   *         если состояние недопустимо.
   */
  doAction(field, action) {
    const zero = field.indexOf(0);
    /* Вычисляется индекс перемещаемой клетки */
    const number = zero + action;
    /* Проверяется допустимость хода */
    if (number < 0 || number >= field.length) {
      return null;
    }
    if (action === 1 && (zero + 1) % this.sideSize === 0) {
      return null;
    }
    if (action === -1 && (zero + 1) % this.sideSize === 1) {
      return null;
    }
    /*
     * Создается новый экземпляр поля, на котором меняются местами пустая и
     * перемещаемая клетки
     */
    const newField = field.slice();
    [newField[zero], newField[number]] = [newField[number], newField[zero]];
    return newField;
  }
}
