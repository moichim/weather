import { Reducer } from "react";
import { ThermalStorageType } from "./storage";
import { AvailableThermalActions, ThermalActions } from "./actions";
import ThermalFile from "@/utils/reader/thermalFile";


const calculateMinMax = (
    files: ThermalFile[]
) => {
    return files.reduce((state, current) => {

        const result = { ...state };

        if (current.min < state.min) {
            result.min = current.min;
        }

        if (current.max > state.max) {
            result.max = current.max;
        }

        return result;

    }, {
        min: Infinity,
        max: -Infinity
    });
}

const calculateFromTo = (
    minMax: ReturnType<typeof calculateMinMax>,
    currentFrom: number | undefined,
    currentTo: number | undefined
) => {

    const result = {
        from: currentFrom,
        to: currentTo
    }

    if (currentFrom === undefined || currentTo === undefined) {

        if (currentFrom == undefined)
            result.from = minMax.min;
        if (currentTo = undefined)
            result.to = minMax.max;

    } else {

        if (currentFrom < minMax.min)
            result.from = minMax.min;
    
        if ( currentTo > minMax.max )
            result.to = minMax.max;

    }

    return result;
}

export const thermalReducer: Reducer<ThermalStorageType, AvailableThermalActions> = (
    state,
    action
) => {

    switch (action.type) {

        case ThermalActions.ADD_FILE:

        

            // If there are no objects yet, assign default values
            if ( Object.values( state.files ).length === 0 ) {
                return {
                    ...state,
                    min: action.payload.file.min,
                    max: action.payload.file.max,
                    from: action.payload.file.min,
                    to: action.payload.file.max,
                    files: {
                        [action.payload.file.url]: action.payload.file
                    }
                }
            }

            // otherwise calculate new values

            const filesWithNewOne = {
                ...state.files,
                [action.payload.file.url]: action.payload.file
            }

            const minMaxWithNewOne = calculateMinMax(Object.values(filesWithNewOne));

            const fromToWithNewOne = calculateFromTo( minMaxWithNewOne, state.from, state.to );

            const resultWithNewOne = {
                ...state,
                ...minMaxWithNewOne,
                ...fromToWithNewOne,
                files: filesWithNewOne
            }

            return resultWithNewOne;

        case ThermalActions.REMOVE_FILE:

            const filesWithoutTheOne = Object.fromEntries( Object.entries( state.files ).filter( ( [key, value] ) => {
                return key !== action.payload.id
            } ) );

            // if there is no file, reset the storage

            if ( Object.values( filesWithoutTheOne ).length === 0 ) {
                return {
                    ...state,
                    min: undefined,
                    max: undefined,
                    from: undefined,
                    to: undefined
                }
            }

            const minMaxWithoutNewOne = calculateMinMax( Object.values( filesWithoutTheOne ) );

            const fromToWithoutNewOne = calculateFromTo( minMaxWithoutNewOne, state.from, state.to );

            return {
                ...state,
                ...minMaxWithoutNewOne,
                ...fromToWithoutNewOne,
                files: filesWithoutTheOne
            }

    }

    return state;

}