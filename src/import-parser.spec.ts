import { File } from "./file";
import { ImportParser } from "./import-parser";

describe("import parsing", () => {
  let importParser: ImportParser;

  beforeEach(() => {
    importParser = new ImportParser();
  });

  it("should find no imports in empty file", () => {
    const file = new File("", "a.ts");
    const imports = importParser.parseFile(file);
    expect(imports).toHaveLength(0);
  });
});
