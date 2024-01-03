"use client";

import { GoogleScope } from "@/graphql/google/google"
import { MapContainer } from "react-leaflet"
import { MapMarker } from "./MapMarker"
import { MapMultipleWrapperElement } from "./MapWrapperElement"
import Link from "next/link";
import { Button } from "@nextui-org/react";

type MapMultipleInternalProps = {
    items: GoogleScope[],
    height: string
}

export const MapMultipleInternal: React.FC<MapMultipleInternalProps> = props => {
    return <div className="w-full rounded-xl overflow-hidden shadow-xl" style={{ height: props.height }}>
        <MapMultipleWrapperElement
            items={props.items.map(item => ({
                lat: item.lat,
                lng: item.lon
            }))}
        >
            {props.items.map(item => <MapMarker
                key={item.slug}
                position={{
                    lat: item.lat,
                    lng: item.lon
                }}
            >
                
                    <h2 className="text-lg">{item.name}</h2>
                    <p>{item.description}</p>
                    <Link href={`/${item.slug}`}>
                        <Button>Zobrazit data</Button>
                    </Link>
            </MapMarker>)}
        </MapMultipleWrapperElement>
    </div>
}