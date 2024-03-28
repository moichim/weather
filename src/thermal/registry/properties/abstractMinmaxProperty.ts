import { ThermalGroup } from "../ThermalGroup";
import { ThermalRegistry } from "../ThermalRegistry";
import { ThermalMinmaxOrUndefined } from "../interfaces";
import { IThermalContainer } from "../interfaces/interfaces";
import { AbstractProperty, IBaseProperty } from "./abstractProperty"

export interface IWithMinmax extends IBaseProperty {}

export abstract class AbstractMinmaxProperty<Target extends ThermalRegistry|ThermalGroup> extends AbstractProperty<ThermalMinmaxOrUndefined, Target> {

    protected validate(value: ThermalMinmaxOrUndefined): ThermalMinmaxOrUndefined {
        return value;
    }

    protected afterSetEffect(value: ThermalMinmaxOrUndefined) {
    
    }
}