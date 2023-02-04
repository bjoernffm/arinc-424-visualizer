import { Fix } from "../General";
import { Leg } from "./Legs";

class FlightAttributes {
    public altitudeDescription: string|null = null;
    public altitude1: number|null = null;
    public speedLimitDescription: string|null = null;
    public speedLimit: number|null = null;
}

export class ProcedureWaypoint {
    public nextLeg: Leg | null = null;
    public previousLeg: Leg | null = null;

    public constraints: FlightAttributes = new FlightAttributes();
    public description: string | null = null;
    public overfly: boolean = false;
    public inboundCourse: number | null = null;
    public outboundCourse: number | null = null;
    public fix: Fix;

    public constructor(fix: Fix) {
        this.fix = fix;
    }

    public toString(): string {
        let parts = [];

        if(this.inboundCourse) {
            parts.push(`--${Math.round(this.inboundCourse)}°-->`);
        }

        if(this.fix.identifier) {
            parts.push(`id: ${this.fix.identifier}`);
        }

        if(this.outboundCourse) {
            parts.push(`--${Math.round(this.outboundCourse)}°-->`);
        }
        /*if(this.constraints.altitudeDescription) {
            parts.push(`altitudeDescription: ${this.constraints.altitudeDescription}`);
        }
        if(this.constraints.altitude1) {
            parts.push(`altitude1: ${this.constraints.altitude1}`);
        }
        if(this.constraints.speedLimitDescription) {
            parts.push(`speedLimitDescription: ${this.constraints.speedLimitDescription}`);
        }
        if(this.constraints.speedLimit) {
            parts.push(`speedLimit: ${this.constraints.speedLimit}`);
        }*/
        
        return `${this.constructor.name}(${parts.join(", ")})`;
    }
}

class WaypointDescriptionCode {
    private firstCharacterToValue(character: string) {
        const map = {
            A: "Airport as Waypoint",
            E: "Essential Waypoint",
            F: "Off Airway Waypoint",
            G: "Runway as Waypoint",
            H: "Heliport as Waypoint",
            N: "NDB navaid as Waypoint",
            P: "Phantom Waypoint",
            R: "Non-Essential Waypoint",
            T: "Transition Essential Waypoint",
            V: "VHF Navaid as Waypoint"
        }
    }
}
