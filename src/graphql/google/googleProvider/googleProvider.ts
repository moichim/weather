import { ApolloError } from "@apollo/client";
import { randomUUID } from "crypto";
import { google } from "googleapis";
import { AvailableWeatherProperties, Properties, WeatherProperty } from "../../weather/definitions/properties";
import { GoogleColumn, GoogleColumnValue, GoogleDataColumnDefinition, GoogleRequest, GoogleScope } from "../google";
import GoogleProviderUtils from "./googleProviderUtils";

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



class GoogleSheetsProvider {

    protected static CONFIG_SHEET_ID = "1YNjQNCUYUlw96uaQ6RYTq4MG5zUzhHwW-XM-chJWkjE";

    protected static CONFIG_TAB_NAME = "Config";

    protected static DATA_TAB_NAME = "Data";

    public readonly ID: string;
    protected cachedResult: {
        [index: string]: GoogleScope
    } = {};

    protected storeCachedResults(scopes: GoogleScope[]) {
        this.cachedResult = Object.fromEntries(scopes.map(s => [s.slug, s]));
    }
    protected storeCachedResult(scope: GoogleScope) {
        this.cachedResult[scope.slug] = scope;
    }

    protected getCachedResult(slug: string) {
        return Object.keys(this.cachedResult).includes(slug)
            ? this.cachedResult[slug]
            : undefined;
    }

    protected getCachedResults() {
        return Object.entries(this.cachedResult).length > 0
            ? Object.values(this.cachedResult)
            : undefined;
    }

    public constructor() {
        this.ID = randomUUID();
    }

    protected static getInstance() {
        return googleSheetsProvider;
    }

    protected async getAuth() {
        return new google.auth.GoogleAuth({
            credentials: {
                type: process.env.GOOGLE_TYPE!,
                project_id: process.env.GOOGLE_PROJECT_ID!,
                private_key: process.env.GOOGLE_PRIVATE_KEY!,
                client_email: process.env.GOOGLE_CLIENT_EMAIL!,
                client_id: process.env.GOOGLE_CLIENT_ID!,
                token_url: process.env.GOOGLE_TOKEN_URI!,
                universe_domain: process.env.GOOGLE_UNIVERSE_DOMAIN!,
            },
            scopes: [
                'https://www.googleapis.com/auth/spreadsheets',
                'https://www.googleapis.com/auth/documents'
            ],
        });
    }

    protected async getDocsClient() {
        const auth = await this.getAuth();

        return google.docs({
            version: "v1",
            auth: auth
        });
    }

    protected async getSheetsClient() {

        const auth = await this.getAuth();

        return google.sheets({
            version: 'v4',
            auth: auth
        });
    }

    protected formatQueryRange(
        range: string,
        sheet: string = GoogleSheetsProvider.CONFIG_TAB_NAME
    ): string {
        return `${sheet}!${range}`
    }

    protected inputDateToString(
        input: string
    ): string {

        const [day, hours] = input.split(" ");

        const [D, M, Y] = day.split(".");
        const [H, m] = hours.split(":");

        return `${Y}-${M}-${D} ${H}:${m}`;

    }

    protected inputDateToDate(input: string): Date {
        return new Date(this.inputDateToString(input));
    }

    protected inputDateToTimestamp(input: string): number {
        return this.inputDateToDate(input).getTime();
    }

    protected isValidScopeString(item: any) {
        const result = typeof item === "string"
            && item !== "";

        return result;
    }

    protected isValidScopeNumber(item: any) {

        return GoogleProviderUtils.isValidNumericalValue( item );

    }

    protected isValidScope(slug: string, row: any[]) {
        return this.isValidScopeString(row[0])
            && this.isValidScopeString(row[1])
            && this.isValidScopeString(row[2])
            && this.isValidScopeString(row[3])
            && this.isValidScopeNumber(row[4])
            && this.isValidScopeNumber(row[5])
            && this.isValidScopeString(row[6])
            && this.isValidScopeString(row[7])
            && this.isValidScopeString(row[8])
            && this.isValidScopeString(row[9])
    }

