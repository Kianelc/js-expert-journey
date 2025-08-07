"use strict";

// Importa o módulo de eventos do Node.js
const { EventEmitter } = require("events");

// Cria uma instância de EventEmitter
const eventEmitter = new EventEmitter();
const EVENT_NAME = "counterUpdated";

// Define um ouvinte para o evento "counterUpdated"
eventEmitter.on(EVENT_NAME, (payload) => {
  console.log("📣 Evento disparado -> counter atualizado:", payload);
});

// Objeto que será monitorado
const counterState = { counter: 0 };

// Cria um Proxy para interceptar acessos e modificações ao objeto `counterState`
const proxy = new Proxy(counterState, {
  set(target, propertyKey, newValue) {
    // Emite um evento sempre que o valor for modificado
    eventEmitter.emit(EVENT_NAME, {
      previousValue: target[propertyKey],
      newValue,
    });

    // Atualiza o valor da propriedade
    target[propertyKey] = newValue;
    return true; // Indica que a operação foi bem-sucedida
  },

  get(target, propertyKey) {
    // Intercepta leituras de propriedade (aqui apenas repassa o valor)
    return target[propertyKey];
  },
});

/**
 * Demonstração da ordem de execução dos timers/eventos:
 *
 * 1. `process.nextTick` → executa antes de qualquer outra operação assíncrona
 * 2. `setImmediate`     → executa logo após a fase de I/O
 * 3. `setTimeout`       → executa após o tempo determinado (mínimo 0ms)
 * 4. `setInterval`      → executa repetidamente após o intervalo especificado
 */

// Executa no final da fase atual do ciclo de eventos (máxima prioridade)
process.nextTick(() => {
  proxy.counter = 2;
  console.log("[1] ✅ process.nextTick executado");
});

// Executa imediatamente após a fase de I/O (alta prioridade, mas depois de nextTick)
setImmediate(() => {
  console.log(
    "[2] ✅ setImmediate executado - valor atual do contador:",
    proxy.counter
  );
});

// Executa após 100ms
setTimeout(() => {
  proxy.counter = 4;
  console.log("[3] ⏱️  setTimeout executado - contador definido como 4");
}, 100);

// Executa repetidamente a cada 200ms até o contador chegar a 10
const intervalId = setInterval(() => {
  proxy.counter += 1;
  console.log("[4] 🔁 setInterval executado - contador:", proxy.counter);

  if (proxy.counter === 10) {
    clearInterval(intervalId); // Para o loop
    console.log("⛔ Intervalo finalizado");
  }
}, 200);
