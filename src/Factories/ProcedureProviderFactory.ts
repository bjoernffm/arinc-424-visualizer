import { PDRecord, PGRecord } from "../Models/Records";
import PXRecord from "../Models/Records/PXRecord";
import { ProcedureProvider } from "../Providers";
import FileReader from "../Utils/FileReader";
import { ProcedureProviderMap } from "../Utils/Types";
import { RecordFactory } from "./RecordFactory";

export default class ProcedureProviderFactory {

    public static createFromXP12(path: string): ProcedureProvider {
        const records = FileReader.getLinesFromFile(path)
                            .filter(line => line.length > 0)
                            .map(line => RecordFactory.create(line));

        const map = ProcedureProviderFactory.getMap();

        records.forEach(record => ProcedureProviderFactory.putMapEntry(record, map));

        return new ProcedureProvider(map);
    }

    private static putMapEntry(record: PXRecord, map: ProcedureProviderMap)
    {
        if(record instanceof PDRecord) {
            if(map.get(record.recordType)!.has(record.routeId)) {
                let arr = map.get(record.recordType)!.get(record.routeId)!;
                arr.push(record);
                map.get(record.recordType)!.set(record.routeId, arr);
            } else {
                map.get(record.recordType)!.set(record.routeId, [record]);
            }
        }
        if(record instanceof PGRecord) {
            if(map.get(record.recordType)!.has(record.id)) {
                let arr = map.get(record.recordType)!.get(record.id)!;
                arr.push(record);
                map.get(record.recordType)!.set(record.id, arr);
            } else {
                map.get(record.recordType)!.set(record.id, [record]);
            }
        }
    }

    private static getMap(): ProcedureProviderMap
    {
        const map = new Map();
        map.set("SID", new Map());
        map.set("STAR", new Map());
        map.set("APPCH", new Map());
        map.set("PRDAT", new Map());
        map.set("RWY", new Map());

        return map;
    }
}