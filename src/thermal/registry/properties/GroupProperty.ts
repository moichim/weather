import { ThermalGroup } from "../ThermalGroup";
import { ThermalRegistry, ThermalStatistics } from "../ThermalRegistry";
import { MinmaxRegistryProperty } from "./MinmaxRegistryProperty";
import { RangeDriver } from "./RangeDriver";
import { AbstractProperty, IBaseProperty } from "./abstractProperty";

export interface IWithGroups extends IBaseProperty {
    groups: GroupsProperty
}

export class GroupsProperty extends AbstractProperty<ThermalGroup[], ThermalRegistry> {

    protected _map: Map<string, ThermalGroup> = new Map<string,ThermalGroup>();

    public get map() { return this._map; }

    protected validate(value: ThermalGroup[]): ThermalGroup[] {
        return value;
    }

    protected afterSetEffect(value: ThermalGroup[]) {

        // Clear the index
        this._map.clear();

        // Create the new values
        value.forEach( group => this._map.set( group.id, group ) );

    }

    public addOrGetGroup(
        groupId: string
    ) {
        if ( this._map.has( groupId ) ) {
            return this._map.get( groupId ) as ThermalGroup;
        }

        // Create the new group
        const group = new ThermalGroup(this.parent, groupId);

        // Add this group to the index
        this._map.set( groupId, group );

        // Add the group to the value
        this.value.push( group );

        return group;
    }

    public removeGroup(
        groupId: string
    ) {

        // Do nothing when the group is not there
        if ( !this._map.has( groupId ) ) {
            return;
        }

        // Call the destroy method of the group
        this._map.get( groupId )?.destroySelf();

        // Delete the group from the index
        this._map.delete( groupId );

        // Recreate the index
        this.value = Array.from( this._map.values() );

    }

    public removeAllGroups() {

        // Trigger the destruction of all existing groups
        this.value.forEach( group => group.destroySelf() );

        // Set the empty array of groups
        this.value = [];

    }

}