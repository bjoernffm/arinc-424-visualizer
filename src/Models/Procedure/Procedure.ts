import { FlybyTurnTransition, FlyoverTurnTransition, getTurnRadius, TurnDirection} from "aviation-math";
import { Path } from "../General";
import { ProcedureWaypoint } from "./ProcedureWaypoint";

export class Procedure {
    public id: string;
    public firstWaypoint: ProcedureWaypoint;

    public constructor(id: string, firstWaypoint: ProcedureWaypoint) {
        this.id = id;
        this.firstWaypoint = firstWaypoint;
    }

    public toString(): string
    {
        let parts = [];
        let currentWP = this.firstWaypoint;
        parts.push(currentWP.toString());

        while(currentWP.nextLeg) {
            parts.push(currentWP.nextLeg.toString());
            currentWP = currentWP.nextLeg.to;
            parts.push(currentWP.toString());
        }

        return parts.join(" ");
    }

    public toPath(): Path
    {
        const radius = getTurnRadius(210, 25);
        const path = new Path();

        let currentWP = this.firstWaypoint;
        path.append(currentWP.fix);

        while(currentWP.nextLeg) {

            if(currentWP.nextLeg.betweenPath.length > 0) {
                path.appendPath(currentWP.nextLeg.betweenPath);
            }

            currentWP = currentWP.nextLeg.to;
            
            if(currentWP.inboundCourse && currentWP.outboundCourse) {
                let transition;
                if(currentWP.overfly === true) {
                    // ToDo
                    transition = new FlyoverTurnTransition({
                        flyoverWaypoint: currentWP.fix,
                        inboundCourse: Math.round(currentWP.inboundCourse!),
                        outboundCourse: Math.round(currentWP.outboundCourse!),
                        turnRadius: radius,
                        turnDirection: TurnDirection.RIGHT
                    });
                } else {
                    transition = new FlybyTurnTransition({
                        flybyWaypoint: currentWP.fix,
                        inboundCourse: Math.round(currentWP.inboundCourse!),
                        outboundCourse: Math.round(currentWP.outboundCourse!),
                        turnRadius: radius
                    });
                }

                path.appendPath(transition.toPath());
            } else {
                path.append(currentWP.fix);           
            }
        }

        return path;
    }
}