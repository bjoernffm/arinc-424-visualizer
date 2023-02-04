import { EARecord, WaypointType } from "./EARecord";
import { PCRecord } from "./PCRecord";

type FixId = string;
type RegionCode = string;

export class FixContainer {
    protected fixes: Map<FixId, Map<RegionCode, PCRecord|EARecord>>;

    public constructor(fixes: Array<EARecord|PCRecord>) {
        this.fixes = new Map();

        fixes.map(fix => {
            if(this.fixes.has(fix.id)) {
                this.fixes.get(fix.id)!.set(fix.region_code, fix);
            } else {
                let newMap: Map<RegionCode, PCRecord|EARecord> = new Map();
                newMap.set(fix.region_code, fix);
                this.fixes.set(fix.id, newMap);
            }
        });
    }

    public getFix(id: string, region_code: string): PCRecord|EARecord {
        if(this.fixes.has(id) && this.fixes.get(id)!.has(region_code)) {
            return this.fixes.get(id)!.get(region_code)!;
        }

        throw new Error(`No fix found (id: ${id}, region_code: ${region_code})`);
    }

    static fromXplane12NavData(navData: string): FixContainer {
        let lines = navData.split("\n");

        if (lines[0].trim() != "I") {
            throw new Error("Missing proper file format");
        }
        if (lines[1].trim().startsWith("1200 Version") === false) {
            throw new Error("Missing proper file format");
        }

        const fixes = [];

        for(let i = 2; i < lines.length; i++) {
            let line = lines[i].trim();

            if(line.length == 0) {
                continue;
            }
            if(line == "99") {
                break;
            }

            fixes.push(this.getFixFromLine(line));
        }

        return new FixContainer(fixes);
    }

    static getFixFromLine(line: string): EARecord | PCRecord {
        const regex = /^\s*(\-?\d+\.\d+)\s+(\-?\d+\.\d+)\s+(\w+)\s+(\w+)\s+(\w+)\s+(\d+)\s+(.+)$/s;
        const res = line.match(regex);


        if(!res || res.length != 8) {
            throw new Error("Line does not contain correct format");
        }

        const lat = parseFloat(res[1]);
        const lon = parseFloat(res[2]);
        const id = res[3];
        const terminal_area = res[4];
        const region_code = res[5];
        const waypoint_type = parseInt(res[6]);
        const spoken_name = res[7].trim();

        if(terminal_area == "ENRT") {
            return new EARecord(lat, lon, id, region_code, new WaypointType(waypoint_type), spoken_name);
        }

        return new PCRecord(lat, lon, id, terminal_area, region_code, new WaypointType(waypoint_type), spoken_name);
    }
}