import {expect, jest, describe,  test} from '@jest/globals';
import { calculateMinMax, clampRangeToUpdatedMinMax } from './numericalValues';

describe( "numericalValues", () => {

    test( "calculating of minmax", () => {

        const data = [
            { min: -1, max: 2 },
            { min: -4, max: 0 },
            { min: -15, max: 100 },
            { min: undefined, max: 1000 }, // This value should be ignored
            { min: -1000, max: undefined }, // This value should be ignored
            { min: undefined, max: undefined } // This value should be ignored
        ]

        const result = calculateMinMax( data );

        expect( result.min ).toEqual( -15 );
        expect( result.max ).toEqual( 100 );

    } );

    test( "calculating of range", () => {

        const data = [
            { min: 0, max: 10, from: 10, to: 20, resultFrom: 10, resultTo: 10 },
            { min: 0, max: 10, from: -1, to: 5, resultFrom: 0, resultTo: 5 },
            { min: 0, max: 10, from: 3, to: 5, resultFrom: 3, resultTo: 5 },
        ];

        for ( let row of data ) {
            
            const clampedValues = clampRangeToUpdatedMinMax(
                row.from,
                row.to,
                row.min,
                row.max
            );
            
            expect( clampedValues.from ).toEqual( row.resultFrom );
            expect( clampedValues.to ).toEqual( row.resultTo );
        }

    } );

} );