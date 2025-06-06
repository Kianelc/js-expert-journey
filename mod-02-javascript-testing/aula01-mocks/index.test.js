const { error } = require("./src/constants");
const File = require("./src/file");
const assert = require("assert");

//IFEE
(async () => {
  // variaveis criadas nesse bloco, só são validas durante sua execucao
  {
    const filePath = "./mocks/emptyFile-invalid.csv";
    const expected = new Error(error.FILE_LENGTH_ERROR_MESSAGE);
    const result = File.csvToJSON(filePath);
    await assert.rejects(result, expected);
  }
  {
    const filePath = "./mocks/header-invalid.csv";
    const expected = new Error(error.FILE_FIELDS_ERROR_MESSAGE);
    const result = File.csvToJSON(filePath);
    await assert.rejects(result, expected);
  }
  {
    const filePath = "./mocks/fiveItems-invalid.csv";
    const expected = new Error(error.FILE_LENGTH_ERROR_MESSAGE);
    const result = File.csvToJSON(filePath);
    await assert.rejects(result, expected);
  }
  {
    const filePath = "./mocks/threeItems-valid.csv";
    const expected = [
      {
        id: 1,
        name: "Kiane",
        profession: "Desenvolvedora",
        age: 29,
      },
      {
        id: 2,
        name: "Kamille",
        profession: "Radiologista",
        age: 28,
      },
      {
        id: 3,
        name: "Jurandir",
        profession: "Policial",
        age: 50,
      },
    ];
    const result = await File.csvToJSON(filePath);
    assert.deepEqual(result, expected);
  }
})();
