import { ThermalGroup } from "../ThermalGroup";
import { ThermalRegistry } from "../ThermalRegistry";
import { ThermalMinmaxOrUndefined } from "../interfaces";
import { AbstractMinmaxProperty } from "./AbstractMinmaxProperty";
import { IBaseProperty } from "./abstractProperty";

export interface IWithMinmaxRegistry extends IBaseProperty {
    minmax: MinmaxGroupProperty
}

export class MinmaxGroupProperty extends AbstractMinmaxProperty<ThermalGroup> {

    protected validate(value: ThermalMinmaxOrUndefined): ThermalMinmaxOrUndefined {
        return value;
    }

    protected afterSetEffect(value: ThermalMinmaxOrUndefined) {
    
    }

    public recalculateFromInstances() {

        const instances = this.parent.getInstancesArray();
    }
}