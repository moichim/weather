'use client'

import { DataContextProvider } from "@/state/weatherContext"
import { FilterContextProvider } from "@/state/filterContext"
import { DisplayContextProvider } from "@/state/displayContext"
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client"
import { NextUIProvider } from "@nextui-org/react"
import React from "react"
import { GraphContextProvider } from "@/state/graphStackContext"
import { NotificationsContextProvider } from "@/state/useNotifications/useNotifications"

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
                <NotificationsContextProvider>
                    <GraphContextProvider>
                        <FilterContextProvider>
                            <DataContextProvider>
                                <DisplayContextProvider>
                                    {props.children}
                                </DisplayContextProvider>
                            </DataContextProvider>
                        </FilterContextProvider>
                    </GraphContextProvider>
                </NotificationsContextProvider>
            </main>
        </NextUIProvider>
    </ApolloProvider>
}