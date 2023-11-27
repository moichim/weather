import { WeatherEntryDataType } from "../weather"
import { AvailableSources, Sources } from "./source"

const WeatherPropsDataTypes = {
    Int: "number",
    Float: "number",
    String: "string"
}

export type WeatherProperty = {
    type: keyof typeof WeatherPropsDataTypes,
    unit?: string,
    name: string,
    field: keyof WeatherEntryDataType,
    color: string
}

const properties: {
    [T in keyof WeatherEntryDataType]: WeatherProperty
} = {
    temperature: {
        type: "Float",
        unit: "stupeň",
        name: "Teplota",
        field: "temperature",
        color: "bg-red-500"
    },
    wind_dir: {
        type: "String",
        name: "Směr větru",
        field: "wind_dir",
        color: "bg-green-500"
    },
    wind_speed: {
        type: "Float",
        name: "Rychlost větru",
        field: "wind_speed",
        unit: "m/s",
        color: "bg-blue-500"
    },
    bar: {
        type: "Float",
        name: "Tlak",
        field: "bar",
        unit: "pascal",
        color: "bg-yellow-700"
    },
    rain: {
        type: "Float",
        name: "Srážky",
        field: "rain",
        color: "bg-violet-700"
    },
    clouds: {
        type: "Float",
        name: "Tlak",
        field: "clouds",
        color: "bg-orange-300"
    },
    humidity: {
        type: "Float",
        name: "Vlhkost vzduchu",
        field: "humidity",
        unit: "%",
        color: "bg-teal-300"
    },
    uv: {
        type: "Float",
        name: "UV",
        field: "uv",
        color: "bg-pink-400"
    }
}

export class Properties {

    protected static formatOne( slug: keyof WeatherEntryDataType ) {
        return {
            ...properties[slug],
            in: Sources.ofProperty(slug).map(source => source.slug),
            slug: slug
        }
    }

    public static all() {
        return Object.keys( properties ).map( slug => Properties.formatOne(slug as keyof WeatherEntryDataType) );
    }

    public static index() { return properties; }

    public static one( slug: keyof WeatherEntryDataType ) {
        return Properties.formatOne(slug);
    }

    public static ofSource( source: AvailableSources ) {
        return Sources.one( source ).props.map( key => properties[key] );
    }
}