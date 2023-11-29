import { WeatherEntryDataType, WeatherEntryMetaType, WeatherEntryType } from "../weather"
import { Properties, WeatherProperty } from "./properties"

type WeatherSourceBaseType = {
    name: string,
    color: "default" | "primary" | "secondary" | "success" | "warning" | "danger",
    props: Array<keyof WeatherEntryDataType>
}

type WeatherSourceInternalType = WeatherSourceBaseType

export type WeatherSourceType = WeatherSourceBaseType & {
    slug: string
}

const sources: {
    [index: string]: WeatherSourceInternalType
} = {
    ntc: {
        name: "NTC",
        color: "success",
        props: [
            "temperature",
            "wind_dir",
            "wind_speed",
            "bar",
            "clouds",
            "humidity",
            "uv"
        ]
    },
    openmeteo: {
        name: "Open Meteo",
        color: "danger",
        props: [
            "temperature",
            "wind_dir",
            "wind_speed",
            "uv",
            "humidity",
            "bar",
            "clouds",
            "rain"
        ]
    }
}

export type AvailableSources = keyof typeof sources;

export class Sources {

    protected static formatOne( slug: AvailableSources ): WeatherSourceType {
        return {
            ...sources[slug],
            slug: slug as string
        }
    }

    public static all() {
        return Object.keys( sources ).map( (slug) => Sources.formatOne( slug ) )
    }

    public static one(slug: AvailableSources) {
        return Sources.formatOne( slug );
    }

    public static ofProperty(property: keyof WeatherEntryDataType) {
        return Object.entries( sources )
            .filter(([slug,source]) => source.props.includes(property))
            .map( ([slug, source]) => Sources.formatOne( slug ));
    }

}

