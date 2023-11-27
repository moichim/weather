"use client";

import { OpenmeteoProvider } from "@/graphql/providers/openmeteoProvider";
import { Serie } from "@/graphql/weather";
import { gql, useQuery } from "@apollo/client";
import { createContext, useContext } from "react";

type DataContextType = {
    data: Serie[]
}

const initialData: DataContextType = {
    data: []
}

const DataContext = createContext( initialData );

const QUERY = gql`
    query Query {
        weatherRange {
            source {
                name
            }
            entries {
                bar
                humidity
                clouds
            }
        }
    }
`;

export const DataContextProvider: React.FC<React.PropsWithChildren> = props => {

    const query = useQuery( QUERY );

    if (query.loading) return <>{props.children}</>
    if ( query.error )

    console.log( query.data );


    const value = {
        data: []
    };

    return <DataContext.Provider value={value}>
        {props.children}
    </DataContext.Provider>

}

export const useDataContext = () => {
    return useContext( DataContext );
}