"use client";

import React, { useMemo } from "react";
import { MapContainer, Rectangle, TileLayer } from "react-leaflet";
import { MapPositionType } from "../map";

// Internal props of map for a single item
type MapWrapperSingleElementProps = {
    center: MapPositionType,
    zoom: number
};

// Internal props of map for multiple items
type MapMultipleElementProps = {
    items: MapPositionType[]
}

// The exported component's props
type MapWrapperElementProps = React.PropsWithChildren & (MapWrapperSingleElementProps | {
    items: MapPositionType[]
});

// Common way to export map's layer
const MapWrapperTileLayer: React.FC = () => <TileLayer
    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
/>

// Internal component for outputting single map container
export const MapSingleWrapperElement: React.FC<
    MapWrapperSingleElementProps
    & React.PropsWithChildren
> = props => {
    return <MapContainer
        center={props.center}
        zoom={props.zoom}
        style={{ height: "100%" }}
        scrollWheelZoom={false}
    >
        <MapWrapperTileLayer />
        {props.children}
    </MapContainer>
}

type MapBoundsType = [
    [
        // leftmost
        number,
        // rightmost
        number
    ], [
        // topmost
        number,
        // bottommost
        number
    ]
]

// Wrapper for multiple map with calculated bounds
export const MapMultipleWrapperElement: React.FC<
    MapMultipleElementProps
    & React.PropsWithChildren
> = props => {

    const calculatedBounds: MapBoundsType = useMemo(() => {

        return props.items.reduce(
            (state, current) => {

                if (current.lat > state[0][0])
                    state[0][0] = current.lat;
                if (current.lat < state[0][1])
                    state[0][1] = current.lat;
                if (current.lng > state[1][0])
                    state[1][0] = current.lng;
                if (current.lng < state[1][1])
                    state[1][1] = current.lng;

                return state
            },
            [
                [-Infinity, Infinity],
                [-Infinity, Infinity]
            ]
        );

    }, [props.items]);

    return <MapContainer
        scrollWheelZoom={false}
        bounds={calculatedBounds}
        boundsOptions={{
            padding: [50,50]
        }}
        style={{ height: "100%" }}
    >
        <MapWrapperTileLayer />
        {props.children}
    </MapContainer>

}
