import fetch from 'cross-fetch';
import ThermalFile from './thermalFile';

class LrcFileStatus {

    protected loaded: boolean = false;
    protected validSignature: boolean = false;
    protected validVersion: boolean = false;
    protected validStreamType: boolean = false;
    protected validUnit: boolean = false;


    public constructor(
        protected readonly file: LrcReader
    ) {

    }
}

export default class LrcReader {

    private url: string;
    private blob!: Blob;
    private uint8array!: Uint8Array;
    private errors: string[] = [];

    private signature?: string;
    private version?: number;
    private streamType?: number;
    private unit?: number;

    private width?: number;
    private height?: number;

    private timestamp?: number;

    private pixels?: number[];

    constructor(url: string) {
        this.url = url;
    }

    protected logValidationError(
        property: string,
        value: any
    ) {
        const msg = `Invalid ${property} of ${this.url}: ${value.toString()}`;
        this.logError(msg);
    }

    protected logError(message: string) {
        console.error(message);
        this.errors.push(message);
    }

    protected async setBlob(blob: Blob) {
        this.blob = blob;
        this.uint8array = new Uint8Array(await blob.arrayBuffer())
    }

    protected read8bNumber(index: number): number {
        return this.uint8array[index];
    }

    protected read16bNumber(index: number) {
        return (this.uint8array[index] << 8) | this.uint8array[index + 1]
    }

    protected read64bNumber(index: number) {
        const data = this.uint8array.slice(index, index + 8);
        const seconds = (data[0] << 56) | (data[1] << 48) | (data[2] << 40) | (data[3] << 32) | (data[4] << 24) | (data[5] << 16) | (data[6] << 8) | data[7];
        const milliseconds = (data[8] << 24) | (data[9] << 16) | (data[10] << 8) | data[11];
        return seconds * 1000 + milliseconds;
    }


    public toFloat32(bytes: Uint8Array): number {
        const value = bytes[0] << 24 | bytes[1] << 16 | bytes[2] << 8 | bytes[3];
        return value / 0xFFFFFFFF;
      }
      

    protected readTemperatureArray( index: number ) {
        const data = this.uint8array.slice( index );
        const floatArray = new Array<number>();
        for (let i = 0; i < data.length / 4; i++) {
            floatArray[i] = this.toFloat32(data.subarray(4 * i, 4 * i + 4));
          }
          return floatArray//.map(n=>parseFloat( n.toPrecision(8) ));
    }

    protected async readString(startIndex: number, stringLength: number): Promise<string> {
        return await this.blob.slice(startIndex, stringLength).text();
    }

    public static async fromUrl( absoluteUrl: string ) {

        const reader = new LrcReader( absoluteUrl );

        await reader.loadFile();

        return reader.getFile();

    }

    async loadFile() {

        const blob = await fetch(this.url)
            .then(response => {
                return response.blob()
            })
            .catch(e => {
                console.error(e);
                throw e;
            });

        if (blob === undefined)
            throw new Error("File was not found!!");

        this.setBlob(blob);

        await this.parseFile();
    }

    protected async parseFile() {
        await this.parseSignature();
        this.parseVersion();
        this.parseStreamType();
        this.parseUnit();
        this.parseWidth();
        this.parseHeight();
        this.parseTimestamp();
        this.parsePixels();
    }


    // Signature
    protected isValidSignature = (value: string | undefined) => value === "LRC\0"
    protected async parseSignature() {
        const value = await this.readString(0, 4);
        if (!this.isValidSignature(value)) {
            this.logValidationError("signature", value);
        }
        this.signature = value;
    }

    // Version
    protected isValidVersion = (value: number | undefined) => value === 2;
    protected parseVersion() {
        const value = this.read8bNumber(4);
        if (!this.isValidVersion(value))
            this.logValidationError("version", value);
        this.version = value;
    }

    // Stream type
    protected isValidStreamType = (value: number | undefined) => value === 1;
    protected parseStreamType() {
        const value = this.read8bNumber(14);
        if (!this.isValidStreamType(value))
            this.logValidationError("streamType", value);
        this.streamType = value;
    }

    // Unit
    protected isValidUnit = (value: number | undefined) => value === 1;
    protected parseUnit() {
        const value = this.read8bNumber(15);
        if (!this.isValidUnit(value))
            this.logValidationError("unit", value);
        this.unit = value;
    }

    // Width
    protected isValidWidth = (value: number | undefined) => Number.isInteger(value);
    protected parseWidth() {
        const value = this.read16bNumber(16);
        if (!this.isValidWidth(value))
            this.logValidationError("width", value);
        this.width = value;
    }

    // Height
    protected isValidHeight = (value: number | undefined) => Number.isInteger(value);
    protected parseHeight() {
        const value = this.read16bNumber(18);
        if (!this.isValidHeight(value))
            this.logValidationError("height", value);
        this.height = value;
    }

    // Timestamp
    protected isValidTimestamp = (value: number|undefined) => Number.isInteger(value);
    protected parseTimestamp() {
        const value = this.read64bNumber(24);
        if (!this.isValidHeight(value))
            this.logValidationError("timestamp", value);
        this.timestamp = value;
    }

    // Pixels
    protected isValidPixels = ( value: number[]|undefined ) => {
        return value !== undefined && value.length === (this.width! * this.height!)
    }
    protected parsePixels() {
        const value = this.readTemperatureArray(82);
        // console.log( value, value.length, this.width! * this.height! );

        this.pixels = value;
    }


    isValid(): boolean {
        return this.errors.length === 0
            && this.isValidSignature(this.signature)
            && this.isValidStreamType(this.streamType)
            && this.isValidVersion(this.version)
            && this.isValidUnit(this.unit)
            && this.isValidWidth(this.width)
            && this.isValidHeight(this.height)
            && this.isValidTimestamp( this.timestamp );
    }

    public getErrors() {
        return this.errors;
    }

    getFile() {
        if (!this.isValid())
            return null;
        return new ThermalFile(
            this.url,
            this.signature!,
            this.unit!,
            this.width!,
            this.height!,
            this.timestamp!,
            this.pixels!
        );
    }

}