import ThermalFile from "@/thermal/reader/thermalFile"

enum ThermalImageLoadingState {
    LOADING = 0,
    PENDING = 1,
    LOADED = 2,
    ERROR = 3
}

export type ThermalStorageType = {

    min: number | undefined,
    max: number | undefined,

    from: number | undefined,
    to: number | undefined,

    files: {
        [index: string]: ThermalFile
    },

    loading: {
        [index: string]: {
            path: string,
            status: ThermalImageLoadingState
        }
    }

}

export const thermalStorageDefaults: ThermalStorageType = {
    min: undefined,
    max: undefined,
    from: undefined,
    to: undefined,
    files: {},
    loading: {}
}