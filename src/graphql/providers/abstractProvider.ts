import { Serie } from "../weather";

export interface IProvider {

    range: ( from: number, to: number ) => Promise<Serie>

    // single: ( time: number ) => Promise<Serie>

}
