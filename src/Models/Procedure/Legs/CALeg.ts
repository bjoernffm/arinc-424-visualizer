import { projectBearingDistance } from "aviation-math";
import { Fix } from "../../General";
import { ProcedureWaypoint } from "../ProcedureWaypoint";
import Leg from "./Leg";

export default class CALeg extends Leg {
    public constructor(from: ProcedureWaypoint, course: number, altitude: number) {
        let to = projectBearingDistance(from.fix, course, (altitude/500));
        let toFix = new Fix(to.lat, to.lon, "ALTITUDE INTERCEPT", "", "ALTITUDE INTERCEPT");
        let toWp = new ProcedureWaypoint(toFix);
        toWp.constraints.altitude1 = altitude;

        from.outboundCourse = course;
        toWp.inboundCourse = course;

        super(from, toWp);
    }
}