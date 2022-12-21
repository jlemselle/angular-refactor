import { File } from "./file";

export class ImportParser {
  parseFile(file: File) {
    const regex = /import (?:.* from ){0,1}['"](.*)['"];{0,1}/g;

    let results = [];
    let result = this.getImport(regex, file.contents);
    while (result !== null) {
      results.push(result);
      result = this.getImport(regex, file.contents);
    }

    return results;
  }

  getImport(regex: RegExp, contents: string) {
    const results = regex.exec(contents);

    if (!results || results.length === 0) {
      return null;
    }

    return { importPath: results[1] };
  }
}
