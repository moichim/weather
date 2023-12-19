import { ApolloError } from "@apollo/client";
import { google } from "googleapis";
import { GoogleColumn, GoogleColumnValue, GoogleDataColumnDefinition, GoogleRequest, GoogleScope } from "../google";
import { AvailableWeatherProperties, Properties, WeatherProperty } from "../../weather/definitions/properties";

export type ValueSerieDefinition = {
    name: string,
    slug: string,
    id: number,
    color: string,
    in: WeatherProperty[]
}

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

    protected static DATA_TAB_NAME = "Data";


    protected static async getClient() {

        const auth = new google.auth.GoogleAuth({
            keyFile: "./public/credentials.json",
            credentials: {
                type: process.env.GOOGLE_TYPE!,
                project_id: process.env.GOOGLE_PROJECT_ID!,
                private_key: process.env.GOOGLE_PRIVATE_KEY!,
                client_email: process.env.GOOGLE_CLIENT_EMAIL!,
                client_id: process.env.GOOGLE_CLIENT_ID!,
                token_url: process.env.GOOGLE_TOKEN_URI!,
                universe_domain: process.env.GOOGLE_UNIVERSE_DOMAIN!,
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        return google.sheets({
            version: 'v4',
            auth: auth
        });
    }

    protected static formatQueryRange(
        range: string,
        sheet: string = GoogleSheetsProvider.CONFIG_TAB_NAME
    ): string {
        return `${sheet}!${range}`
    }

    public static async getSheets(): Promise<GoogleSheetsDefinitionType[]> {
        const api = await GoogleSheetsProvider.getClient();
        const config = await api.spreadsheets.values.get({
            spreadsheetId: GoogleSheetsProvider.CONFIG_SHEET_ID,
            range: GoogleSheetsProvider.formatQueryRange("A2:C")
        });

        return config.data.values!.map(row => ({
            name: row[0],
            sheetId: row[1]
        }));

    }

    protected static inputDateToString(
        input: string
    ): string {

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

    protected static isValidScopeString(item: any) {
        const result = typeof item === "string"
            && item !== "";

        return result;
    }

    protected static isValidScopeNumber(item: any) {

        const isString = GoogleSheetsProvider.isValidScopeString(item);

        const isNumber = parseFloat(item);

        if (isNaN(isNumber)) return false;

        return isString;

    }

    protected static isValidScope(slug: string, row: any[]) {
        return GoogleSheetsProvider.isValidScopeString(row[0])
            && GoogleSheetsProvider.isValidScopeString(row[1])
            && GoogleSheetsProvider.isValidScopeString(row[2])
            && GoogleSheetsProvider.isValidScopeNumber(row[4])
            && GoogleSheetsProvider.isValidScopeNumber(row[5])
            && GoogleSheetsProvider.isValidScopeString(row[6])
            && GoogleSheetsProvider.isValidScopeString(row[7])
            && GoogleSheetsProvider.isValidScopeString(row[8])
            && GoogleSheetsProvider.isValidScopeString(row[9])
    }

    protected static formatScope(row: any[]): GoogleScope {

        const lat = parseFloat(row[4].replace(",", "."));
        const lon = parseFloat(row[5].replace(",", "."));

        return {
            name: row[0],
            slug: row[1],
            sheetId: row[2],
            lat,
            lon,
            hasNtc: row[6] === "1",
            isDefault: row[7] === "1",
            team: row[8],
            locality: row[9],
            description: row[10]
        }
    }


    public static async getScope(scope: string) {
        
        const scopes = await GoogleSheetsProvider.getAllScopes();

        return scopes.find(row => row.slug === scope);

    }

    public static async getAllScopes(): Promise<GoogleScope[]> {

        const api = await GoogleSheetsProvider.getClient();
        const response = await api.spreadsheets.values.get({
            spreadsheetId: GoogleSheetsProvider.CONFIG_SHEET_ID,
            range: GoogleSheetsProvider.formatQueryRange("A2:Z", "Config")
        });

        const correctRows = response.data.values!.filter(row => GoogleSheetsProvider.isValidScope(row[1], row));

        return correctRows.map(row => GoogleSheetsProvider.formatScope(row))

    }



    /** 
     * Fetches the scope's sheet id from the global config table 
     * @throws ApolloError in case of any errors
    */
    public static async getSheetId(
        scope: string
    ): Promise<string> {
        const api = await GoogleSheetsProvider.getClient();
        const response = await api.spreadsheets.values.get({
            spreadsheetId: GoogleSheetsProvider.CONFIG_SHEET_ID,
            range: GoogleSheetsProvider.formatQueryRange("A2:C", "Config")
        });

        const [row] = response.data.values!.filter((entry) => {
            return entry[1] === scope;
        });

        if (row === undefined) {
            throw new ApolloError({
                errorMessage: "Scope not found"
            })
        }

        if (row.length < 3) {
            throw new ApolloError({
                errorMessage: "Scope is not defined properly"
            })
        }

        return row[2] as string;

    }

    protected static extractColumnDefinitionFromResponseData(
        data: any[][] | null | undefined,
        index: number
    ): GoogleDataColumnDefinition {

        if (!data)
            throw new ApolloError({
                errorMessage: "Google data error"
            });

        const columnIndex = index + 2;

        return {
            name: data[1][columnIndex] as string,
            slug: data[0][columnIndex] as string,
            in: Properties.one(data[2][columnIndex] as AvailableWeatherProperties),
            description: data[3][columnIndex] as string | undefined,
            color: data[4][columnIndex] as string,
        }

    }

    protected static extractColumnValues(
        data: any[][] | null | undefined,
        index: number
    ): GoogleColumnValue[] {
        if (!data)
            throw new ApolloError({
                errorMessage: "Google data error"
            });

        const columnIndex = index + 2;

        const valueRows = data.filter((_, i) => i > 6);

        const relevantRows = valueRows.filter((row, i) => {
            return row[columnIndex] !== "" && row[columnIndex] !== undefined;
        });

        return relevantRows.map(row => {

            let valueRaw = row[columnIndex];
            if (typeof valueRaw === "string") {
                valueRaw = valueRaw.replace(",", ".");
            }

            const value = parseFloat(valueRaw);

            return {
                time: GoogleSheetsProvider.inputDateToTimestamp(row[0] as string),
                value: value,
                note: row[1]
            }
        });

    }

    protected static extractColumnDefinitions(data: any[][] | null | undefined): GoogleDataColumnDefinition[] {

        if (!data)
            throw new ApolloError({
                errorMessage: "Google data error"
            });

        const columnsCount = data[0].filter((_, index) => index > 1).length;

        const defs: GoogleDataColumnDefinition[] = [];

        for (let i = 0; i < columnsCount; i++) {
            defs.push(GoogleSheetsProvider.extractColumnDefinitionFromResponseData(data, i));
        }

        return defs;

    }

    public static async range(args: GoogleRequest): Promise<any> {

        const sheetId = await GoogleSheetsProvider.getSheetId(args.scope);

        const api = await GoogleSheetsProvider.getClient();
        const response = await api.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: GoogleSheetsProvider.formatQueryRange("A1:Z99999", "Data")
        });

        const definitions = GoogleSheetsProvider.extractColumnDefinitions(response.data.values);

        const from = args.from;
        const to = args.to;

        const result: GoogleColumn[] = definitions.map((column, index) => {

            const values = GoogleSheetsProvider.extractColumnValues(response.data.values, index).filter(entry => {
                return entry.time >= from && entry.time <= to;
            });

            const min = values.reduce((state, current) => {
                if (current.value < state) return current.value;
                return state;
            }, Infinity);

            const max = values.reduce((state, current) => {
                if (current.value > state) return current.value;
                return state;
            }, -Infinity);

            const count = values.length;

            const avg = values.reduce((state, current) => current.value + state, 0) / count;




            return {
                ...column,
                values,
                min: min !== Infinity ? min : null,
                max: max !== -Infinity ? max : null,
                avg: count > 0 ? avg : null,
                count
            }
        });

        return result;

    }

}