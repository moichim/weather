import fetch from 'cross-fetch';
import ThermalFile from './thermalFile';
import AbstractReader from './AbstractReader';


export default class LrcReader extends AbstractReader {

    protected signature?: string;
    protected version?: number;
    protected streamType?: number;
    protected unit?: number;








    public toFloat32(bytes: Uint8Array): number {
        const value = bytes[0] << 24 | bytes[1] << 16 | bytes[2] << 8 | bytes[3];
        // const value = bytes[3] << 24 | bytes[2] << 16 | bytes[1] << 8 | bytes[0];
        return value / 0xFFFFFFFF;
    }


    protected readTemperatureArray(index: number) {
        const data = this.uint8array.slice(index);
        const floatArray = new Array<number>();
        for (let i = 0; i < data.length / 4; i++) {
            floatArray[i] = this.toFloat32(data.subarray(4 * i, 4 * i + 4));
        }
        return floatArray//.map(n=>parseFloat( n.toPrecision(8) ));
    }



    public static async fromUrl(absoluteUrl: string) {

        const reader = new LrcReader(absoluteUrl);

        await reader.loadFile();

        const file = reader.getFile();

        return file;

    }

    async loadFile() {

        const blob = await fetch(this.url)
            .then(response => {
                const b = response.blob();
                return b;
            })

        if (blob === undefined)
            throw new Error(`File '${this.url}' was not found!!`);

        await this.setBlob(blob);

        await this.parseFile();

        // return this;

        return this;

    }

    protected async parseFile() {
        await this.parseSignature();
        this.parseVersion();
        this.parseStreamType();
        this.parseUnit();
        this.parseBaseAttributes();
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

        console.log( ticks );

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


        return this.read64bNumber(24);
    }

    // Pixels
    protected getPixels() {
        return this.readTemperatureArray(82);
    }


    isValid(): boolean {
        return this.errors.length === 0
            && this.isValidSignature(this.signature)
            && this.isValidStreamType(this.streamType)
            && this.isValidVersion(this.version)
            && this.isValidUnit(this.unit)
            && this.isValidBase();
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