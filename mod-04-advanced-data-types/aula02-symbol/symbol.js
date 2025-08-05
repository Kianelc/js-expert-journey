const assert = require("assert");

// Cria uma chave única com Symbol. Mesmo que outro Symbol tenha a mesma descrição,
// ele ainda será considerado um valor diferente na memória.
const uniqueKey = Symbol("userName");

const user = {};
user["userName"] = "value for normal Objects"; // Propriedade comum com string como chave
user[uniqueKey] = "value for symbol"; // Propriedade com Symbol como chave (única e não enumerável por padrão)

/*
// Acessando propriedades normais (chave string)
console.log("getting normal Objects", user.userName);

// Acessando com um novo Symbol com mesma descrição: não retorna o valor!
// Symbols são sempre únicos, mesmo com descrições iguais
console.log("getting with new Symbol", user[Symbol("userName")]); // undefined

// Acessando com o Symbol original, funciona corretamente
console.log("getting with original Symbol", user[uniqueKey]); // "value for symbol"
*/

// Verifica que a propriedade string pode ser acessada normalmente
assert.deepStrictEqual(user.userName, "value for normal Objects");

// Propriedades com Symbol são únicas por referência: outro Symbol com mesma descrição não funciona
assert.deepStrictEqual(user[Symbol("userName")], undefined);

// Acessando com o Symbol original funciona normalmente
assert.deepStrictEqual(user[uniqueKey], "value for symbol");

// Embora não sejam visíveis com Object.keys ou JSON.stringify,
// é possível acessar os Symbols definidos como chaves usando Object.getOwnPropertySymbols
assert.deepStrictEqual(Object.getOwnPropertySymbols(user)[0], uniqueKey);

// ⚠️ Má prática: usar Symbol.for cria ou reutiliza Symbols globais (registrados no runtime).
// Esses Symbols podem ser acessados por qualquer parte do código com a mesma chave.
user[Symbol.for("password")] = 123;
assert.deepStrictEqual(user[Symbol.for("password")], 123);

// 🔁 Exemplo de uso de Symbol.iterator (Well-Known Symbol) para criar um objeto iterável
const obj = {
  [Symbol.iterator]: () => ({
    items: ["c", "b", "a"],
    next() {
      return {
        done: this.items.length === 0,
        value: this.items.pop(),
      };
    },
  }),
};

// Podemos iterar sobre o objeto com for...of graças à implementação do Symbol.iterator
const results = [];
for (const item of obj) {
  results.push(item);
}
assert.deepStrictEqual(results, ["a", "b", "c"]);
assert.deepStrictEqual([...obj], ["a", "b", "c"]); // spread operator também usa o iterator

// -------------------
// 🧪 Classe customizada usando vários Well-Known Symbols
// -------------------

const kItems = Symbol("kItems"); // chave privada simbólica para armazenar datas internamente

class MyDate {
  constructor(...args) {
    // Cada argumento é um array com dados para criar uma nova instância de Date
    this[kItems] = args.map((arg) => new Date(...arg));
  }

  // 🧠 Symbol.toPrimitive: define como o objeto se comporta quando for convertido para primitivo
  [Symbol.toPrimitive](coercionType) {
    if (coercionType !== "string") throw new TypeError(); // só permitimos coerção explícita para string

    const items = this[kItems].map((item) =>
      new Intl.DateTimeFormat("pt-BR", {
        month: "long",
        day: "2-digit",
        year: "numeric",
      }).format(item)
    );

    return new Intl.ListFormat("pt-BR", {
      style: "long",
      type: "conjunction",
    }).format(items); // Exemplo: "01 de abril de 2020 e 02 de março de 2018"
  }

  // 🔁 Symbol.iterator: permite iteração síncrona com for...of
  *[Symbol.iterator]() {
    for (const item of this[kItems]) {
      yield item;
    }
  }

  // ⏳ Symbol.asyncIterator: permite iteração assíncrona com for await...of
  async *[Symbol.asyncIterator]() {
    const timeout = (ms) => new Promise((r) => setTimeout(r, ms));
    for (const item of this[kItems]) {
      await timeout(100); // simula delay assíncrono
      yield item.toISOString();
    }
  }

  // 🏷️ Symbol.toStringTag: customiza o resultado de Object.prototype.toString.call()
  get [Symbol.toStringTag]() {
    return "WHAT?";
  }
}

const myDate = new MyDate([2020, 3, 1], [2018, 2, 2]);
const expectedDates = [new Date(2020, 3, 1), new Date(2018, 2, 2)];

// 🧪 Testa Symbol.toStringTag
assert.deepStrictEqual(
  Object.prototype.toString.call(myDate),
  "[object WHAT?]"
);

// 🧪 Testa Symbol.toPrimitive com coerção errada
assert.throws(() => myDate + 1, TypeError);

// 🧪 Testa Symbol.toPrimitive com coerção explícita para string
assert.deepStrictEqual(
  String(myDate),
  "01 de abril de 2020 e 02 de março de 2018"
);

// 🧪 Testa iteração síncrona
assert.deepStrictEqual([...myDate], expectedDates);

// 🧪 Testa iteração assíncrona
(async () => {
  const dates = [];
  for await (const date of myDate) {
    dates.push(date);
  }

  const expectedDatesInISOString = expectedDates.map((item) =>
    item.toISOString()
  );
  assert.deepStrictEqual(dates, expectedDatesInISOString);
})();
