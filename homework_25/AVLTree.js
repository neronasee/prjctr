class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
    this.height = 1;
  }
}

class AVLTree {
  constructor() {
    this.root = null;
  }

  getHeight(node) {
    if (!node) return 0;
    return node.height;
  }

  updateHeight(node) {
    node.height =
      1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
  }

  getBalance(node) {
    if (!node) return 0;
    return this.getHeight(node.left) - this.getHeight(node.right);
  }

  rightRotate(y) {
    let x = y.left;
    let T3 = x.right;

    x.right = y;
    y.left = T3;

    this.updateHeight(y);
    this.updateHeight(x);

    return x;
  }

  leftRotate(x) {
    let y = x.right;
    let T2 = y.left;

    y.left = x;
    x.right = T2;

    this.updateHeight(x);
    this.updateHeight(y);

    return y;
  }

  rebalance(node) {
    this.updateHeight(node);
    const balance = this.getBalance(node);

    if (balance > 1) {
      if (this.getBalance(node.left) < 0) {
        node.left = this.leftRotate(node.left);
      }
      return this.rightRotate(node);
    }

    if (balance < -1) {
      if (this.getBalance(node.right) > 0) {
        node.right = this.rightRotate(node.right);
      }
      return this.leftRotate(node);
    }

    return node;
  }

  search(value) {
    return this._search(this.root, value);
  }

  _search(node, value) {
    if (!node) return null;
    if (value < node.value) return this._search(node.left, value);
    else if (value > node.value) return this._search(node.right, value);
    else return node;
  }

  insert(node, value) {
    if (!node) return new Node(value);

    if (value < node.value) node.left = this.insert(node.left, value);
    else if (value > node.value) node.right = this.insert(node.right, value);
    else return node;

    return this.rebalance(node);
  }

  add(value) {
    this.root = this.insert(this.root, value);
  }

  delete(value) {
    this.root = this._delete(this.root, value);
  }

  _delete(node, value) {
    if (!node) return node;

    if (value < node.value) {
      node.left = this._delete(node.left, value);
    } else if (value > node.value) {
      node.right = this._delete(node.right, value);
    } else {
      if (!node.left) return node.right;
      else if (!node.right) return node.left;

      node.value = this.minValue(node.right).value;
      node.right = this._delete(node.right, node.value);
    }

    return this.rebalance(node);
  }

  minValue(node) {
    let current = node;
    while (current.left) {
      current = current.left;
    }
    return current;
  }
}

module.exports = { AVLTree };
