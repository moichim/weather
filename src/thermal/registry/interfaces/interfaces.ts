import { IWithGroups } from "../properties/GroupProperty";
import { IWithLoading } from "../properties/LoadingProperty";
import { IWithMinmaxRegistry } from "../properties/MinmaxRegistryProperty";
import { IWithOpacity } from "../properties/OpacityDrive";
import { IWithRangeGroup } from "../properties/RangeGroupProperty";
import { IWithRange } from "../properties/RangeDriver";

export interface IThermalObjectBase {
    destroySelfAndBelow: () => void,
    removeAllChildren: () => void,
    reset: () => void
}

export interface IThermalContainer 
    extends IThermalObjectBase,
        IWithOpacity, 
        IWithLoading,
        IWithOpacity,
        IWithMinmaxRegistry,
        IWithRange
    {}

export interface IThermalGroup 
extends IThermalContainer,
        IWithRangeGroup
{}

export interface IThermalRegistry 
    extends IThermalContainer,
        IWithGroups
{}
