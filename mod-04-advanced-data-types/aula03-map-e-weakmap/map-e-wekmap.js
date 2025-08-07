const assert = require("assert");
const myMap = new Map();

// O Map aceita qualquer tipo de dado como chave: number, string, boolean, objeto, função, etc.
myMap
  .set(1, "one") // chave: número
  .set("Kiane", { text: "two" }) // chave: string
  .set(true, () => "hello"); // chave: boolean

// Também é possível criar um Map diretamente com valores usando o construtor
const myMapWithConstructor = new Map([["1", "str1", 1, "num1", true, "bool1"]]);

// Valida os valores armazenados
assert.deepStrictEqual(myMap.get(1), "one");
assert.deepStrictEqual(myMap.get("Kiane"), { text: "two" }); // Objetos são comparados por referência, cuidado aqui!
assert.deepStrictEqual(myMap.get(true)(), "hello");

// Em objetos tradicionais ({}), as chaves só podem ser string ou symbol. Números são convertidos para string automaticamente.
// No Map, objetos como chave são comparados por referência (não por valor)
const onlyReferenceWorks = { id: 1 };
myMap.set(onlyReferenceWorks, { name: "KianeCasagrande" });

// Tentando acessar com um novo objeto idêntico (mesmo valor, diferente referência) retorna `undefined`
assert.deepStrictEqual(myMap.get({ id: 1 }), undefined);

// Acessando com a referência correta, funciona
assert.deepStrictEqual(myMap.get(onlyReferenceWorks), {
  name: "KianeCasagrande",
});

// Verificando o tamanho do Map
assert.deepStrictEqual(myMap.size, 4); // 3 entradas anteriores + 1 com objeto como chave

// Verificando se uma chave existe no Map (equivalente a `hasOwnProperty` em objetos)
assert.ok(myMap.has(onlyReferenceWorks));

// Removendo uma entrada do Map (em objetos seria `delete obj.key`)
assert.ok(myMap.delete(onlyReferenceWorks));

// Iterando pelas entradas do Map (objeto tradicional requer uso de Object.entries)
assert.deepStrictEqual(
  JSON.stringify([...myMap]),
  JSON.stringify([
    [1, "one"],
    ["Kiane", { text: "two" }],
    [true, () => {}],
  ])
);

/* 
for (const [key, value] of myMap) {
  console.log({ key, value });
}
*/

// Objetos ({}) podem ter problemas se as chaves sobrescreverem métodos padrão, como toString
const actor = {
  name: "Xuxa da Silva",
  toString: "Queen: Xuxa da Silva", // sobrescrevendo toString como string (em vez de função)
};

// No Map, não há restrição quanto ao nome da chave
myMap.set(actor);

// A chave existe no Map
assert.ok(myMap.has(actor));

// Tentativa de acessar `toString` (esperado como função) resulta em erro, pois agora é uma string
assert.throws(() => myMap.get(actor).toString, TypeError);

// Limpando todas as entradas do Map
myMap.clear();
assert.deepStrictEqual([...myMap.keys()], []);

// --- WeakMap ---
// É similar ao Map, mas com algumas diferenças importantes:

// - As chaves devem ser obrigatoriamente objetos (ou funções).
// - As referências são *fracas*, ou seja, se o objeto usado como chave for perdido (sem referência em outro lugar), ele pode ser *coletado pelo garbage collector*.
// - Isso previne vazamento de memória (memory leak), sendo útil para armazenar dados privados associados a objetos.
// - Não é iterável (não é possível usar for...of, entries, etc.).
// - Não possui propriedades como size, keys, values ou entries.

const weakMap = new WeakMap();
const hero = { name: "Flash" };

// Associando um valor a uma chave-objeto
weakMap.set(hero, "Velocidade da luz");

// Recuperando o valor associado ao objeto
console.log(weakMap.get(hero)); // "Velocidade da luz"

// Removendo a entrada do WeakMap
weakMap.delete(hero);

// Verificando se a chave ainda existe no WeakMap
console.log(weakMap.has(hero)); // false
