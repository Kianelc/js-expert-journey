const assert = require("assert");

const obj = {};
const arr = [];
const fn = () => {};

// Objetos literais são equivalentes a instâncias de Object
console.log("new Object() is {}?", new Object().__proto__ === {}.__proto__);
assert.deepStrictEqual(new Object().__proto__, {}.__proto__);

// O `__proto__` de um objeto aponta para `Object.prototype`
console.log(
  "obj.__proto__ === Object.prototype",
  obj.__proto__ === Object.prototype
);
assert.deepStrictEqual(obj.__proto__, Object.prototype);

// O `__proto__` de um array aponta para `Array.prototype`
console.log(
  "arr.__proto__ === Array.prototype",
  arr.__proto__ === Array.prototype
);
assert.deepStrictEqual(arr.__proto__, Array.prototype);

// O `__proto__` de uma função aponta para `Function.prototype`
console.log(
  "fn.__proto__ === Function.prototype",
  fn.__proto__ === Function.prototype
);
assert.deepStrictEqual(fn.__proto__, Function.prototype);

// O topo da cadeia de protótipos é `null`
console.log(
  "obj.__proto__.__proto__ === null",
  obj.__proto__.__proto__ === null
);
assert.deepStrictEqual(obj.__proto__.__proto__, null);

/* --------------------- */

console.log("---------------------");

// Função construtora Employee
function Employee() {}

// Adiciona método ao protótipo de Employee
Employee.prototype.salary = () => "salary**";

// Acessa o método diretamente pelo protótipo
console.log(Employee.prototype.salary()); // "salary**"

// Supervisor herda o protótipo de Employee
function Supervisor() {}

// Herança: o protótipo de Supervisor passa a ser uma cópia do protótipo de Employee
Supervisor.prototype = Object.create(Employee.prototype);

// Agora Supervisor herda o método salary
console.log(Supervisor.prototype.salary()); // "salary**"

// Adiciona novo método ao protótipo de Supervisor
Supervisor.prototype.profitShare = () => "profitShare**";

// Manager herda de Supervisor
function Manager() {}

// Herança: o protótipo de Manager passa a ser uma cópia do protótipo de Supervisor
Manager.prototype = Object.create(Supervisor.prototype);

// Adiciona método próprio ao protótipo de Manager
Manager.prototype.monthlyBonuses = () => "monthlyBonuses**";

// Podemos acessar métodos via prototype diretamente
console.log("Manager.prototype.salary()", Manager.prototype.salary()); // ok

// Mas não podemos chamar métodos diretamente da função construtora
// console.log("Manager.salary()", Manager.salary()); // Erro: salary não está em Manager, está em seu prototype

// Quando usamos funções construtoras sem 'new', elas são apenas funções comuns
// O __proto__ será Function.prototype
console.log(
  "Manager.prototype.__proto__ === Supervisor.prototype",
  Manager.prototype.__proto__ === Supervisor.prototype
);
assert.deepStrictEqual(Manager.prototype.__proto__, Supervisor.prototype);

console.log("---------------------");

// Quando usamos 'new', a instância criada terá como __proto__ o prototype da função usada com 'new'
const instance = new Manager();
console.log(
  "manager.__proto__: %s, manager.salary(): %s",
  instance.__proto__, // Manager.prototype
  instance.salary() // método herdado de Employee
);

// O prototype de Supervisor é o "pai" da Manager.prototype na cadeia de herança
console.log(
  "Supervisor.prototype === new Manager().__proto__.__proto__",
  Supervisor.prototype === new Manager().__proto__.__proto__
);
assert.deepStrictEqual(Supervisor.prototype, new Manager().__proto__.__proto__);

console.log("---------------------");

// Criando instância de Manager
const manager = new Manager();

// Métodos herdados de toda a cadeia
console.log("manager.salary()", manager.salary()); // herdado de Employee
console.log("manager.profitShare()", manager.profitShare()); // herdado de Supervisor
console.log("manager.monthlyBonuses()", manager.monthlyBonuses()); // herdado de Manager

// Cadeia de protótipos da instância até o topo
// Manager → Supervisor → Employee → Object → null
console.log(manager.__proto__.__proto__.__proto__.__proto__.__proto__); // null

// Validações da cadeia com assert
assert.deepStrictEqual(manager.__proto__, Manager.prototype);
assert.deepStrictEqual(manager.__proto__.__proto__, Supervisor.prototype);
assert.deepStrictEqual(
  manager.__proto__.__proto__.__proto__,
  Employee.prototype
);
assert.deepStrictEqual(
  manager.__proto__.__proto__.__proto__.__proto__,
  Object.prototype
);
assert.deepStrictEqual(
  manager.__proto__.__proto__.__proto__.__proto__.__proto__,
  null
);

console.log("---------------------");

// Herança usando classes (ES6)
class T1 {
  ping() {
    return "ping";
  }
}

class T2 extends T1 {
  pong() {
    return "pong";
  }
}

class T3 extends T2 {
  shoot() {
    return "shoot";
  }
}

const t3 = new T3();

// Cadeia de protótipos: T3 → T2 → T1 → Object → null
console.log(
  "t3 herda null?",
  t3.__proto__.__proto__.__proto__.__proto__.__proto__ === null
);

// Acessando todos os métodos herdados
console.log("t3.ping()", t3.ping()); // de T1
console.log("t3.pong()", t3.pong()); // de T2
console.log("t3.shoot()", t3.shoot()); // de T3

// Validando herança com assert
assert.deepStrictEqual(t3.__proto__, T3.prototype);
assert.deepStrictEqual(t3.__proto__.__proto__, T2.prototype);
assert.deepStrictEqual(t3.__proto__.__proto__.__proto__, T1.prototype);
assert.deepStrictEqual(
  t3.__proto__.__proto__.__proto__.__proto__,
  Object.prototype
);
assert.deepStrictEqual(
  t3.__proto__.__proto__.__proto__.__proto__.__proto__,
  null
);
