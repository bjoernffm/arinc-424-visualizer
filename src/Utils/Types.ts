import { Fix } from "../Models/General";
import { PDRecord, PGRecord, PERecord, PFRecord } from "../Models/Records";

export type Identifier = string;
export type RegionCode = string;
export type ProcedureType = string;

export type PXRecordList = (PDRecord|PGRecord|PERecord|PFRecord)[];
export type ProcedureProviderMap = Map<ProcedureType, Map<Identifier, PXRecordList>>
export type NavDataMap = Map<Identifier, Map<RegionCode, Fix>>