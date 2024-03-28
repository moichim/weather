import { ThermalGroup } from "../ThermalGroup";
import { ThermalRegistry } from "../ThermalRegistry";
import { ThermalMinmaxOrUndefined } from "../interfaces";
import { AbstractMinmaxProperty } from "./AbstractMinmaxProperty";
import { IBaseProperty } from "./abstractProperty";

export interface IWithMinmaxRegistry extends IBaseProperty {
    minmax: MinmaxRegistryProperty
}

export class MinmaxRegistryProperty extends AbstractMinmaxProperty<ThermalRegistry> {

    protected validate(value: ThermalMinmaxOrUndefined): ThermalMinmaxOrUndefined {
        return value;
    }

    protected afterSetEffect(value: ThermalMinmaxOrUndefined) {
    
    }

    public recalculateFromGroups() {

        const groups = this.parent.groups.value;

        this.value = this._getMinmaxFromAllGroups( groups );
    }

    protected _getMinmaxFromAllGroups(
        groups: ThermalGroup[]
    ): ThermalMinmaxOrUndefined {

        if (groups.length === 0) {
            return undefined;
        }

        const minmax = groups.reduce((state, current) => {

            if (current.minmax === undefined) {
                return state;
            }

            return {
                min: current.minmax.min < state.min ? current.minmax.min : state.min,
                max: current.minmax.max > state.max ? current.minmax.max : state.max
            }

        }, { min: Infinity, max: -Infinity });

        return minmax;

    }
}