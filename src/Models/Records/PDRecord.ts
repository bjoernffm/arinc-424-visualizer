import PXRecord from "./PXRecord";

export default class PDRecord extends PXRecord {
    public get recordType(): string {
        return this.data[0];
    }

    public get sequenceNo(): string {
        return this.data[1];
    }

    public get routeType(): string {
        return this.data[2];
    }

    public get routeId(): string {
        return this.data[3];
    }

    public get transitionId(): string {
        return this.data[4];
    }

    public get fix(): {id: string, regionCode: string, sectionCode: string, subSectionCode: string} {
        return {
            id: this.data[5],
            regionCode: this.data[6],
            sectionCode: this.data[7],
            subSectionCode: this.data[8]
        };
    }

    public get recommended_navaid(): {id: string, regionCode: string, sectionCode: string, subSectionCode: string} {
        return {
            id: this.data[14],
            regionCode: this.data[15],
            sectionCode: this.data[16],
            subSectionCode: this.data[17]
        };
    }

    public get turn_direction(): string {
        return this.data[10];
    }

    public get path_and_terminator(): string {
        return this.data[12];
    }

    public get magneticCourse(): string {
        return this.data[21];
    }

    public get distance_time(): string {
        return this.data[22];
    }

    public get altitudeDescription(): string {
        return this.data[23];
    }

    public get altitude1(): string {
        return this.data[24];
    }

    public get speedLimitDescription(): string {
        return this.data[29];
    }

    public get speedLimit(): string {
        return this.data[30];
    }
}
