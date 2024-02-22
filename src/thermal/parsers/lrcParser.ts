import { ThermalFileSource } from '../reader/ThermalFileSource';
import AbstractParser from './AbstractParser';


/**
 * Parse the LRC file format.
 * 
 * LRC was created at NTC UWB in Pilsen. It is generated by thermal cameras LabIR Edu and by the analytical software LabIR.
 * 
 * **Binary format reference**
 * 
 * - 0  - 4 bity signature
 * - 4  - 1 bit version
 * - 5  - 10 bitů přeskočeno
 * - 14 - 1 bit streamType
 * - 15 - 1 bit streamUnits
 * - 17 - 2 bity width
 * - 19 - 2 bity height
 * - 21 - 4 bity přeskočeno
 * - 25 - 8 bitů timestamp
 * - 33 - 4 bity min
 * - 37 - 4 bity max
 * - 41 - 41 bitů přeskočeno
 * - 82 - začátek dat
 */

export default class LrcParser extends AbstractParser {

    protected signature?: string;
    protected version?: number;
    protected streamType?: number;
    protected unit?: number;


    protected async parseFile() {
        await this.parseSignature();
        this.parseVersion();
        this.parseStreamType();
        this.parseUnit();
        await this.parseBaseAttributes();
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
    protected getWidth(): number {
        return this.read16bNumber(17);
    }

    // Height
    protected getHeight(): number {
        return this.read16bNumber(19);
    }

    // Timestamp
    protected getTimestamp(): number {

        const big = this.data.getBigInt64(25, true);

        const UnixEpoch = BigInt.asUintN(64,BigInt( 62135596800000 ));
        const TicksPerMillisecond = BigInt(10000);
        const TicksPerDay = BigInt(24 * 60 * 60 * 1000) * TicksPerMillisecond;
        const TicksCeiling = BigInt(0x4000000000000000);
        const LocalMask = BigInt(0x8000000000000000);
        const TicksMask = BigInt(0x3FFFFFFFFFFFFFFF);


        let ticks = big & TicksMask;

        const localTime = big & LocalMask;

        if (localTime) {

            if (ticks > TicksCeiling - TicksPerDay) {
                ticks -= TicksCeiling;
            }
            if (ticks < 0) {
                ticks += TicksPerDay;
            }

        }

        const result = ticks / TicksPerMillisecond - UnixEpoch;

        return Number(BigInt.asUintN( 64, result ));

    }

    public toFloat32(bytes: Uint8Array): number {
        const value = bytes[0] << 24 | bytes[1] << 16 | bytes[2] << 8 | bytes[3];
        // const value = bytes[3] << 24 | bytes[2] << 16 | bytes[1] << 8 | bytes[0];
        return value / 0xFFFFFFFF;
    }


    protected async readTemperatureArray(index: number) {

        const buffer = await this.blob.arrayBuffer();

        const array = new Float32Array( buffer.slice( index ) );
        const view = new DataView( buffer.slice( index ) );

        const floatArray = new Array<number>( );

        for (let i = 0; i < array.length; i++) {
            floatArray[i] = array[ i ];
            // floatArray[i] = view.getFloat32( i, true );
        }

        return floatArray
    }

    // Pixels
    protected getPixels() {
        return this.readTemperatureArray(82);
    }

    // Min
    protected getMin(): number {
        return this.data.getFloat32(33, true);
    }

    protected getMax(): number {
        return this.data.getFloat32(37, true);
    }

    isValid(): boolean {
        return this.errors.length === 0
            && this.isValidSignature(this.signature)
            && this.isValidStreamType(this.streamType)
            && this.isValidVersion(this.version)
            && this.isValidUnit(this.unit)
            && this.isValidBase();
    }

    getThermalFile() {
        if (!this.isValid()) {
            console.log( this.getErrors() );
            return null;
        }
        return new ThermalFileSource(
            this.url,
            this.signature!,
            this.unit!,
            this.width!,
            this.height!,
            this.timestamp!,
            this.pixels!,
            this.min!,
            this.max!
        );
    }

}