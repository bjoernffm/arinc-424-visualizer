import { getBearing } from "aviation-math";
import { Fix } from "../../General";
import { ProcedureWaypoint } from "../ProcedureWaypoint";
import Leg from "./Leg";

export default class CFLeg extends Leg {
    public constructor(from: ProcedureWaypoint, fix: Fix, course: number)
    {
        const bearing = getBearing(from.fix, fix);
        if (Math.abs(bearing-course) < 2) {
            // almost same course
            const toWp = new ProcedureWaypoint(fix);

            from.outboundCourse = course;
            toWp.inboundCourse = course;

            super(from, toWp);
        } else {
            throw new Error("ToDo");
        }
    }
}
