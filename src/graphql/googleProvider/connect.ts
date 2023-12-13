import { google, sheets_v4 } from "googleapis"
import { ValueSerieDefinition } from "../value";
import { Properties, WeatherProperty } from "../weatherSources/properties";
import { dateFromString } from "@/utils/time";
import { parse, parseISO } from "date-fns";

const serviceAccountKeyFile = "./public/credentials.json"

export type GoogleSheetsDefinitionType = {
    name: string,
    sheetId: string
}

export type GooglePropertyResponse = ValueSerieDefinition & {

    min: number,
    max: number,
    avg: number,
    count: number,

    /* Filtered values */
    values: {
        [index: number]: number
    },

}

export type GoogleResponseType = {
    columns: GooglePropertyResponse[]
}

export class GoogleSheetsProvider {

    protected static CONFIG_SHEET_ID = "1YNjQNCUYUlw96uaQ6RYTq4MG5zUzhHwW-XM-chJWkjE";

    protected static CONFIG_TAB_NAME = "Config";

    protected static getCredentials() {

        return {
            
        }

    }

    protected static async getClient() {
        const auth = new google.auth.GoogleAuth({
            // keyFile: serviceAccountKeyFile,
            credentials:{
                type: process.env.GOOGLE_ACCOUNT_TYPE!,
                project_id: process.env.GOOGLE_PROJECT_ID!,
                private_key: process.env.GOOGLE_ACCOUNT_PRIVATE_KEY!,
                client_email: process.env.GOOGLE_ACCOUNT_CLIENT_EMAIL!,
                client_id: process.env.GOOGLE_ACCOUNT_CLIENT_ID!,
                token_url: process.env.GOOGLE_ACCOUNT_TOKEN_URI!,
                universe_domain: process.env.GOOGLE_ACCOUNT_UNIVERSE_DOMAIN!,
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });
        return google.sheets({
            version: 'v4',
            auth: auth
        });
    }

    protected static range(
        range: string,
        sheet: string = GoogleSheetsProvider.CONFIG_TAB_NAME
    ): string {
        return `${sheet}!${range}`
    }

    public static async getSheets(): Promise<GoogleSheetsDefinitionType[]> {
        const api = await GoogleSheetsProvider.getClient();
        const config = await api.spreadsheets.values.get({
            spreadsheetId: GoogleSheetsProvider.CONFIG_SHEET_ID,
            range: GoogleSheetsProvider.range("A2:C")
        });

        return config.data.values!.map(row => ({
            name: row[0],
            sheetId: row[1]
        }));

    }

    protected static inputDateToString(
        input: string
    ): string {

        console.log( input );

        const [day, hours] = input.split(" ");

        const [D, M, Y] = day.split(".");
        const [H, m] = hours.split(":");

        return `${Y}-${M}-${D} ${H}:${m}`;
    }


    protected static inputDateToDate(input: string): Date {
        return new Date(GoogleSheetsProvider.inputDateToString(input));
    }

    protected static inputDateToTimestamp(input: string): number {
        return GoogleSheetsProvider.inputDateToDate(input).getTime();
    }


    public static async getData(): Promise<GoogleResponseType> {
        const api = await GoogleSheetsProvider.getClient();
        const response = await api.spreadsheets.values.get({
            spreadsheetId: GoogleSheetsProvider.CONFIG_SHEET_ID,
            range: GoogleSheetsProvider.range("A1:Z99999", "Data")
        });


        // Fetch properties
        const properties = response.data.values![0]!
            .filter((cell, index) => index > 1)
            .map((property, index) => {

                const i = index + 2;
                return {
                    slug: property as string,
                    id: property as number,
                    name: response.data.values![1]![i] as string,
                    in: [
                        Properties.one(response.data.values![2]![i]!),
                    ] as WeatherProperty[],
                    description: response.data.values![3]![i]! as string,
                    color: response.data.values![4]![i]! as string
                } as ValueSerieDefinition
            });

        // Assamble the data for properties
        const data = properties.map((property, index) => {

            const i = index + 2;

            const valuesRaw = response.data.values?.filter((v, index) => index > 6);

            const valuesEntries = valuesRaw?.filter((v, index) => v[i])
                .map(entry => {

                    const time = GoogleSheetsProvider.inputDateToTimestamp(entry[0]);
                    return [
                        time,
                        entry[i]
                            ? parseFloat(entry[i])
                            : undefined
                    ];

                })!;

            const valuesFiltered = Object.fromEntries(valuesEntries);

            const min = Object.values<number>(valuesFiltered).reduce((
                state: number,
                current: number
            ) => {

                if (current < state) return current;
                return state;

            }, Infinity as number);

            const max = Object.values<number>(valuesFiltered).reduce((
                state: number,
                current: number
            ) => {

                if (current > state) return current;
                return state;

            }, -Infinity as number);

            const count = Object.values(valuesFiltered).length;

            const avg = Object.values<number>(valuesFiltered).reduce((
                state: number,
                current: number
            ) => {
                return state + current;
            }, 0) / count;

            return {
                ...property,
                values: valuesFiltered,
                min,
                max,
                avg,
                count
            } as GooglePropertyResponse

        });

        return {
            columns: data,
        };
    }

    public static async listTabs() {
        const sheets = await GoogleSheetsProvider.getClient();
    }

}