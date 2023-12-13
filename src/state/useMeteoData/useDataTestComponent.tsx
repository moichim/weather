"use client"

import { Button } from "@nextui-org/react";
import { useMeteoContext } from "./meteoDataContext"
import { DataActions, DataActionsFactory } from "./reducerInternals/actions";

export const UseDataTesting: React.FC = () => {

    const data = useMeteoContext();

    console.log("data", data);

    return <div>

        <Button
            onClick={() => data.dispatch(DataActionsFactory.setFilterString("2023-11-04", "2023-10-12"))}
        >SetDate</Button>

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