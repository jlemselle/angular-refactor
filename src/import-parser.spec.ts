import { ImportParser } from "./import-parser";
import { File } from "./models/file";

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
    const file = new File("a.ts", "import { b } from 'c';");
    const imports = importParser.parseFile(file);

    expect(imports).toEqual([
      expect.objectContaining({ token: "b", path: "c" }),
    ]);
  });

  it("should support multiple imports", () => {
    const file = new File(
      "a.ts",
      `
        import { b } from "c";
        import { d } from "e";
        import { f } from "g";
      `
    );
    const imports = importParser.parseFile(file);
    expect(imports).toEqual([
      expect.objectContaining({ token: "b", path: "c" }),
      expect.objectContaining({ token: "d", path: "e" }),
      expect.objectContaining({ token: "f", path: "g" }),
    ]);
  });

  it("should support multiple names", () => {
    const file = new File("a.ts", "import { b, c } from 'd';");
    const imports = importParser.parseFile(file);

    expect(imports).toEqual([
      expect.objectContaining({ token: "b", path: "d" }),
      expect.objectContaining({ token: "c", path: "d" }),
    ]);
  });
});
