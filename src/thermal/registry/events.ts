"use client";

import { ThermalFileInstance } from "../file/ThermalFileInstance";
import { ThermalFileSource } from "../file/ThermalFileSource";
import { ThermalPalette, ThermalPalettes } from "../file/palettes";
import { ThermalGroup } from "./ThermalGroup";
import { ThermalRegistry } from "./ThermalRegistry";
import { ThermalContainerStates, ThermalObjectContainer } from "./abstractions/ThermalObjectContainer";
import { ThermalCursorPositionOrundefined, ThermalMinmaxOrUndefined, ThermalMinmaxType, ThermalRangeOrUndefined } from "./interfaces";

export enum ThermalEvents {

    GROUP_INIT = "groupinit",

    CONTAINER_EMPTIED = "containeremptied",

    CONTAINER_LOADING_STATE_CHANGED = "containerloadingstatechanged",

    /** @deprecated */
    GROUP_LOADING_START = "grouprequeststart",
    /** @deprecated */
    GROUP_LOADING_FINISH = "grouploadingfinish",

    SOURCE_REGISTERED = "sourceregistered",
    INSTANCE_CREATED = "instancecreated",
    INSTANCE_BINDED = "instancebinded",
    INSTANCE_INITIALISED = "instanceinitialised",

    OBJECT_DESTROYED = "objectremoved",
    OBJECT_DEACTIVATED = "objectdeactivated",
    OBJECT_ACTIVATED = "objectactivated",

    MINMAX_UPDATED = "minmaxevent",
    RANGE_UPDATED = "rangeevent",
    CURSOR_UPDATED = "cursorevent",
    OPACITY_UPDATED = "opacityevent",

    INSTANCE_DETAIL_EMITTED = "instancedetailemitted",

    READY = "ready",

    PALETTE_CHANGED = "palettechanged"

}

// Events registry

// Group initialised
type GroupInitDetail = { group: ThermalGroup }
export type GroupInitEvent = CustomEvent<GroupInitDetail>;


type ContainerLoadingDetail = {
    container: ThermalObjectContainer,
    state: ThermalContainerStates
}
export type ContainerLoadingEvent = CustomEvent<ContainerLoadingDetail>;

// Group loading
type GroupLoadingDetail = { group: ThermalGroup, loading: boolean }
export type GroupLoadingEvent = CustomEvent<GroupInitDetail>;

// Source registered
type SourceRegistered = { source: ThermalFileSource }
export type SourceREgisteredEvent = CustomEvent<SourceRegistered>;

// Instance created
type InstanceCreated = { instance: ThermalFileInstance, group: ThermalGroup }
export type InstanceCreatedEvent = CustomEvent<InstanceCreated>;

// Minmax event
type MinmaxUpdated = { minmax: ThermalMinmaxOrUndefined }
export type MinmaxEvent = CustomEvent<MinmaxUpdated>;

// Range event
type RangeUpdated = { range: ThermalRangeOrUndefined }
export type RangeEvent = CustomEvent<RangeUpdated>;

// Cursor event
type CursorUpdated = {
    cursorPosition: ThermalCursorPositionOrundefined,
    cursorValue?: number,
    isHover: boolean
}
export type CursorEvent = CustomEvent<CursorUpdated>


// Opacity event
type OpacityUpdated = { opacity: number }
export type OpacityEvent = CustomEvent<OpacityUpdated>;

// Cursor event
export type InstanceDetailEmittedDetail = {
    min: number,
    max: number,
    time: number,
    url: string,
    visibleUrl?: string,
    filename: string
}
export type InstanceDetailEmitted = CustomEvent<InstanceDetailEmittedDetail>


// Palette event
type PaletteChanges = {
    palette: ThermalPalette,
    slug: keyof typeof ThermalPalettes
}

export type PaletteEvent = CustomEvent<PaletteChanges>;

/** All thermal events need to be created through this factory */
export class ThermalEventsFactory {

    public static groupInit(
        group: ThermalGroup
    ) {
        return new CustomEvent<GroupInitDetail>(
            ThermalEvents.GROUP_INIT,
            {
                detail: {
                    group
                }
            }
        );
    }

    public static containerLoadingStateChanged(
        container: ThermalObjectContainer,
        state: ThermalContainerStates
    ): ContainerLoadingEvent {
        return new CustomEvent<ContainerLoadingDetail>(
            ThermalEvents.CONTAINER_LOADING_STATE_CHANGED,
            {
                detail: {
                    container,
                    state
                }
            }
        );
    }

    public static sourceRegistered(
        source: ThermalFileSource
    ) {
        return new CustomEvent<SourceRegistered>(
            ThermalEvents.SOURCE_REGISTERED,
            {
                detail: {
                    source
                }
            }
        );
    }

    public static instanceCreated(
        instance: ThermalFileInstance,
        group: ThermalGroup
    ) {
        return new CustomEvent<InstanceCreated>(
            ThermalEvents.INSTANCE_CREATED,
            {
                detail: {
                    instance,
                    group
                }
            }
        );
    }

    public static minmaxUpdated(
        minmax: ThermalMinmaxOrUndefined
    ) {
        return new CustomEvent<MinmaxUpdated>(
            ThermalEvents.MINMAX_UPDATED,
            {
                detail: {
                    minmax
                }
            }
        );
    }

    public static rangeUpdated(
        range: ThermalRangeOrUndefined
    ) {
        return new CustomEvent<RangeUpdated>(
            ThermalEvents.RANGE_UPDATED,
            {
                detail: {
                    range
                }
            }
        );
    }

    public static cursorUpdated(
        isHover: boolean,
        position: ThermalCursorPositionOrundefined,
        value: number | undefined,
    ) {
        return new CustomEvent<CursorUpdated>(
            ThermalEvents.CURSOR_UPDATED,
            {
                detail: {
                    cursorPosition: position,
                    cursorValue: value,
                    isHover
                }
            }
        );
    }

    public static opacityUpdated(opacity: number) {
        return new CustomEvent<OpacityUpdated>(
            ThermalEvents.OPACITY_UPDATED,
            {
                detail: {
                    opacity: opacity
                }
            }
        );
    }

    public static ready() {
        return new Event( ThermalEvents.READY )
    }

    public static destroyed() {
        return new Event( ThermalEvents.OBJECT_DESTROYED );
    }

    public static activated() {
        return new Event( ThermalEvents.OBJECT_ACTIVATED );
    }

    public static deactivated() {
        return new Event( ThermalEvents.OBJECT_DEACTIVATED );
    }

    public static emitInstanceDetail(
        instance: ThermalFileInstance
    ) {
        return new CustomEvent<InstanceDetailEmittedDetail>(
            ThermalEvents.INSTANCE_DETAIL_EMITTED,
            {
                detail: {
                    min: instance.min,
                    max: instance.max,
                    time: instance.timestamp,
                    url: instance.url,
                    visibleUrl: instance.visibleUrl,
                    filename: instance.url.substring( instance.url.lastIndexOf("/") + 1 )
                }
            }
        );
    }

    public static paletteChanged(
        activePalette: keyof typeof ThermalPalettes
    ) {
        return new CustomEvent<PaletteChanges>( ThermalEvents.PALETTE_CHANGED, {
            detail: {
                slug: activePalette,
                palette: ThermalPalettes[ activePalette ]
            }
        } );
    }

}