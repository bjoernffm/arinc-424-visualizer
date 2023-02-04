import { FileReader } from "../Providers/FileReader";
import { PDRecord, PERecord, PFRecord } from "./PDRecord";
import { PGRecord } from "./PGRecord";
import { PRecord } from "./PRecord";

type ProcedureId = string;
type RouteType = string;

export class ProcedureRecords
{
    public procedureRecords: Map<RouteType, Map<ProcedureId, PRecord[]>>;

    public constructor(procedureRecords: PRecord[]) {
        this.procedureRecords = new Map();
        this.procedureRecords.set("SID", new Map());
        this.procedureRecords.set("STAR", new Map());
        this.procedureRecords.set("APPCH", new Map());
        this.procedureRecords.set("PRDAT", new Map());
        this.procedureRecords.set("RWY", new Map());

        procedureRecords.forEach(procedureRecord => {
            if(procedureRecord instanceof PDRecord) {
                if(this.procedureRecords.get(procedureRecord.recordType)!.has(procedureRecord.routeId)) {
                    let arr = this.procedureRecords.get(procedureRecord.recordType)!.get(procedureRecord.routeId)!;
                    arr.push(procedureRecord);
                    this.procedureRecords.get(procedureRecord.recordType)!.set(procedureRecord.routeId, arr);
                } else {
                    this.procedureRecords.get(procedureRecord.recordType)!.set(procedureRecord.routeId, [procedureRecord]);
                }
            }
            if(procedureRecord instanceof PGRecord) {
                if(this.procedureRecords.get(procedureRecord.recordType)!.has(procedureRecord.id)) {
                    let arr = this.procedureRecords.get(procedureRecord.recordType)!.get(procedureRecord.id)!;
                    arr.push(procedureRecord);
                    this.procedureRecords.get(procedureRecord.recordType)!.set(procedureRecord.id, arr);
                } else {
                    this.procedureRecords.get(procedureRecord.recordType)!.set(procedureRecord.id, [procedureRecord]);
                }
            }
        });
    }

    static fromXplane12NavData(path: string): ProcedureRecords {
        let lines = FileReader.getLinesFromFile(path);

        const records: PRecord[] = [];
        for(let i = 0; i < lines.length; i++) {
            let line = lines[i].trim();

            if(line.length == 0) {
                continue;
            }

            records.push(this.getRecordFromLine(line));
        }
        
        return new ProcedureRecords(records);
    }

    static getRecordFromLine(line: string): PRecord {
        const regex = /^([A-Z]+):(.+);.*$/s;
        const res = line.match(regex);

        if(!res || res.length != 3) {
            throw new Error("Line does not contain correct format");
        }

        const type = res[1]; // STAR,SID,RWY,etc.
        const data = [type, ...res[2].split(/[,;]/).map(x => x.trim())];

        if(type == "SID") {
            return new PDRecord(data);
        } else if(type == "STAR") {
            return new PERecord(data);
        } else if(type == "APPCH") {
            return new PFRecord(data);
        } else if(type == "RWY") {
            return new PGRecord(data);
        } else {
            return new PFRecord(data);
        }
    }
}