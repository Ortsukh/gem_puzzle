export default class State {
  constructor(parent, field) {
    this.parent = parent;
    this.g = 0;
    this.field = field;
    this.h = 0;
    this.hash = this.hash1();
  }

  getF() {
    return this.h;
  }

  equals(state) {
    return this.hash === state.hash;
  }

  hash1() {
    return this.field.toString();
  }
}
