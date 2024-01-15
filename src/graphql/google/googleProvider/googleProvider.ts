import { ApolloError } from "@apollo/client";
import { randomUUID } from "crypto";
import { google } from "googleapis";
import { AvailableWeatherProperties, Properties, WeatherProperty } from "../../weather/definitions/properties";
import { GoogleColumn, GoogleColumnValue, GoogleDataColumnDefinition, GoogleRequest, GoogleScope } from "../google";

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
            // keyFile: "./public/credentials.json",
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

        const isString = this.isValidScopeString(item);

        const isNumber = parseFloat(item);

        if (isNaN(isNumber)) return false;

        return isString;

    }

    protected isValidScope(slug: string, row: any[]) {
        return this.isValidScopeString(row[0])
            && this.isValidScopeString(row[1])
            && this.isValidScopeString(row[2])
            && this.isValidScopeNumber(row[4])
            && this.isValidScopeNumber(row[5])
            && this.isValidScopeString(row[6])
            && this.isValidScopeString(row[7])
            && this.isValidScopeString(row[8])
            && this.isValidScopeString(row[9])
    }

    protected formatScope(row: any[]): GoogleScope {

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



    /** 
     * Fetches the scope's sheet id from the global config table 
     * @throws ApolloError in case of any errors
     * @deprecated Causes too many calls
    */
    public async getSheetId(
        scope: string
    ): Promise<string> {

        const api = await this.getSheetsClient();
        const response = await api.spreadsheets.values.get({
            spreadsheetId: GoogleSheetsProvider.CONFIG_SHEET_ID,
            range: this.formatQueryRange("A2:C", "Config")
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

    protected extractColumnValues(
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
                time: this.inputDateToTimestamp(row[0] as string),
                value: value,
                note: row[1]
            }
        });

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

        const sheetId = await this.getSheetId(args.scope);

        const api = await this.getSheetsClient();
        const response = await api.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: this.formatQueryRange("A1:Z", "Data")
        });

        const definitions = this.extractColumnDefinitions(response.data.values);

        const from = args.from;
        const to = args.to;

        const result: GoogleColumn[] = definitions.map((column, index) => {

            const values = this.extractColumnValues(response.data.values, index).filter(entry => {
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