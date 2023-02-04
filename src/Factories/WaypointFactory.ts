import { Waypoint, EnrouteWaypoint, TerminalWaypoint } from "../Models/General";

export default class WaypointFactory {
    public static create(data: string): Waypoint {
        const regex = /^\s*(\-?\d+\.\d+)\s+(\-?\d+\.\d+)\s+(\w+)\s+(\w+)\s+(\w+)\s+(\d+)\s+(.+)$/s;
        const res = data.match(regex);

        if(!res || res.length != 8) {
            throw new Error("Line does not contain correct format");
        }

        const lat = parseFloat(res[1]);
        const lon = parseFloat(res[2]);
        const identifier = res[3];
        const terminalArea = res[4];
        const regionCode = res[5];
        const type = parseInt(res[6]);
        const spokenName = res[7].trim();

        if(terminalArea == "ENRT") {
            return new EnrouteWaypoint(lat, lon, identifier, regionCode, spokenName, type);
        }

        return new TerminalWaypoint(lat, lon, identifier, regionCode, spokenName, type, terminalArea);
    }
}