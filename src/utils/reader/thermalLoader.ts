import fetch from 'cross-fetch';

import AbstractParser from "./AbstractParser";
import LrcParser from "./lrcParser";

export class ThermalLoader {

    protected url: string;
    protected blob?: Blob;
    protected parser?: AbstractParser;

    constructor( url: string ) {
        this.url = url;
    }

    public static async fromUrl(
        url: string
    ) {
        const instance = new ThermalLoader( url );
        return await instance.load();
    }

    public async load() {
        return await this.loadFile().then( file => file.parse() );
    }

    /** This method is public only for the purpose of tests. */
    protected async loadFile() {

        const blob = await fetch(this.url)
            .then(response => {
                const b = response.blob();
                return b;
            });

        if (blob === undefined)
            throw new Error(`File '${this.url}' was not found!`);

        this.blob = blob;

        this.parser = this.assignParserInstance( blob );

        return this.parser;

    }

    protected assignParserInstance( blob: Blob ) {
        return new LrcParser( this.url, blob );
    }

    /** This method is public only for the purpose of tests. */
    public _getParserInstance() {

        return this.parser;

    }

}