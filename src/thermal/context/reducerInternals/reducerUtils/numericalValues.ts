type CalculatedMinMaxType = {
    min: number,
    max: number
}

/** A pure function returning new value of min & max */
export const calculateMinMax = (
    instancesMinMax: { min: number | undefined, max: number | undefined }[]
) => {
    const calculated = instancesMinMax
        .filter( current => current.min !== undefined && current.max !== undefined ) as CalculatedMinMaxType[];

    const reduced = calculated.reduce( ( state, current ) => {

        if (current.min < state.min)
            state.min = current.min;

        if (current.max > state.max) {
            state.max = current.max;
        }

        return { ...state };

    }, { min: Infinity, max: -Infinity } as CalculatedMinMaxType);

    if ( reduced.min === Infinity || reduced.max === -Infinity ) {
        return {min: undefined, max: undefined}
    }

    return reduced;

}

/** A pure function returning new value of from & to */
export const clampRangeToUpdatedMinMax = (
    currentFrom: number,
    currentTo: number,
    updatedMin: number,
    updatedMax: number
) => {
    const fromTo = {
        from: currentFrom,
        to: currentTo
    }

    if ( currentFrom < updatedMin )
        fromTo.from = updatedMin;

    if ( currentTo > updatedMax )
        fromTo.to = updatedMax;

    return fromTo;
}