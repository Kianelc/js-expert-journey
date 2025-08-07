"use strict";

const assert = require("assert");

// Exemplo que mostra como garantir semântica e segurança ao usar objetos em JavaScript

// ---------------------------------------------------
// 1. Definimos um objeto com um método que depende de `this`
const myObj = {
  add(value) {
    // Usa os valores arg1 e arg2 do contexto (this) e soma com o valor passado
    return this.arg1 + this.arg2 + value;
  },
};
// ---------------------------------------------------
// 2. Usamos o método `apply` para alterar o contexto de execução (`this`) de `add`
// e passamos os argumentos como array
const context = { arg1: 10, arg2: 20 };
const parameters = [100];

const result = myObj.add.apply(context, parameters);

// Teste: Espera-se que 10 + 20 + 100 === 130
assert.deepStrictEqual(result, 130);

// ---------------------------------------------------
// 3. Problemas que *podem* ocorrer:

// (A) - CASO RARO:
// Alguém pode sobrescrever o comportamento global do `apply`
// Isso pode quebrar bibliotecas ou gerar erros inesperados
/*
Function.prototype.apply = () => {
  throw new TypeError("Eita!");
};
*/

// (B) - CASO MAIS PERIGOSO:
// Um atacante pode sobrescrever apenas o método `.apply` do seu objeto,
// com intenção maliciosa, capturando dados ou impedindo execução normal
myObj.add.apply = function () {
  throw new Error("Vixx - Método apply foi modificado!");
};

// Se você tentar executar `myObj.add.apply(...)` agora, cairá no erro acima
// Isso mostra como a sobrescrição de métodos pode comprometer a segurança

// 👀 Esse tipo de ataque é conhecido como “prototype pollution” ou
// “object tampering” e pode ser explorado se o código não tomar cuidado

assert.throws(() => myObj.add.apply({}, []), {
  name: "Error",
  message: "Vixx - Método apply foi modificado!",
});

// --------------------------------------------------
// 1. Reflect.apply() — invocar função com contexto e parâmetros
const result2 = Reflect.apply(myObj.add, { arg1: 40, arg2: 20 }, [200]);
assert.deepStrictEqual(result2, 260);
// Vantagem: evita sobrescrições maliciosas como myObj.add.apply = ...

// --------------------------------------------------
// 2. Reflect.defineProperty() — semântica mais clara ao definir propriedades

function MyDate() {}

// Definindo propriedades diretamente na função MyDate
// ❌ Anti-pattern: Tudo é Object, até Function! Isso causa confusão semântica
Object.defineProperty(MyDate, "withObject", {
  value: () => "Hey there",
});

// ✅ Melhor: usar Reflect para deixar a intenção clara e o código mais consistente
Reflect.defineProperty(MyDate, "withReflection", {
  value: () => "Hey dude",
});

assert.deepStrictEqual(MyDate.withObject(), "Hey there");
assert.deepStrictEqual(MyDate.withReflection(), "Hey dude");

// --------------------------------------------------
// 3. Reflect.deleteProperty() — remover propriedades com mais controle

const withDelete = { user: "KianeCasagrande" };
delete withDelete.user; // forma tradicional
assert.deepStrictEqual(withDelete.hasOwnProperty("user"), false);

const withReflection = { user: "XuxaSilva" };
Reflect.deleteProperty(withReflection, "user"); // forma recomendada
assert.deepStrictEqual(withReflection.hasOwnProperty("user"), false);

// --------------------------------------------------
// 4. Reflect.get() — acesso controlado às propriedades

// ❌ Não recomendado: tentar acessar propriedade de tipo primitivo
assert.deepStrictEqual((1)["userName"], undefined);

// ✅ Recomendado: Reflect lança erro, impedindo comportamentos inesperados
assert.throws(() => Reflect.get(1, "userName"), TypeError);

// --------------------------------------------------
// 5. Reflect.has() — alternativa semântica ao operador `in`

assert.ok("superman" in { superman: "" }); // forma tradicional
assert.ok(Reflect.has({ batman: "" }, "batman")); // mais legível e clara

// --------------------------------------------------
// 6. Reflect.ownKeys() — retorna todas as chaves de um objeto (strings e Symbols)

const user = Symbol("user");
const dataBaseUser = {
  id: 1,
  [Symbol.for("password")]: 123,
  [user]: "kianecasagrande",
};

// ✅ Sem Reflect: temos que usar dois métodos
const objectKeys = [
  ...Object.getOwnPropertyNames(dataBaseUser),
  ...Object.getOwnPropertySymbols(dataBaseUser),
];
assert.deepStrictEqual(objectKeys, ["id", Symbol.for("password"), user]);

// ✅ Com Reflect: tudo em uma única chamada
assert.deepStrictEqual(Reflect.ownKeys(dataBaseUser), [
  "id",
  Symbol.for("password"),
  user,
]);
