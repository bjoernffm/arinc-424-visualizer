import Fix from "./Fix";

export default class Waypoint extends Fix
{
    protected _type: number;

    public constructor(lat: number, lon: number, identifier: string, regionCode: string, spokenName: string, type: number)
    {
        super(lat, lon, identifier, regionCode, spokenName);

        this._type = type;
    }

    public get type(): number
    {
        return this._type
    }
}