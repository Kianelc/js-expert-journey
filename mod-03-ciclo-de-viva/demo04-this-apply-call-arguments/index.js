const {
  watch, // função que observa alterações em arquivos
  promises: { readFile }, // versão Promisified do readFile
} = require("fs");

class File {
  // método que será chamado quando houver alteração no arquivo
  watch(event, filename) {
    console.log("this", this); // mostra o contexto atual da função
    console.log("arguments", Array.prototype.slice.call(arguments)); // mostra os argumentos recebidos

    // chama o método showContent do contexto atual (this)
    this.showContent(filename);
  }

  // método que lê e imprime o conteúdo de um arquivo
  async showContent(filename) {
    const content = await readFile(filename);
    console.log(content.toString());
  }
}

const file = new File();

// ----------------------------------------------
// FORMAS DE USAR O MÉTODO COM CONTEXTO ADEQUADO
// ----------------------------------------------

// 📝 Forma comum usando função anônima: preserva o this ao chamar file.watch
// watch(__filename, (event, filename) => file.watch(event, filename));

// 📝 Forma usando bind para manter o contexto da instância File
// Nesse caso, o método watch será executado com 'this' corretamente apontando para 'file'
// watch(__filename, file.watch.bind(file));

// ----------------------------------------------
// EXEMPLOS DE USO DE .call() E .apply()
// ----------------------------------------------

// Criando um contexto alternativo com um método showContent diferente
// Usamos .call para invocar o método passando o novo contexto e os argumentos separadamente
file.watch.call(
  { showContent: () => console.log("call: hey sinon!") },
  null,
  __filename
);

// Usamos .apply para invocar o método passando o novo contexto e os argumentos como array
file.watch.apply({ showContent: () => console.log("call: hey sinon!") }, [
  null,
  __filename,
]);

/*
📌 Explicação:
- .call e .apply servem para executar funções com um 'this' definido manualmente.
- Isso é útil para testes (ex: com sinon.js), ou para reutilizar funções em outros contextos.
- .bind, por outro lado, retorna uma nova função que sempre usará o 'this' especificado.

🛑 Cuidado: se passar apenas file.watch direto para watch(), o 'this' dentro do método pode ser perdido,
já que ele será chamado fora do contexto da instância.
*/
