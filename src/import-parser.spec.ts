import { File } from "./file";
import { ImportParser } from "./import-parser";

describe("import parsing", () => {
  let importParser: ImportParser;

  beforeEach(() => {
    importParser = new ImportParser();
  });

  it("should find no imports in empty file", () => {
    const file = new File("a.ts", "");
    const imports = importParser.parseFile(file);
    expect(imports).toHaveLength(0);
  });

  it("should find single import in file", () => {
    const file = new File("a.ts", "import { b } from 'b'");
    const imports = importParser.parseFile(file);
    expect(imports).toEqual([{ importPath: "b" }]);
  });

  it("should support trailing semicolon", () => {
    const file = new File("a.ts", "import { b } from 'b';");
    const imports = importParser.parseFile(file);
    expect(imports).toEqual([{ importPath: "b" }]);
  });

  it("should support double quotes", () => {
    const file = new File("a.ts", 'import { b } from "b";');
    const imports = importParser.parseFile(file);
    expect(imports).toEqual([{ importPath: "b" }]);
  });

  it("should support default export", () => {
    const file = new File("a.ts", 'import defaultExport from "b";');
    const imports = importParser.parseFile(file);
    expect(imports).toEqual([{ importPath: "b" }]);
  });

  it("should support direct import", () => {
    const file = new File("a.ts", 'import "b";');
    const imports = importParser.parseFile(file);
    expect(imports).toEqual([{ importPath: "b" }]);
  });

  it("should support multiple imports", () => {
    const file = new File(
      "a.ts",
      `
        import { b } from "b";
        import { c } from "c";
        import { d } from "d";
      `
    );
    const imports = importParser.parseFile(file);
    expect(imports.map((x) => x.importPath)).toEqual(["b", "c", "d"]);
  });

  it("should support multiple complex imports", () => {
    const file = new File(
      "a.ts",
      `
        import defaultExport from "b";
        import * as name from "c";
        import { export1 } from "d";
        import { export1 as alias1 } from "e";
        import { default as alias } from "f";
        import { export1, export2 } from "g";
        import { export1, export2 as alias2, /* … */ } from "h";
        import { "string name" as alias } from "i";
        import defaultExport, { export1, /* … */ } from "j";
        import defaultExport, * as name from "k";
        import "l";
      `
    );
    const imports = importParser.parseFile(file);
    expect(imports.map((x) => x.importPath)).toEqual([
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "j",
      "k",
      "l",
    ]);
  });
});
