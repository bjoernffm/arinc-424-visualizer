import { ProcedureWaypoint } from "../ProcedureWaypoint";

export class Leg {
    public from: ProcedureWaypoint;
    public to: ProcedureWaypoint;
    public distance: number = 0;

    public turnDirection: string | null = null;

    public constructor(from: ProcedureWaypoint, to: ProcedureWaypoint) {
        this.from = from;
        this.to = to;

        this.from.nextLeg = this;
        this.to.previousLeg = this;
    }

    public toString(): string {
        let parts = [];
        if(this.turnDirection) {
            parts.push(`turnDirection: ${this.turnDirection}`);
        }
        
        return `${this.constructor.name}(${parts.join(", ")})`;
    }
}
