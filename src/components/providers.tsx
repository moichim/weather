'use client'

import { DisplayContextProvider } from "@/state/displayContext"
import { FilterContextProvider } from "@/state/filterContext"
import { GraphContextProvider } from "@/state/useGraphStack/graphStackContext"
import { MeteoContextProvider } from "@/state/useMeteoData/meteoDataContext"
import { NotificationsContextProvider } from "@/state/useNotifications/useNotifications"
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
                <NotificationsContextProvider>
                    <MeteoContextProvider>
                        <GraphContextProvider>
                            <FilterContextProvider>
                                    <DisplayContextProvider>
                                        {props.children}
                                    </DisplayContextProvider>
                            </FilterContextProvider>
                        </GraphContextProvider>
                    </MeteoContextProvider>
                </NotificationsContextProvider>
            </main>
        </NextUIProvider>
    </ApolloProvider>
}