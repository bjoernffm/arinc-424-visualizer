import { readFileSync } from "fs";

export abstract class FileReader {
    public static getLinesFromFile(path: string): string[] {
        const data = readFileSync(path, 'utf-8');
        return data.split("\n").map(x => x.trim());
    }
}