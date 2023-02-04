import { Fix } from "../Models/General";
import { NavDataMap } from "../Utils/Types";

export default class NavDataProvider
{
    protected _map;

    public constructor(map: NavDataMap)
    {
        this._map = map;
    }

    public get(identifier: string, regionCode: string): Fix {
        if(this._map.has(identifier) && this._map.get(identifier)!.has(regionCode)) {
            return this._map.get(identifier)!.get(regionCode)!;
        }

        throw new Error(`No fix found (id: ${identifier}, region_code: ${regionCode})`);
    }
}