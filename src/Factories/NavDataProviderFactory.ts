import { Fix } from "../Models/General";
import { NavDataProvider } from "../Providers";
import FileReader from "../Utils/FileReader";
import { Identifier, RegionCode } from "../Utils/Types";
import NavaidFactory from "./NavaidFactory";
import WaypointFactory from "./WaypointFactory";

export default class NavDataProviderFactory {
    public static createFromXP12(config: {waypointFile: string, navaidFile: string}) {
        let lines: string[] = [];
        let map: Map<Identifier, Map<RegionCode, Fix>> = new Map();

        lines = FileReader.getLinesFromFile(config.waypointFile);
        if(this.isCurrentVersion(lines)) {
            map = this.enrichMapWithWaypoints(map, lines);
        }

        lines = FileReader.getLinesFromFile(config.navaidFile);
        if(this.isCurrentVersion(lines)) {
            map = this.enrichMapWithNavaids(map, lines);
        }

        return new NavDataProvider(map);
    }

    private static isCurrentVersion(lines: string[]): boolean
    {
        if (lines[0].trim() != "I") {
            return false;
        }
        if (lines[1].trim().startsWith("1200 Version") === false) {
            return false;
        }

        return true;
    }

    private static enrichMapWithWaypoints(map: Map<Identifier, Map<RegionCode, Fix>>, lines: string[]): Map<Identifier, Map<RegionCode, Fix>>
    {
        for(let i = 2; i < lines.length; i++) {
            let line = lines[i].trim();

            if(line.length == 0) {
                continue;
            }
            if(line == "99") {
                break;
            }

            let waypoint = WaypointFactory.create(line);

            if(map.has(waypoint.identifier) === false) {
                map.set(waypoint.identifier, new Map());
            } 

            map.get(waypoint.identifier)!.set(waypoint.regionCode, waypoint);
        }

        return map;
    }

    private static enrichMapWithNavaids(map: Map<Identifier, Map<RegionCode, Fix>>, lines: string[]): Map<Identifier, Map<RegionCode, Fix>>
    {
        for(let i = 2; i < lines.length; i++) {
            let line = lines[i].trim();

            if(line.length == 0) {
                continue;
            }
            if(line == "99") {
                break;
            }
            if(line.startsWith("3") == false && line.startsWith("2") == false) {
                continue;
            }

            let navaid = NavaidFactory.create(line);

            if(map.has(navaid.identifier) === false) {
                map.set(navaid.identifier, new Map());
            } 

            map.get(navaid.identifier)!.set(navaid.regionCode, navaid);
        }

        return map;
    }
}