import { PDRecord, PERecord, PFRecord, PGRecord } from "../Models/Records";

export class RecordFactory {
    public static create(data: string): PDRecord|PERecord|PFRecord|PGRecord {
        const regex = /^([A-Z]+):(.+);.*$/s;
        const res = data.match(regex);

        if (!res || res.length != 3) {
            throw new Error("Line does not contain correct format");
        }

        const type = res[1]; // STAR,SID,RWY,etc.
        const values = [type, ...res[2].split(/[,;]/).map(column => column.trim())];

        if (type == "SID") {
            return new PDRecord(values);
        } else if (type == "STAR") {
            return new PERecord(values);
        } else if (type == "APPCH") {
            return new PFRecord(values);
        } else if (type == "RWY") {
            return new PGRecord(values);
        } else {
            return new PFRecord(values);
        }
    }
}
