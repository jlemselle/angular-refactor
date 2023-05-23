import { File } from "./models/file";
import { Import } from "./models/import";

export class ImportParser {
  parseFile(file: File): Import[] {
    const importPattern = /import { (.+) } from ['"](.*)['"];{0,1}/g;

    let imports = [];

    let match;
    while ((match = importPattern.exec(file.contents)) !== null) {
      const importInstance = this.getImport(match);
      if (importInstance) {
        imports.push(...importInstance);
      }
    }

    return imports;
  }

  getImport(match: RegExpMatchArray): Import[] | null {
    if (!match || match.length === 0) {
      return null;
    }

    return match[1]
      .split(",")
      .map((x) => ({ token: x.trim(), path: match[2] }));
  }
}
