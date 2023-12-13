import { WeatherEntryType, WeatherSerie } from "@/graphql/weather";
import { MeteoQueryResponseType } from "./query";

type BufferType =  {
    [index: number]: {
        [index: string]: number
    }  & {
        time: number,
        note?: string
    }
}

export class MeteoResponseProcessor {

    public static process(
        response: MeteoQueryResponseType
    ) { }

    protected static getLongestWeatherSerie(
        series: MeteoQueryResponseType["weatherRange"]
    ): WeatherSerie {
        return series.reduce((state, current) => {
            if (state === undefined)
                return current;
            if (state.entries.length < current.entries.length)
                return current;
            return state;
        }, undefined as undefined | WeatherSerie)!
    }

    protected static processWeatherData(data: MeteoQueryResponseType["weatherRange"]) {

        return data;

        // Find the longest serie
        const longestSerie = MeteoResponseProcessor.getLongestWeatherSerie(data);

        const buffer: WeatherEntryType[] = [];


        const remappedSeries = data.map(serie => {

            longestSerie.entries.forEach(longestSerieEntry => {



            });

        });

        // Iterate over its entries
        for (let i of longestSerie.entries) {

            const time = i.time;

        }

        // Weather convert its data to proper entries

    }

    protected processGoogleData(data: MeteoQueryResponseType["range"]) {

        const buffer: BufferType = { };

        for (let column in data) {

        }
        
    }

}

export type MeteoDataProcessed = ReturnType<typeof MeteoResponseProcessor["process"]>