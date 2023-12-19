"use client"

import { Button } from "@nextui-org/react";
import { useMeteoContext } from "../meteoContext"
import { DataActions, DataActionsFactory } from "../reducerInternals/actions";

export const UseDataTest: React.FC = () => {

    const data = useMeteoContext();

    console.log("data", data);

    return <div>

        <Button
            onClick={() => data.dispatch(DataActionsFactory.setFilterString("2023-12-01", "2023-12-15"))}
        >SetDate</Button>

        <Button
            onClick={() => data.dispatch(DataActionsFactory.setFilterString("2023-11-01", "2023-11-15"))}
        >SetDate listopad</Button>

        <Button
            onClick={() => data.dispatch(DataActionsFactory.setRangeTimestamp(1699743600000, 1859583099999))}
        >SetRange</Button>

        <Button
            onClick={() => data.dispatch(DataActionsFactory.removeRange())}
        >Reset</Button>

        <Button
            onClick={data.refetch}
        >Refetch</Button>

    </div>
}