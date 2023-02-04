import { getBearing, getTurnRadius, projectTurnPosition, TurnDirection } from "aviation-math";
import { ProcedureWaypoint } from "../ProcedureWaypoint";
import { Leg } from "./Leg";

export class DFLeg extends Leg {
    public constructor(from: ProcedureWaypoint, to: ProcedureWaypoint, turnDirection: string) {

        if(from.previousLeg) {
            from.outboundCourse = from.previousLeg.to.inboundCourse!;
            const turnInboundCourse = from.outboundCourse;

            const radius = getTurnRadius(210, 25);

            if(turnDirection == "R") {                
                for(let i = 0; i < 360; i++) {
                    let turnEnd;
                    turnEnd = projectTurnPosition(
                        from.fix,
                        turnInboundCourse,
                        ((turnInboundCourse+i)%360),
                        radius,
                        TurnDirection.RIGHT
                    );

                    const bearing = getBearing(turnEnd, to.fix);
                    //console.log(bearing, ((turnInboundCourse+i)%360), Math.abs(bearing-((turnInboundCourse+i)%360)))
                    if(Math.abs(bearing-((turnInboundCourse+i)%360)) < 1) {
                        to.inboundCourse = bearing;
                    }
                }
            } else {
                for(let i = 0; i < 360; i++) {
                    let turnEnd;
                    turnEnd = projectTurnPosition(
                        from.fix,
                        turnInboundCourse,
                        ((turnInboundCourse-i+360)%360),
                        radius,
                        TurnDirection.LEFT
                    );

                    const bearing = getBearing(turnEnd, to.fix);
                    //console.log(bearing, ((turnInboundCourse+i)%360), Math.abs(bearing-((turnInboundCourse+i)%360)))
                    if(Math.abs(bearing-((turnInboundCourse+i+360)%360)) < 1) {
                        to.inboundCourse = bearing;
                    }
                }
            }
        } else {
            const bearing = getBearing(from.fix, to.fix);

            from.outboundCourse = bearing;
            to.inboundCourse = bearing;
        }

        super(from, to);

        this.turnDirection = turnDirection;
    }
}
