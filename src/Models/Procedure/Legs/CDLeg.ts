import { getDistance, projectBearingDistance } from "aviation-math";
import { Fix } from "../../General";
import { ProcedureWaypoint } from "../ProcedureWaypoint";
import Leg from "./Leg";

export default class CDLeg extends Leg {
    public constructor(from: ProcedureWaypoint, fix: Fix, course: number, distance: number)
    {
        for (let i = 0; i < 200; i += 0.1) {
            const to = projectBearingDistance(from.fix, course, i);
            const distancetmp = getDistance(to, fix);

            if (Math.abs(distance-distancetmp) < 0.1 || distancetmp > distance) {
                const toFix = new Fix(to.lat, to.lon, "DISTANCE INTERCEPT", "", "DISTANCE INTERCEPT");
                const toWp = new ProcedureWaypoint(toFix);

                from.outboundCourse = course;
                toWp.inboundCourse = course;

                super(from, toWp);
                break;
            }
        }
    }
}
