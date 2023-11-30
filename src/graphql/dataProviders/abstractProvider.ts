import { Serie } from "../weather";

export interface IProvider {

    fetch: ( from: string, to: string ) => Promise<Serie>

    // single: ( time: number ) => Promise<Serie>

}
