import { ThermalFileInstance } from "../file/ThermalFileInstance";
import { ThermalFileSource } from "../file/ThermalFileSource";
import { ThermalGroup } from "./ThermalGroup";
import { ThermalCursorPositionOrundefined, ThermalMinmaxOrUndefined, ThermalRangeOrUndefined } from "./interfaces";

export enum ThermalEvents {

    GROUP_INIT = "groupinit",

    GROUP_LOADING_START = "grouprequeststart",
    GROUP_LOADING_FINISH = "grouploadingfinish",

    SOURCE_REGISTERED = "sourceregistered",
    INSTANCE_CREATED = "instancecreated",

    MINMAX_UPDATED = "minmaxevent",
    RANGE_UPDATED = "rangeevent",
    CURSOR_UPDATED = "cursorevent",
    OPACITY_UPDATED = "opacityevent"

}

// Events registry

// Group initialised
type GroupInitDetail = { group: ThermalGroup }
export type GroupInitEvent = CustomEvent<GroupInitDetail>;

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

    public static groupLoadingStart(
        group: ThermalGroup
    ) {
        return new CustomEvent<GroupLoadingDetail>(
            ThermalEvents.GROUP_LOADING_START,
            {
                detail: {
                    group,
                    loading: true
                }
            }
        );
    }

    public static groupLoadingEnd(
        group: ThermalGroup
    ) {
        return new CustomEvent<GroupLoadingDetail>(
            ThermalEvents.GROUP_LOADING_FINISH,
            {
                detail: {
                    group,
                    loading: false
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

}