    protected formatScope(row: any[]): GoogleScope {

        return {
            name: row[0],
            slug: row[1],
            sheetId: row[2],
            sheetTab: row[3],
            lat: GoogleProviderUtils.sanitizeNumericalValueRequired( row[4] ),
            lon: GoogleProviderUtils.sanitizeNumericalValueRequired( row[5] ),
            hasNtc: row[6] === "1",
            isDefault: row[7] === "1",
            team: row[8],
            locality: row[9],
            description: row[10]
        }
    }


    /** @deprecated Should use instances or be releted */
    public async getScope(scope: string) {

        const scopes = await this.getAllScopes();

        const result = scopes.find(row => row.slug === scope);

        if (result === undefined)
            throw new ApolloError({
                errorMessage: `Scope ${scope} not found!`
            });

        return result;

    }

    public async getAllScopes(): Promise<GoogleScope[]> {

        const cached = this.getCachedResults();

        if (cached) {
            return cached;
        }

        const api = await this.getSheetsClient();
        const response = await api.spreadsheets.values.get({
            spreadsheetId: GoogleSheetsProvider.CONFIG_SHEET_ID,
            range: this.formatQueryRange("A2:Z", "Config")
        });

        const correctRows = response.data.values!.filter(row => this.isValidScope(row[1], row));

        const scopes = correctRows.map(row => this.formatScope(row));

        this.storeCachedResults(scopes);

        return scopes;

    }

    protected extractColumnDefinitionFromResponseData(
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


    /** Take the table and the property index and extract the values into the desired output format. */
    protected extractColumnValues(
        data: any[][] | null | undefined,
        propertyIndex: number,
        filterRowsFromTimestamp: number,
        filterRowsToTimestamp: number
    ): GoogleColumnValue[] {
        if (!data)
            throw new ApolloError({
                errorMessage: "Google data error"
            });

        const columnIndex = propertyIndex + 2;

        const result: GoogleColumnValue[] = [];

        data.forEach( (row, rowIndex) => {

            // Take only content rows, not the header
            if ( rowIndex <= 6 ) return;

            // Filter rows by the provided time range
            const time = this.inputDateToTimestamp( row[0] as string );
            if ( time <= filterRowsFromTimestamp || time >= filterRowsToTimestamp ) return;

            // Add entry only when the row is valid number
            const formattedValue = GoogleProviderUtils.sanitizeNumericalValue( row[columnIndex] );
            if ( formattedValue !== undefined ) {

                result.push( {
                    time: this.inputDateToTimestamp(row[0] as string),
                    value: GoogleProviderUtils.sanitizeNumericalValueRequired( row[columnIndex] ),
                    note: row[1]
                } );

            }

        } );

        return result;

    }

    protected extractColumnDefinitions(data: any[][] | null | undefined): GoogleDataColumnDefinition[] {

        if (!data)
            throw new ApolloError({
                errorMessage: "Google data error"
            });

        const columnsCount = data[0].filter((_, index) => index > 1).length;

        const defs: GoogleDataColumnDefinition[] = [];

        for (let i = 0; i < columnsCount; i++) {
            defs.push(this.extractColumnDefinitionFromResponseData(data, i));
        }

        return defs;

    }

    /** @deprecated Should know sheet ID from the context */
    public async range(args: GoogleRequest): Promise<any> {

        const sheetId = args.sheetId;

        const api = await this.getSheetsClient();
        const response = await api.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: this.formatQueryRange("A1:Z", args.sheetTab)
        });

        const definitions = this.extractColumnDefinitions(response.data.values);

        const from = args.from;
        const to = args.to;

        const result: GoogleColumn[] = definitions.map((column, index) => {

            // Retrieve values from the response
            const values = this.extractColumnValues(
                response.data.values, 
                index,
                from,
                to
            );

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


    public async getDocument() {

        const client = await this.getDocsClient();

        const response = await client.documents.get({
            documentId: "1ju2ejVopG71HijyAjS9XZP3YWvGFHblncbLm2twrJRU"
        });

        return response;

    }

}

/** Create the global instance of the provider in order to prevent multiple calls */
export const googleSheetsProvider = new GoogleSheetsProvider;