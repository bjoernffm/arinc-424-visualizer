import { Position } from "aviation-math";

export class EARecord extends Position
{
    protected _id: string;
    protected _region_code: string;
    protected _waypoint_type: WaypointType;
    protected _spoken_name: string;

    public constructor(lat: number, lon: number, id: string, region_code: string, waypoint_type: WaypointType, spoken_name: string) {
        super(lat, lon);

        this._id = id;
        this._region_code = region_code;
        this._waypoint_type = waypoint_type;
        this._spoken_name = spoken_name;
    }

    public get id() {
        return this._id;
    }

    public get region_code() {
        return this._region_code;
    }

    public get waypoint_type() {
        return this._waypoint_type;
    }

    public get spoken_name() {
        return this._spoken_name;
    }
}

export class WaypointType
{
    private _waypoint_type: number;

    public constructor(waypoint_type: number) {
        this._waypoint_type = waypoint_type;
    }
}