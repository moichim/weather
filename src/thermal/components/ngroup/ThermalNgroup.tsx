"use client";

import { ThermalActionsNewFactory } from "@/thermal/context/reducerUpdated/actions";
import { useThermalContextNew } from "@/thermal/context/thermalContextNew";
import { useEffect, useMemo } from "react";

type ThermalNGroupProps = {
    name: string,
    urls: string[]
}

export const ThermalNGroup: React.FC<ThermalNGroupProps> = props => {

    const {
        state,
        dispatch
    } = useThermalContextNew();

    // Initialise the group at first render
    useEffect(() => {
        dispatch(ThermalActionsNewFactory.grouplInit(props.name))
    }, [props.name]);

    const urls = useMemo( () => props.urls, [] );

    // Load the files upon every render
    useEffect(() => {

        props.urls.forEach(url => {
            console.log("URL se změnilo", url, state.requestedUrls);
            dispatch(ThermalActionsNewFactory.groupLoadFile(props.name, url));
        });

    }, [urls]);

    const group = useMemo(() => {
        return state.groups[props.name];
    }, [state.groups[props.name], props.name]);

    console.log( "skupina", props.name, group );


    return <div>
        { group &&  Object.values( group.instancesByUrl ).map( instance => <>{instance.url}</> ) }
    </div>
}