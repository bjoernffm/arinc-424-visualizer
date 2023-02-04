export class PRecord {
    protected data: string[];

    constructor(data: string[]) {
        this.data = data;
    }

    public get recordType(): string {
        return this.data[0];
    }
}