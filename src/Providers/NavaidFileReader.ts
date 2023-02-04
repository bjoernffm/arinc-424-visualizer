import { Navaid } from "../Models/General/Navaid";
import { Identifier, RegionCode } from "../Types";
import { FileReader } from "./FileReader";
import { NavaidFactory } from "./NavaidFactory";
import { NavaidProvider } from "./NavaidProvider";

export class NavaidProviderFactory {
    public static create(path: string) {        
        const lines = FileReader.getLinesFromFile(path);

        if (lines[0].trim() != "I") {
            throw new Error("Missing proper file format");
        }
        if (lines[1].trim().startsWith("1200 Version") === false) {
            throw new Error("Missing proper file format");
        }

        return new NavaidProvider(NavaidProviderFactory.getNavaidMap(lines));
    }

    private static getNavaidMap(lines: string[]): Map<Identifier, Map<RegionCode, Navaid>>
    {
        const navaids: Map<Identifier, Map<RegionCode, Navaid>> = new Map();

        for(let i = 2; i < lines.length; i++) {
            let line = lines[i].trim();

            if(line.length == 0) {
                continue;
            }
            if(line == "99") {
                break;
            }
            if(line.startsWith("3") == false) {
                continue;
            }

            let navaid = NavaidFactory.create(line);

            if(navaids.has(navaid.identifier) === false) {
                navaids.set(navaid.identifier, new Map());
            } 

            navaids.get(navaid.identifier)!.set(navaid.regionCode, navaid);
        }

        return navaids;
    }
}