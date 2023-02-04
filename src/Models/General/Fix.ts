import { Position } from "aviation-math";

export default class Fix extends Position
{
    protected _identifier: string;
    protected _regionCode: string;
    protected _spokenName: string;

    public constructor(lat: number, lon: number, identifier: string, regionCode: string, spokenName: string) {
        super(lat, lon);

        this._identifier = identifier;
        this._regionCode = regionCode;
        this._spokenName = spokenName;
    }

    public get identifier() {
        return this._identifier;
    }

    public get regionCode() {
        return this._regionCode;
    }

    public get spokenName() {
        return this._spokenName;
    }
}