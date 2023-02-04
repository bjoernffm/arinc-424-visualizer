import { EARecord, WaypointType } from "./EARecord";

export class PCRecord extends EARecord
{
    protected _terminal_area: string;

    public constructor(lat: number, lon: number, id: string, terminal_area: string, region_code: string, waypoint_type: WaypointType, spoken_name: string) {
        super(lat, lon, id, region_code, waypoint_type, spoken_name)

        this._terminal_area = terminal_area;
    }

    public get region_code() {
        return this._region_code;
    }
}
