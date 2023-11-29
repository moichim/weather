'use client'

import { DataContextProvider } from "@/state/dataContext"
import { FilterContextProvider } from "@/state/filterContext"
import { GraphContextProvider } from "@/state/graphContext"
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client"
import { NextUIProvider } from "@nextui-org/react"
import React from "react"

const client = new ApolloClient({

    uri: '/api/',

    cache: new InMemoryCache(),

});

export const Providers: React.FC<React.PropsWithChildren> = props => {
    return <ApolloProvider client={client}>
        <NextUIProvider>
            <main 
                //className="dark text-foreground bg-background"
            >
                <FilterContextProvider>
                    <DataContextProvider>
                        <GraphContextProvider>
                            {props.children}
                        </GraphContextProvider>
                    </DataContextProvider>
                </FilterContextProvider>
            </main>
        </NextUIProvider>
    </ApolloProvider>
}