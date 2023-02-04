import { FlybyTurnTransition, getTurnRadius, Position, projectTurnPosition, TurnDirection } from "aviation-math";
import { DFLeg } from "./Legs";
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

    public to3dLine()
    {
        const radius = getTurnRadius(210, 25);
        let parts: {
            lat: number,
            lon: number,
            altitude: number | null,
            lowerAltitude: number,
            distance: number,
            totalDistance: number
        }[] = [];
        let currentWP = this.firstWaypoint;

        parts.push({
            lat: currentWP.fix.lat,
            lon: currentWP.fix.lon,
            altitude: currentWP.constraints.altitude1!*0.3048,
            lowerAltitude: currentWP.constraints.altitude1!*0.3048,
            distance: 0,
            totalDistance: 0
        })

        while(currentWP.nextLeg) {
            if(currentWP.nextLeg instanceof DFLeg) {
                if(currentWP.nextLeg.turnDirection == "R") {
                    for(let i = 0; i < 360; i++) {
                        let nextCourse = ((currentWP.outboundCourse!+i) % 360);
                        let point = projectTurnPosition(currentWP.fix, currentWP.outboundCourse!, nextCourse, radius, TurnDirection.RIGHT);

                        parts.push({
                            lat: point.lat,
                            lon: point.lon,
                            altitude: null,
                            lowerAltitude: 0,
                            distance: 0,
                            totalDistance: 0
                        });

                        //console.log(nextCourse, currentWP.nextLeg.to.inboundCourse!, Math.abs(nextCourse-currentWP.nextLeg.to.inboundCourse!))
                        if(Math.abs(nextCourse-currentWP.nextLeg.to.inboundCourse!) < 1) {
                            break;
                        }
                    }
                } else {
                    for(let i = 0; i < 360; i++) {
                        let nextCourse = ((currentWP.outboundCourse!-i+360) % 360);
                        let point = projectTurnPosition(currentWP.fix, currentWP.outboundCourse!, nextCourse, radius, TurnDirection.LEFT);

                        parts.push({
                            lat: point.lat,
                            lon: point.lon,
                            altitude: null,
                            lowerAltitude: 0,
                            distance: 0,
                            totalDistance: 0
                        });

                        //console.log(nextCourse, currentWP.nextLeg.to.inboundCourse!, Math.abs(nextCourse-currentWP.nextLeg.to.inboundCourse!))
                        if(Math.abs(nextCourse-currentWP.nextLeg.to.inboundCourse!) < 1) {
                            break;
                        }
                    }
                }
            }

            currentWP = currentWP.nextLeg.to;
            
            if(currentWP.inboundCourse && currentWP.outboundCourse) {
                const transition = new FlybyTurnTransition({
                    flybyWaypoint: currentWP.fix,
                    inboundCourse: Math.round(currentWP.inboundCourse!),
                    outboundCourse: Math.round(currentWP.outboundCourse!),
                    turnRadius: radius
                });
                
                const path = transition.generatePath();
                const middleIndex = Math.floor(path.length/2);
                for(let i = 0; i < path.length; i++) {
                    if(middleIndex == i) {
                        parts.push({
                            lat: path.get(i).lat,
                            lon: path.get(i).lon,
                            altitude: currentWP.constraints.altitude1!*0.3048,
                            lowerAltitude: 0,
                            distance: 0,
                            totalDistance: 0
                        });
                    } else {
                        parts.push({
                            lat: path.get(i).lat,
                            lon: path.get(i).lon,
                            altitude: null,
                            lowerAltitude: 0,
                            distance: 0,
                            totalDistance: 0
                        });
                    }
                    
                }
            } else {
                parts.push({
                    lat: currentWP.fix.lat,
                    lon: currentWP.fix.lon,
                    altitude: currentWP.constraints.altitude1!*0.3048,
                    lowerAltitude: 0,
                    distance: 0,
                    totalDistance: 0
                });                
            }
        }

        //console.log(parts[0].lat.toFixed(4), parts[0].lon.toFixed(4), parts[0].altitude?.toFixed(), parts[0].distance, parts[0].totalDistance);
        let total = 0;
        let lowerAltitude = parts[0].altitude as number;
        for(let i = 1; i < parts.length; i++) {
            parts[i].distance = new Position(parts[i].lat, parts[i].lon).getDistanceTo(new Position(parts[i-1].lat, parts[i-1].lon));
            total += parts[i].distance;
            parts[i].totalDistance = total;
            //console.log(parts[i].lat.toFixed(4), parts[i].lon.toFixed(4), parts[i].altitude?.toFixed(), parts[i].distance.toFixed(3), parts[i].totalDistance.toFixed(3));
            if(parts[i].altitude !== null) {
                total = 0;
                lowerAltitude = parts[i].altitude as number;
                parts[i].lowerAltitude = lowerAltitude;
            } else {
                parts[i].lowerAltitude = lowerAltitude;
            }
        }

        let altitude = 0;
        for(let i = parts.length-1; i >= 0; i--) {
            if(parts[i].altitude !== null) {
                parts[i].distance = parts[i].totalDistance;
                total = parts[i].totalDistance;
                altitude = parts[i].altitude!;
            } else {
                parts[i].distance = parts[i].totalDistance;
                parts[i].totalDistance = total;
                parts[i].altitude = parts[i].lowerAltitude + ((altitude-parts[i].lowerAltitude) * (parts[i].distance / parts[i].totalDistance));
            }
            //console.log(parts[i].lat.toFixed(4), parts[i].lon.toFixed(4), parts[i].lowerAltitude?.toFixed(), parts[i].altitude?.toFixed(), parts[i].distance.toFixed(3), parts[i].totalDistance.toFixed(3));
        }

        let final = [];

        for(let i = 0; i < parts.length; i++) {
            final.push(parts[i].lon);
            final.push(parts[i].lat);
            final.push(parts[i].altitude);
        }

        return final;
    }
}