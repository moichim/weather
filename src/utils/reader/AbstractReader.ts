import ThermalFile from "./thermalFile";

export default abstract class AbstractReader {

    protected url: string;

    constructor(url: string) {
        this.url = url;
    }

    /** Load the file from the given URL. */
    public abstract loadFile(): void;

    /** Parse the file once it is loaded. Log errors in the process. */
    protected abstract parseFile(): void;

    /** Checks if the file is valid. Must be called after parsing. */
    protected abstract isValid(): boolean;

    /** Create an instance of Thermal file (if the file is valid). */
    public abstract getFile(): ThermalFile | null;




    // Shared parsing & validation

    /** Parsing of all common attributes */
    protected parseBaseAttributes() {
        this.parseWidth();
        this.parseHeight();
        this.parseTimestamp();
        this.parsePixels();
    }


    /** Validation of all core attributes */
    protected isValidBase(): boolean {
        return this.errors.length === 0
            && this.isValidTimestamp( this.timestamp )
            && this.isValidWidth( this.width )
            && this.isValidHeight( this.height )
            && this.isValidPixels( this.pixels );
    }




    // Common data parsing

    // Timestamp
    protected timestamp?: number;
    protected isValidTimestamp = (value: number | undefined) => true // Number.isInteger(value);
    protected abstract getTimestamp(): number;
    protected parseTimestamp() {
        const value = this.getTimestamp();
        if (!this.isValidTimestamp(value))
            this.logValidationError("timestamp", value);
        this.timestamp = value;
    }


    // Width
    protected width?: number;
    protected isValidWidth = (value: number | undefined) => Number.isInteger(value);
    protected abstract getWidth(): number;
    protected parseWidth() {
        const value = this.getWidth();
        if (!this.isValidWidth(value))
            this.logValidationError("width", value);
        this.width = value;
    }

    // Height
    protected height?: number;
    protected isValidHeight = (value: number | undefined) => Number.isInteger(value);
    protected abstract getHeight(): number;
    protected parseHeight() {
        const value = this.getHeight();
        if (!this.isValidHeight(value))
            this.logValidationError("height", value);
        this.height = value;
    }

    // Common data parsing
    protected pixels?: number[];
    protected abstract getPixels(): number[];
    protected isValidPixels = ( value: number[]|undefined ) => {
        return value !== undefined && value.length === (this.width! * this.height!)
    }
    protected parsePixels() {
        const value = this.getPixels();
        // console.log( value, value.length, this.width! * this.height! );

        this.pixels = value;
    }





    // Error logging


    /** Buffer of errors that occured during the parsing. */
    protected errors: string[] = [];

    /** Store an error. */
    protected logError(
        message: string
    ) {
        console.error(message);
        this.errors.push(message);
    }

    /** Store an error during parsing. */
    protected logValidationError(
        property: string,
        value: any
    ) {
        const msg = `Invalid ${property} of ${this.url}: ${value.toString()}`;
        this.logError(msg);
    }

    public getErrors() {
        return this.errors;
    }




    // Binary operations

    protected blob!: Blob;
    protected data!: DataView;
    protected uint8array!: Uint8Array;
    protected async setBlob(
        blob: Blob
    ) {
        this.blob = blob;

        const buffer = await blob.arrayBuffer();

        this.data = new DataView(buffer);
        this.uint8array = new Uint8Array(buffer);
    }

    protected async readString(startIndex: number, stringLength: number): Promise<string> {
        return await this.blob.slice(startIndex, stringLength).text();
    }

    protected read8bNumber(index: number): number {
        return this.data.getUint8(index);
    }

    protected read16bNumber(index: number) {
        return this.data.getUint16(index, true);
    }

    /** @todo Use DataView */
    protected read64bNumber(index: number) {

        const big = this.data.getBigUint64( index );
        console.log( big );

        const epoch = new Date;
        epoch.setUTCFullYear(0, 0, 0);
        epoch.setUTCHours(0,0,0);
        const e = BigInt( epoch.getTime() );
        console.log( {
            raw: big,
            epochBig: e,
            epoch: epoch.getTime(),
            result: big - e
        } );

        const data = this.uint8array.slice(index, index + 8);
        const seconds = (data[0] << 56) | (data[1] << 48) | (data[2] << 40) | (data[3] << 32) | (data[4] << 24) | (data[5] << 16) | (data[6] << 8) | data[7];
        const milliseconds = (data[8] << 24) | (data[9] << 16) | (data[10] << 8) | data[11];
        return seconds * 1000 + milliseconds;

    }





}