import { generateRandomColor, generateRandomString } from "@/utils/strings";
import { ValueEntryType, ValueSerieDefinition, ValueSerieResponseType } from "../value";
import { WeatherProviderRequest } from "../weather";
import { Properties, WeatherProperty } from "../weatherSources/properties";
import { dateFromString } from "@/utils/time";

export class ValueProvider {

    public getAllSeries( args: WeatherProviderRequest ): ValueSerieResponseType[] {

        return [0,1,2, 4,5,6].map( () => this.generateFakeSerieWithData( args ) );

    }

    protected generateFakeSerie(): ValueSerieDefinition {
        return {
            name: generateRandomString(),
            slug: generateRandomString(),
            color: generateRandomColor(),
            in: [ Properties.pickRandomProperty() ],
            id: Math.round( Math.random() * 500 )
        }
    }

    protected generateFakeSerieWithData( args: WeatherProviderRequest ): ValueSerieResponseType {

        const definition = this.generateFakeSerie();

        return {
            ...definition,
            values: this.generateFakeValuesForProperty( args, definition.in[0] )
        }
    }

    protected generateFakeValuesForProperty( 
        args: WeatherProviderRequest, 
        property: WeatherProperty
    ) {
        const amount = 10 +  Math.round( ( Math.random() * 50 ) );

        const values: ValueEntryType[] = [];

        for ( let i = 0; i < amount; i++ ) {
            values.push( this.generateSingleValue( args, property ) );
        }

        values.sort( (a,b) => a.time - b.time );

        return values;

    }

    protected generateSingleValue( 
        args: WeatherProviderRequest,
        property: WeatherProperty
    ): ValueEntryType {
        return {
            time: this.generateDateInRange( args ),
            value: this.generateValue( property.min!, property.max! )
        }
    }

    protected generateValue( from: number, to: number ): number {
        return ( Math.random() * ( to - from ) ) + from;
    }

    protected generateDateInRange( args: WeatherProviderRequest ) {

        const from = dateFromString( args.from ).getTime();
        const to = dateFromString( args.to ).getTime();

        const deviation = ( to - from ) * Math.random();
        const date = new Date;

        date.setTime( from + deviation );
        date.setMinutes( 0 );
        date.setSeconds( 0 );
        date.setMilliseconds( 0 );

        return date.getTime();

    }

}