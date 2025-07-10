const { deepStrictEqual } = require("assert");
/*
    TIPOS PRIMITIVOS SÃO COPIADOS POR VALOR
    - 'counter' é um número (tipo primitivo).
    - Ao fazer 'counter2 = counter', estamos copiando apenas o valor (0).
    - Modificar 'counter2' depois disso não afeta 'counter'.
*/
let counter = 0;
let counter2 = counter;
counter2++; // counter2 = 1, mas counter continua sendo 0
deepStrictEqual(counter, 0);
deepStrictEqual(counter2, 1);

/*
    OBJETOS SÃO COPIADOS POR REFERÊNCIA
    - 'item' é um objeto.
    - Ao fazer 'item2 = item', estamos copiando a referência para o mesmo objeto.
    - Modificar 'item2.counter' afeta também 'item.counter', pois ambos apontam para o mesmo objeto na memória.
*/
const item = { counter: 0 };
const item2 = item;
item2.counter++; // item.counter também será 1
deepStrictEqual(item2, { counter: 1 });
item.counter++; // agora counter = 2 no mesmo objeto
deepStrictEqual(item, { counter: 2 });
