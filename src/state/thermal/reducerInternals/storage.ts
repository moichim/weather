import ThermalFile from "@/utils/reader/thermalFile"

export type ThermalStorageType = {

    min: number | undefined,
    max: number | undefined,

    from: number | undefined,
    to: number | undefined,

    files: {
        [index: string]: ThermalFile
    }

}

export const thermalStorageDefaults: ThermalStorageType = {
    min: undefined,
    max: undefined,
    from: undefined,
    to: undefined,
    files: {}
}