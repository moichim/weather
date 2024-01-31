import {expect, jest, describe,  test} from '@jest/globals';
import LrcReader from './lrcReader';

export const SAMPLE_URL = "http://localhost:3000/sample.lrc";

describe( "LrcReader", () => {
    test( "opens a file from url", async () => {

        const reader = new LrcReader( SAMPLE_URL );

        await reader.loadFile();

        expect( reader.getErrors().length ).toEqual(0);

        expect(reader.isValid()).toEqual( true );

    } );

    test( "opens in a static method", async () => {
        const file = await LrcReader.fromUrl( SAMPLE_URL );
        expect( file ).not.toBeNull();
    } );
} );