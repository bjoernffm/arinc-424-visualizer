import Fix from "./Fix";

export default class Navaid extends Fix {
    protected _frequency: number;

    public constructor(lat: number, lon: number, identifier: string, regionCode: string, spokenName: string, frequency: number) {
        super(lat, lon, identifier, regionCode, spokenName);

        this._frequency = frequency;
    }

    public get frequency(): number {
        return this._frequency;
    }
}
