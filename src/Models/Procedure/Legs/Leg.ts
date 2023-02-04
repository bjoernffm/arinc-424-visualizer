import { Path } from "aviation-math";
import { ProcedureWaypoint } from "../ProcedureWaypoint";

export default class Leg {
    private _from: ProcedureWaypoint;
    private _to: ProcedureWaypoint;
    public distance: number = 0;
    public betweenPath: Path = new Path;

    public turnDirection: string | null = null;

    public constructor(from: ProcedureWaypoint, to: ProcedureWaypoint) {
        this._from = from;
        this._from.nextLeg = this;
        this._to = to;
        this._to.previousLeg = this;
    }

    public set from(wp: ProcedureWaypoint)
    {
        this._from = wp;
        this._from.nextLeg = this;
    }

    public get from(): ProcedureWaypoint
    {
        return this._from;
    }

    public set to(wp: ProcedureWaypoint)
    {
        this._to = wp;
        this._to.previousLeg = this;
    }

    public get to(): ProcedureWaypoint
    {
        return this._to;
    }

    public toString(): string {
        let parts = [];
        if(this.turnDirection) {
            parts.push(`turnDirection: ${this.turnDirection}`);
        }
        
        return `${this.constructor.name}(${parts.join(", ")})`;
    }
}
