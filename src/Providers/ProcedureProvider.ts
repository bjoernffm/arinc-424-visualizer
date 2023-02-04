import { ProcedureFactory } from "../Factories/ProcedureFactory";
import { Procedure } from "../Models/Procedure/Procedure";
import { PDRecord } from "../Models/Records";
import { ProcedureProviderMap, Identifier } from "../Utils/Types";
import NavDataProvider from "./NavDataProvider";

export default class ProcedureProvider
{
    protected _map: ProcedureProviderMap;

    public constructor(map: ProcedureProviderMap)
    {
        this._map = map;
    }

    public getSid(identifier: Identifier, navData: NavDataProvider): Procedure
    {
        if (this._map.get("SID")!.has(identifier) == false) {
            throw new Error(`SID "${identifier}" does not exist`);
        } 

        return ProcedureFactory.create(this._map.get("SID")!.get(identifier) as PDRecord[], this._map, navData);
    }

    /*public getRwy(identifier: Identifier): Procedure
    {
        if (this._map.get("RWY")!.has(identifier) == false) {
            throw new Error(`RWY "${identifier}" does not exist`);
        } 

        return ProcedureFactory.create(this._map.get("SID")!.get(identifier) as PGRecord[], this._map);
    }*/
}