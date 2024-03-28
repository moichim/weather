import { ThermalStatistics, ThermalRegistry } from "../ThermalRegistry";
import { AbstractProperty, IBaseProperty } from "./abstractProperty";

export interface IWithHistogram extends IBaseProperty {
    histogram: HistogramProperty
}

export class HistogramProperty extends AbstractProperty<ThermalStatistics[], ThermalRegistry> {

    protected resolution = 50;

    protected validate(value: ThermalStatistics[]): ThermalStatistics[] {
        return value;    
    }

    protected afterSetEffect(value: ThermalStatistics[]) {
        
    }


    public recalculate() {
        this.value = this._getHistorgramFromAllGroups();
    }


    public _getHistorgramFromAllGroups() {

        if (this.parent.minmax.value === undefined || this.parent.groups.value.length === 0) {
            return [];
        } else {

            // Get all pixels
            const allPixels = this.parent.groups.value.reduce((
                state,
                current
            ) => {

                const pixels = current.getInstancesArray().reduce((buf, instance) => {

                    buf = [...buf, ...instance.pixels];

                    return buf;

                }, [] as number[]);

                return [...state, ...pixels]

            }, [] as number[]);


            // Calculate the ten segments
            const segments: [number, number][] = [];

            const numSegments = this.resolution;
            const difference = this.parent.minmax.value.max - this.parent.minmax.value.min;
            const segment = difference / numSegments;

            for (let i = 0; i < numSegments; i++) {

                const from = (segment * i) + this.parent.minmax.value.min;
                const to = from + segment;

                segments.push([from, to]);

            }

            const results: {
                from: number,
                to: number,
                count: number
            }[] = [];

            let sum = allPixels.length;

            for ( let i of segments ) {

                const count = allPixels.filter( pixel => {
                    return pixel >= i[0] && pixel < i[1]; 
                }).length;

                sum = sum + count;

                results.push( {
                    from: i[0],
                    to: i[1],
                    count: count
                } );

            }

            const recalculated = results.map( i => {
                return {
                    ...i,
                    percentage: i.count / sum * 100,
                }
            } );

            const max = Math.max( ...recalculated.map( item => item.percentage ) );

            return recalculated.map( item => {
                return {
                    ...item,
                    height: item.percentage / max * 100
                }
            } ) as ThermalStatistics[];

        }


    }

}