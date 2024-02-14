"use client";

import { useThermalContext } from "@/state/thermal/thermalContext";
import ThermalFile from "@/utils/reader/thermalFile";
import { useLrcCanvas, useLrcObserver } from "@/utils/reader/useLrc";
import { RefObject, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useThermalInstance } from "./useThermalInstance";

type LrcObserverProps = {
    file: RefObject<HTMLDivElement>
}

const LrcObserver: React.FC<LrcObserverProps> = props => {

    const [x,setX] = useState<number|undefined>();
    const [y,setY] = useState<number|undefined>();
    const [value,setValue] = useState<number|undefined>();

    useEffect( () => {

        const observer = new MutationObserver( (mutations) => {

            const getValueInt = ( mutation: MutationRecord ) => {
                const value = parseInt( mutation.target.attributes[ mutation.attributeName ].value );

                return isNaN( value ) ? undefined : value;
            }

            const getValueFloat = ( mutation: MutationRecord ) => {
                const value = parseFloat( mutation.target.attributes[ mutation.attributeName ].value );

                return isNaN( value ) ? undefined : value;
            }

            mutations.forEach( mutation => {

                if ( mutation.attributeName === "data-x" ) {

                    const value = getValueInt( mutation );
                    setX( value );

                }

                if ( mutation.attributeName === "data-y" ) {

                    const value = getValueInt( mutation );
                    setY( value );

                }

                if ( mutation.attributeName === "data-value" ) {

                    const value = getValueFloat( mutation );
                    setValue( value );

                }

            } );

            

        } );

        if ( props.file.current ) {
            observer.observe( props.file.current, {attributes: true} );
        }

        return () => observer.disconnect();

    }, [props.file.current] );


    return <>
        x: {x} y: {y} value: {value}
    </>
}

type LrcProps = {
    url: string
}

export const LrcContainer: React.FC<LrcProps> = (props) => {

    const ref = useRef<HTMLDivElement>(null);

    const [ file, setFile ] = useState<ThermalFile|undefined>();

    const context = useThermalContext();
    const instance = useThermalInstance( file );

    useEffect( () => {

        context.loadFile( props.url );

    }, [ props.url ] );

    useEffect( () => {

        if ( Object.keys( context.state.files ). includes( props.url ) ) {
            setFile( context.state.files[ props.url ] );
        }

    }, [context.state] );

    useEffect( () => {
        if ( file && ref.current ) {
            instance.setContainer( ref.current );
            file.initialise();
        }
    }, [file, ref.current] );

    useEffect( () => {

        const setRandomTo = () => {
            const value = Math.round( Math.random() * -5 );
            if ( file ) {
                file.to = value;
            }
        }

        const timer = setInterval( () => {
            setRandomTo();
        }, 1000 );
        
        return () => clearInterval( timer );

    }, [file ] );


    

    return <>
        <div ref={ref}
            style={{width: "50vw",  position: "relative"}}
        ></div>
        {/*instance.observer && <LrcObserver file={instance.observer} />*/}
        {instance.file && <LrcObserver file={ref} />}
    </>

}