import { Navaid } from "../Models/General/Navaid";
import { Identifier, RegionCode } from "../Types";

export class NavaidProvider {
    protected navaids: Map<Identifier, Map<RegionCode, Navaid>>;

    public constructor(map: Map<Identifier, Map<RegionCode, Navaid>>) {
        this.navaids = map;
    }

    public get(id: string, regionCode: string): Navaid {
        if(this.navaids.has(id) && this.navaids.get(id)!.has(regionCode)) {
            return this.navaids.get(id)!.get(regionCode)!;
        }

        throw new Error(`No fix found (id: ${id}, region_code: ${regionCode})`);
    }
}