true + 2; // 3
true - 2; // -1
"21" + true; // '21true'
"21" - true; // 20
9999999999999999; // 10000000000000000
0.1 + 0.2; // 0.30000000000000004
0.1 + 0.2 === 0.3; // false
3 > 2; // true
2 > 1; // true
3 > 2 > 1; // false
"21" - -1; // 22
"1" == 1; // true
"1" === 1; // false
3 > 2 >= 1; // true
"B" + "a" + +"a" + "a"; // 'BaNaNa'

/* --------------------- */

// Coerção Explícita: converte o número 123 para string de forma direta usando a função String()
// Tipo original: number -> Tipo convertido: string
String(123); // "123"

// Coerção Implícita: o número 123 é convertido automaticamente para string ao ser somado com uma string vazia
// Tipo original: number + string -> Resultado: string
123 + ""; // "123"

console.assert(String(123) === "123", "Explicit convertion to string");
console.assert(123 + "" === "123", "Implicit convertion to string");

// *** Curto-circuito com operadores lógicos ***

// O operador lógico OR (||) retorna o primeiro valor "truthy" encontrado.
// No exemplo abaixo, `null` é "falsy", então o resultado da expressão é `1`, que é "truthy".
if (null || 1) {
  console.log("ae!"); // Será executado
}

// Aqui, "hello" já é um valor "truthy", então `1` nem é avaliado.
// A expressão retorna "hello", que é considerado verdadeiro.
if ("hello" || 1) {
  console.log("ae!"); // Também será executado
}

// A variável `r` recebe o resultado da expressão "hello" || 1
// Como "hello" é "truthy", `r` será "hello"
const r = "hello" || 1;
console.log("r", r); // Imprime: r hello

// Como `r` contém uma string "truthy", o bloco será executado.
if (r) {
  console.log("ae!"); // Será executado novamente
}

console.assert(
  ("hello" || 123) === "hello",
  "Returns the first value if both are truthy"
);
console.assert(
  ("hello" && 123) === 123,
  "Returns the last value if both are truthy"
);

/* --------------------- */

// Objeto com métodos personalizados de coerção
const item = {
  name: "KianeCasagrande",
  age: 30,

  // Método toString: chamado quando há tentativa de conversão explícita para string
  // Obs: Só é usado se Symbol.toPrimitive e valueOf não estiverem presentes ou não forem chamados
  toString() {
    console.log("hey"); // Apenas para mostrar que foi chamado
    return `Name ${this.name}, Age: ${this.age}`;
  },

  // Método valueOf: chamado em conversão para number, se Symbol.toPrimitive não estiver presente
  // Aqui, retorna um objeto (não primitivo), portanto não será útil para coerção numérica
  valueOf() {
    return { hey: "dude" };
    // return 7; // Exemplo de valor primitivo válido
  },

  // Symbol.toPrimitive: tem prioridade sobre os outros métodos em coerções
  // É chamado em qualquer tentativa de coerção e recebe como argumento o tipo desejado: 'string', 'number' ou 'default'
  [Symbol.toPrimitive](coercionType) {
    console.log("trying to convert to", coercionType); // Loga o tipo de coerção tentada
    const types = {
      string: JSON.stringify(this), // Para conversão do tipo string
      number: "0007", // Para conversão do tipo number
    };

    // Retorna o valor coerente com o tipo solicitado ou o padrão (string)
    return types[coercionType] || types.string;
  },
};

// Coerção implícita: tenta converter o objeto em primitivo para realizar a concatenação
// Usa Symbol.toPrimitive -> coercionType: "default"
console.log("item", item + 0); // Resultado: '{"name":"KianeCasagrande","age":30}0'

// Coerção implícita em concatenação de string: coercionType será "string"
console.log("item", "".concat(item)); // Resultado: '{"name":"KianeCasagrande","age":30}'

// Coerção explícita para string
console.log("toString", String(item)); // Resultado: '{"name":"KianeCasagrande","age":30}'

// Coerção explícita para número
// Symbol.toPrimitive é chamado com coercionType: "number"
// Retorna "0007", que ao ser convertido para Number, vira 7
console.log("valueOf", Number(item)); // Resultado: 7

// Reforçando a coerção explícita para string
console.log("String", String(item)); // Mesma saída anterior

// Conversão para Date: também realiza coerção (default), chamando Symbol.toPrimitive
console.log("Date", new Date(item)); // Dependerá da string retornada pela coerção

// Validação dos resultados esperados
console.assert(item + 0 === '{"name":"KianeCasagrande","age":30}0');

// Verificando que objetos sempre são truthy em coerção booleana
console.log("!!item is true?", !!item);
console.assert(!!item);

// Concatenação explícita com string
console.log("string.concat", "Ae".concat(item));
console.assert("Ae".concat(item) === 'Ae{"name":"KianeCasagrande","age":30}');

// Comparação implícita (== faz coerção): item é convertido para string
console.log("implicit + explicit coercion (using ==)", item == String(item));
console.assert((item == String(item)) === true);

// Criando um novo objeto baseado no anterior, mas com outros valores
const item2 = { ...item, name: "Zézé", age: 25 };
console.log("New Object", item2);
console.assert(item2.name === "Zézé", item2.age === 25);
