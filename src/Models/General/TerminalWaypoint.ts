import { Waypoint } from "./Waypoint";

export class TerminalWaypoint extends Waypoint
{
    protected _terminalArea: string;

    public constructor(lat: number, lon: number, identifier: string, regionCode: string, spokenName: string, type: number, terminalArea: string)
    {
        super(lat, lon, identifier, regionCode, spokenName, type);

        this._terminalArea = terminalArea;
    }

    public get terminalArea(): string
    {
        return this._terminalArea
    }
}