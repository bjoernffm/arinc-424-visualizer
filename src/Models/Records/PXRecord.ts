export default class PXRecord {
    protected data: string[];

    constructor(data: string[]) {
        this.data = data;
    }

    public get recordType(): string {
        return this.data[0];
    }
}