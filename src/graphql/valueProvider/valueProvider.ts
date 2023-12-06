import { generateRandomColor, generateRandomString } from "@/utils/strings";
import { ValueEntryType, ValueSerieDefinition, ValueSerieProcessedType, ValueSerieResponseType, ValueindexType } from "../value";
import { WeatherProviderRequest } from "../weather";
import { AvailableWeatherProperties, Properties, WeatherProperty } from "../weatherSources/properties";
import { dateFromString } from "@/utils/time";
import fs from "fs";
import { parse } from "yaml";
import Joi from "joi";
import { ServerResponse } from "http";

/** Data format of the YML files */
type ServerResponseFormat = {
    schema: {
        [index: string]: {
            name: string,
            description?: string,
            color: string,
            id: number,
            slug: string,
            in: AvailableWeatherProperties[]
        }
    },
    values: {
        [index: string]: {
            [T in keyof ServerResponseFormat["schema"]]: number
        } & {
            note?: string
        }
    }

}


export class ValueProvider {

    protected readonly from: number;
    protected readonly to: number;

    protected data?: ServerResponseFormat;
    protected processed?: ValueSerieResponseType[];


    public constructor(
        protected readonly fromString: string,
        protected readonly toString: string
    ) {
        this.from = dateFromString( fromString ).getTime();
        this.to = dateFromString( toString ).getTime();
    }


    public async init() {
        await this.fetchData();
        this.processed = this.processData();
    }


    public get() {
        return this.processed!;
    }


    protected processData(): ValueSerieResponseType[] {

        const output: ValueSerieResponseType[] = [];

        for ( let property of Object.values( this.data!["schema"] ) ) {

            const prop = this.formatProperty( property.slug );

            output.push( prop )

        }

        return output;

    }


    protected async fetchData(): Promise<ServerResponseFormat> {

        const file = fs.readFileSync("./public/ntc/data.yml");

        try {
            const data = this.processInput(file);
            this.data = data;
            return await data;
        } catch (error) {

            return await {
                schema: {},
                values: {}
            }

        }

    }

    protected getData(): ServerResponseFormat {
        return this.data!;
    }


    protected getValidationSchema() {

        const property = {
            name: Joi.string().required(),
            description: Joi.string(),
            color: Joi.string().required(),
            id: Joi.number().required(),
            in: Joi.array().items(Joi.string())
        };

        const value = Joi.object({
            note: Joi.string()
        }).pattern(Joi.string(), Joi.number())

        return Joi.object({
            schema: Joi.object().pattern(Joi.string(), property),
            values: Joi.object().pattern(
                /^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}$/,
                value
            )
        });
    }


    protected processInput(data: Buffer): ServerResponseFormat {

        const yml = data.toString();
        const json = parse(yml);

        const { value, error } = this.getValidationSchema().validate(json);

        if (error) {
            throw new Error(error.message);
        }

        // Convert properties from strings to objects
        for (let property in value.schema) {

            value.schema[property].in = value.schema[property].in.map((prop: AvailableWeatherProperties) => Properties.one(prop));
            value.schema[property].slug = property;

        }

        return value as ServerResponseFormat

    }


    protected formatProperty( key: string ): ValueSerieResponseType {

        const definition = this.data!.schema[key]! as unknown as ValueSerieDefinition;
        const values = this.formatPropertyValues( key );

        return {
            ...definition,
            values: values
        }
    }


    protected formatPropertyDefinition(
        key: string
    ): ValueSerieDefinition {
        const vals = this.getData();
        const def = vals["schema"][key] as unknown as ValueSerieDefinition;
        return def;
    }


    /** @todo This should apply from & to filters */
    protected formatPropertyValues(
        key: string
    ): ValueEntryType[] {

        const values = Object.entries( this.getData().values )
            .map( ( [time,record] ) => this.convertValueToEntry( time, key, record ))

        return values

    }


    /** Convert a value from incoming format to outgoing */
    protected convertValueToEntry(
        time: string,
        key: string,
        record: ServerResponseFormat["values"][string]
    ): ValueEntryType {
        const date = new Date(time);
        return {
            value: record[key],
            time: date.getTime(),
            note: record["note"]
        }
    }


}