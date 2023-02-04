import { Fix } from "../Models/General";
import { Leg, TFLeg, DFLeg, CFLeg, CALeg, CDLeg } from "../Models/Procedure/Legs";
import { Procedure } from "../Models/Procedure/Procedure";
import { ProcedureWaypoint } from "../Models/Procedure/ProcedureWaypoint";
import { PDRecord, PGRecord } from "../Models/Records";
import { NavDataProvider } from "../Providers";
import { PXRecordList, ProcedureProviderMap } from "../Utils/Types";

export class ProcedureFactory {
    public static create(pxRecords: PXRecordList, map: ProcedureProviderMap, navData: NavDataProvider): Procedure
    {
        if (pxRecords.length <= 0) {
            throw new Error("No records given");
        }

        if (pxRecords[0] instanceof PDRecord) {
            return ProcedureFactory.createSid(pxRecords as PDRecord[], map, navData);
        } else {
            throw new Error("ToDo");
        }
    }

    public static createSid(records: PDRecord[], map: ProcedureProviderMap, navData: NavDataProvider): Procedure
    {
        let from: ProcedureWaypoint;
        let to: ProcedureWaypoint;
        let leg: Leg;

        const runway = map.get("RWY")!.get(records[0].transitionId)![0] as PGRecord;

        const firstFix = new Fix(runway.lat, runway.lon, runway.id, "LC", runway.id);
        const first = new ProcedureWaypoint(firstFix);
        first.constraints.altitude1 = parseInt(runway.landing_threshold_elevation);
        from = first;

        records.forEach(record => {
            if (record.path_and_terminator == "TF") {
                to = new ProcedureWaypoint(navData.get(record.fix.id, record.fix.regionCode));
                leg = new TFLeg(from, to);
            } else if (record.path_and_terminator == "DF") {
                to = new ProcedureWaypoint(navData.get(record.fix.id, record.fix.regionCode));
                leg = new DFLeg(from, to, record.turn_direction);
            } else if (record.path_and_terminator == "CF") {
                try {
                    leg = new CFLeg(from, navData.get(record.fix.id, record.fix.regionCode), parseInt(record.magneticCourse)/10);
                    to = leg.to;
                } catch (e) {
                    // todo
                    throw e;
                }
            } else if (record.path_and_terminator == "CA") {
                leg = new CALeg(from, parseInt(record.magneticCourse)/10, parseInt(record.altitude1));
                to = leg.to;
            } else if (record.path_and_terminator == "VA") {
                leg = new CALeg(from, parseInt(record.magneticCourse)/10, parseInt(record.altitude1));
                to = leg.to;
            } else if (record.path_and_terminator == "CD") {
                const recommended_navaid = navData.get(record.recommended_navaid.id, record.recommended_navaid.regionCode);
                leg = new CDLeg(from, recommended_navaid, parseInt(record.magneticCourse)/10, parseInt(record.distance_time)/10);
                to = leg.to;
            } else if (record.path_and_terminator == "VD") {
                const recommended_navaid = navData.get(record.recommended_navaid.id, record.recommended_navaid.regionCode);
                leg = new CDLeg(from, recommended_navaid, parseInt(record.magneticCourse)/10, parseInt(record.distance_time)/10);
                to = leg.to;
            }

            if (record.altitudeDescription != "") {
                to.constraints.altitudeDescription = record.altitudeDescription;
            }
            if (record.altitude1 != "") {
                to.constraints.altitude1 = parseInt(record.altitude1);
            }
            if (record.speedLimitDescription != "") {
                to.constraints.speedLimitDescription = record.speedLimitDescription;
            }
            if (record.speedLimit != "") {
                to.constraints.speedLimit = parseInt(record.speedLimit);
            }

            from = to;
        });

        return new Procedure(records[0].routeId, first);
    }
}
