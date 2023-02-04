import { Position } from "aviation-math";
import { PRecord } from "./PRecord";

export class PGRecord extends PRecord {
    private _position: Position | null = null;

    constructor(data: string[]) {
        super(data);

        //console.log(this.data);
        if(typeof this.data[9] !== undefined && typeof this.data[10] !== undefined) {
            this._position = new Position(this.data[9] + "," + this.data[10]);
        }
    }

    public get id(): string {
        return this.data[1];
    }

    public get gradient(): string {
        return this.data[2];
    }

    public get landing_threshold_elevation(): string {
        return this.data[4];
    }

    public get hasLocation(): boolean {
        return (this._position !== null);
    }

    public get lat(): number {
        if(this.hasLocation === false)
            return 0;

        return this._position!.lat;
    }

    public get lon(): number {
        if(this.hasLocation === false)
            return 0;

        return this._position!.lon;
    }
}