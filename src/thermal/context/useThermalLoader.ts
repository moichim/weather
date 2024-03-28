import { useCallback, useState } from "react";
import { ThermoFileDefinition } from "../graphql/files";
import { ThermalGroup } from "../registry/ThermalGroup";
import { ThermalRegistry } from "../registry/ThermalRegistry";
import { ProjectDescription } from "./useProjectLoader";
import { ThermalContainerStates } from "../registry/abstractions/ThermalObjectContainer";

/** 
 * Takes care of the loading and of group management
 */
export const useThermalGroupLoader = (
    registry: ThermalRegistry,
) => {

    const [ groups, setGroups ] = useState<ThermalGroup[]>( [] );

    /** Load an entire project from scratch and return its active groups */
    const loadProjectFromScratch = useCallback( async ( description: ProjectDescription ) => {

        registry.setStateEmpty();

        // Reset all groups
        setGroups( [] );

        for ( const groupId in description ) {

            const groupDefinition = description[ groupId ];

            const group = registry.addOrGetGroup( groupId );

            if ( group.loadingState !== ThermalContainerStates.LOADING )
                group.requestFiles( groupDefinition.files );

        }

        const result = await registry.resolveAllGroups();


        // Set new groups
        if ( result ) {
            setTimeout( () => setGroups( result.filter(r => r !== undefined) as ThermalGroup[] ), 1 );
        }


        return result;

    }, [registry, setGroups] );


    /** Request a single one group and return it. */
    const loadOneGroupOverridingExisting = useCallback( async ( 
        groupId: string,
        files: ThermoFileDefinition[]
    ) => {

        const group = registry.addOrGetGroup( groupId );

        group.requestFiles( files );

        const result = await group.resolveQuery();

        if ( ! groups.map( g => g.id ).includes( groupId ) ) {

            setGroups( prev => {
                return [...prev, group ];
            } );

        }

        return result;

    }, [ registry ] );

    /** Remove a single one group */
    const removeOneGroup = useCallback( (
        group: string|ThermalGroup
    ) => {

        const groupId = typeof group === "string"
            ? group
            : group.id;

        registry.removeGroup( groupId );

        // Remove the group from the local state
        setGroups( prev => prev.filter( g => g.id !== groupId ) );

    }, [ registry ] );

    const removeAllGroups = useCallback( () => {

        registry.setStateEmpty();
        setGroups( groups );

    }, [registry, groups] );

    return {
        loadProjectFromScratch,
        loadOneGroupOverridingExisting,
        removeOneGroup,
        removeAllGroups,
        groups
    }


}