import { IWithHighlight } from "../properties/drives/HighlightDrive";
import { IWithOpacity } from "../properties/drives/OpacityDrive";
import { IWithPalette } from "../properties/drives/PaletteDrive";
import { IWithRange } from "../properties/drives/RangeDriver";
import { IWithGroups } from "../properties/properties/GroupProperty";
import { IWithLoading } from "../properties/properties/LoadingProperty";
import { IWithMinmaxGroup } from "../properties/properties/MinmaxGroupProperty";
import { IWithMinmaxRegistry } from "../properties/properties/MinmaxRegistryProperty";

export interface IThermalObjectBase {
    destroySelfAndBelow: () => void,
    removeAllChildren: () => void,
    reset: () => void
}

export interface IThermalContainer 
    extends IThermalObjectBase
    {}

export interface IThermalGroup 
extends IThermalContainer,
    IWithMinmaxGroup
{}

export interface IThermalRegistry 
    extends IThermalContainer,
        IWithGroups,
        IWithOpacity, 
        IWithLoading,
        IWithMinmaxRegistry,
        IWithRange,
        IWithPalette,
        IWithHighlight
{}
