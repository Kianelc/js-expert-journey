const assert = require("assert");

// Arrays de exemplo
const arr1 = ["0", "1", "2"];
const arr2 = ["2", "0", "3"];

// Concatenação dos dois arrays
const arr3 = arr1.concat(arr2);

// Valida se, após ordenação, os elementos estão corretos
assert.deepStrictEqual(arr3.sort(), ["0", "0", "1", "2", "2", "3"]);

// Utilizando Set para eliminar duplicatas manualmente
const set = new Set();
arr1.map((item) => set.add(item));
arr2.map((item) => set.add(item));

// Verifica se o Set contém apenas os valores únicos dos dois arrays
assert.deepStrictEqual(Array.from(set), ["0", "1", "2", "3"]);

// Forma mais elegante com spread/rest operator e Set para remover duplicatas
assert.deepStrictEqual(Array.from(new Set([...arr1, ...arr2])), [
  "0",
  "1",
  "2",
  "3",
]);

// Verifica se um item existe no Set (equivalente ao includes/indexOf em arrays)
assert.ok(set.has("3"));

/**
 * INTERSEÇÃO E DIFERENÇA ENTRE CONJUNTOS
 * --------------------------------------
 * Utilizando Set para comparar listas de usuários
 */

// Conjunto de usuários do grupo 01
const users01 = new Set(["kiane", "mariazinha", "xuxa da silva"]);

// Conjunto de usuários do grupo 02
const users02 = new Set(["joaoziho", "kiane", "julio"]);

// Interseção: usuários presentes nos dois grupos
const intersection = new Set([...users01].filter((user) => users02.has(user)));
assert.deepStrictEqual(Array.from(intersection), ["kiane"]);

// Diferença: usuários que estão no grupo 01, mas não no grupo 02
const difference = new Set([...users01].filter((user) => !users02.has(user)));
assert.deepStrictEqual(Array.from(difference), ["mariazinha", "xuxa da silva"]);

/**
 * WeakSet
 * -------
 * Estrutura similar ao Set, mas:
 * - Só aceita objetos como valores
 * - Não é iterável
 * - Os itens não são fortemente referenciados (podem ser coletados pelo garbage collector)
 */

const user = { id: 123 };
const user2 = { id: 321 };

// Inicializa o WeakSet com um objeto
const weakSet = new WeakSet([user]);

// Adiciona outro objeto ao WeakSet
weakSet.add(user2);

// Verifica se os objetos estão presentes
console.log(weakSet.has(user)); // true
console.log(weakSet.has(user2)); // true

// Remove um objeto do WeakSet
weakSet.delete(user);

// Verifica novamente após a exclusão
console.log(weakSet.has(user)); // false
