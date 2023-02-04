import { getBearing } from "aviation-math";
import { ProcedureWaypoint } from "../ProcedureWaypoint";
import Leg from "./Leg";

export default class TFLeg extends Leg {
    public constructor(from: ProcedureWaypoint, to: ProcedureWaypoint) {
        const bearing = getBearing(from.fix, to.fix);

        from.outboundCourse = bearing;
        to.inboundCourse = bearing;

        super(from, to);
    }
}