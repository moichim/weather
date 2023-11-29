import { Serie } from "../weather";

export interface IProvider {

    range: ( from: string, to: string ) => Promise<Serie>

    // single: ( time: number ) => Promise<Serie>

}
