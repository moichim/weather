import { fetchWeatherApi } from "openmeteo";
import { Serie, WeatherEntryType } from "../weather";
import { IProvider } from "./abstractProvider";
import { Sources } from "../weatherSources/source";

export class OpenmeteoProvider implements IProvider {

    public range = async (from: string, to: string) => {

        const params = {
            "latitude": 49.7245947848106,
            "longitude": 13.327946050435685,
            "hourly": ["temperature_2m", "rain", "showers", "snowfall", "snow_depth", "surface_pressure", "cloud_cover", "evapotranspiration", "wind_speed_10m", "wind_direction_10m"],
            "start_date": from,
            "end_date": to
        };
        const url = "https://api.open-meteo.com/v1/forecast";
        const responses = await fetchWeatherApi(url, params);
        
        // Helper function to form time ranges
        const range = (start: number, stop: number, step: number) =>
            Array.from({ length: (stop - start) / step }, (_, i) => start + i * step);
        
        // Process first location. Add a for-loop for multiple locations or weather models
        const response = responses[0];
        
        // Attributes for timezone and location
        const utcOffsetSeconds = response.utcOffsetSeconds();
        const timezone = response.timezone();
        const timezoneAbbreviation = response.timezoneAbbreviation();
        const latitude = response.latitude();
        const longitude = response.longitude();
        
        const hourly = response.hourly()!;
        
        // Note: The order of weather variables in the URL query and the indices below need to match!
        const weatherData = {
        
            hourly: {
                time: range(Number(hourly.time()), Number(hourly.timeEnd()), hourly.interval()).map(
                    (t) => new Date((t + utcOffsetSeconds) * 1000)
                ),
                temperature2m: hourly.variables(0)!.valuesArray()!,
                rain: hourly.variables(1)!.valuesArray()!,
                showers: hourly.variables(2)!.valuesArray()!,
                snowfall: hourly.variables(3)!.valuesArray()!,
                snowDepth: hourly.variables(4)!.valuesArray()!,
                surfacePressure: hourly.variables(5)!.valuesArray()!,
                cloudCover: hourly.variables(6)!.valuesArray()!,
                evapotranspiration: hourly.variables(7)!.valuesArray()!,
                windSpeed10m: hourly.variables(8)!.valuesArray()!,
                windDirection10m: hourly.variables(9)!.valuesArray()!,
            },
        
        };

        const getValue = <T extends string|number = number>(
            key: keyof typeof  weatherData["hourly"],
            index: number
         ) => {
            return weatherData.hourly[key][index] as T;
        }

        const output: Serie = {
            source: Sources.one( "openmeteo" ),
            entries: weatherData.hourly.time.map( ( date, index ) => {
                return {
                    time: date.getTime(),
                    temperature: getValue( "temperature2m", index ),
                    wind_dir: getValue("windDirection10m", index),
                    wind_speed: getValue( "windSpeed10m", index ),
                    bar: getValue("surfacePressure", index ),
                    rain: getValue( "rain", index ),
                    clouds: getValue( "cloudCover", index ),
                } as WeatherEntryType
            } )
        }

        return output;

    }

}