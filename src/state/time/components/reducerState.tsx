"use client";

import { TimeFormat } from "../reducerInternals/timeUtils/formatting";
import { useTimeContext } from "../timeContext";
import { FromControl } from "./fromControl";
import { ModificationModeSwitch } from "./modificationModeSwitch";
import { ToControl } from "./toControl";

export const ReducerState: React.FC = () => {

    const { timeState, timeDispatch } = useTimeContext();

    return <div>
        <ModificationModeSwitch />
        <FromControl />
        <ToControl />
        <div>DefaultFrom: {TimeFormat.humanDate(timeState.defaultFrom)}</div>
        <div>DefaultTo: {TimeFormat.humanDate(timeState.defaultTo)}</div>
        <div>From: {TimeFormat.humanDate(timeState.from)}</div>
        <div>To: {TimeFormat.humanDate(timeState.to)}</div>
        <div>MayLowerFrom: {timeState.mayLowerFrom ? "OK" : "NOK"}</div>
        <div>MayRiseFrom: {timeState.mayRiseFrom ? "OK" : "NOK"}</div>
        <div>MayLowerTo: {timeState.mayLowerTo ? "OK" : "NOK"}</div>
        <div>MayRiseTo: {timeState.mayRiseTo ? "OK" : "NOK"}</div>
    </div>

}
