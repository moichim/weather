import { useEffect, useMemo, useState } from "react";

export const useGraphScale = ( 
    defaultScale:number = 3 
) => {

    const heights = [
        100,
        200,
        350,
        500,
        650,
        800
    ];

    const defaultHeight =  heights[2];

    const length = heights.length - 1;

    const [ height, setHeight ] = useState<number>( defaultHeight );
    
    const [ scale, setScale ] = useState<number>( 1 );

    const { scaleUp, scaleDown } = useMemo( () => {

        let scaleUp:(()=>void)|undefined = undefined;
        let scaleDown:(()=>void)|undefined = undefined;

        if ( scale < length ) {
            scaleUp = () => setScale( s => s+1 );
        }

        if ( scale > 0 ) {
            scaleDown = () => setScale( s => s-1 );
        }

        return {
            scaleUp,
            scaleDown
        }

    }, [scale,length] );

    useEffect( () => {
        if ( scale < 0) setScale( 0 );
        if ( scale > length ) setScale( length );
    }, [scale, length] );

    useEffect( () => {
        setHeight( heights[scale] );
    }, [scale,heights] );

    return {
        scaleUp,
        scaleDown,
        height,
        setScale
    }

}