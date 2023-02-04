import { Navaid } from "../Models/General/Navaid";
import { Vor } from "../Models/General/Vor";
import { Ndb } from "../Models/General/Ndb";

export class NavaidFactory
{
    public static create(data: string): Navaid
    {
        if(data.startsWith("3")) {
            return NavaidFactory.createVor(data);
        } else if(data.startsWith("2")) {
            return NavaidFactory.createNdb(data);
        } else

        throw new Error();
    }

    private static createVor(data: string): Vor
    {
        const regex = /^3\s+(\-?\d+\.\d+)\s+(\-?\d+\.\d+)\s+(\-?\d+)\s+(\d+)\s+(\d+)\s+(\-?\d+.\d+)\s+(\w+)\s+(\w+)\s+(\w+)\s+(.+)$/i;
        const res = data.match(regex);

        if(!res || res.length != 11) {
            throw new Error("Line does not contain correct format");
        }

        const lat = parseFloat(res[1]);
        const lon = parseFloat(res[2]);
        //const elevation = parseInt(res[3]);
        const frequency = parseInt(res[4])/100;
        //const vorClass = res[5];
        //const variation = parseFloat(res[6]);
        const identifier = res[7];
        //const terminalArea = res[8];
        const regionCode = res[9];
        const spokenName = res[9];

        return new Vor(lat, lon, identifier, regionCode, spokenName, frequency);
    }

    private static createNdb(data: string): Vor
    {
        const regex = /^2\s+(\-?\d+\.\d+)\s+(\-?\d+\.\d+)\s+(\-?\d+)\s+(\d+)\s+(\d+)\s+(\-?\d+.\d+)\s+(\w+)\s+(\w+)\s+(\w+)\s+(.+)$/i;
        const res = data.match(regex);

        if(!res || res.length != 11) {
            throw new Error("Line does not contain correct format");
        }

        const lat = parseFloat(res[1]);
        const lon = parseFloat(res[2]);
        //const elevation = parseInt(res[3]);
        const frequency = parseInt(res[4]);
        //const ndbClass = res[5];
        //const flags = parseFloat(res[6]);
        const identifier = res[7];
        //const terminalArea = res[8];
        const regionCode = res[9];
        const spokenName = res[9];

        return new Ndb(lat, lon, identifier, regionCode, spokenName, frequency);
    }
}