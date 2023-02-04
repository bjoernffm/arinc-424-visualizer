import { Path as AMPath } from "aviation-math";

export default class Path extends AMPath
{
    public toCesiumArray(): number[]
    {
        return this._positions.map(pos => [pos.lon, pos.lat, 100]).flat();
    }
}