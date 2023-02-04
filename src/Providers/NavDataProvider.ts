import { Fix } from "../Models/General/Fix";
import { Identifier, RegionCode } from "../Types";

export class NavDataProvider
{
    protected _map: Map<Identifier, Map<RegionCode, Fix>>;

    public constructor(map: Map<Identifier, Map<RegionCode, Fix>>)
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