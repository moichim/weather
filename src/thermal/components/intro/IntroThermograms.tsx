"use client";

import { CustomisedThermalFileRequest, ManualGroup } from "./ManualGroup";

const files: CustomisedThermalFileRequest[] = [
    {
        thermalUrl: "https://edu.labir.cz/meteo//ntc/c/image-thermal 2024-01-10 14-17-33.lrc",
        visibleUrl: "https://edu.labir.cz/meteo//ntc/c/image-visual 2024-01-10 14-17-33.png",
        className: "w-full"
    },
    {
        thermalUrl: "https://edu.labir.cz/meteo//ntc/b/image-thermal 2024-01-10 14-17-19.lrc",
        visibleUrl: "https://edu.labir.cz/meteo//ntc/b/image-visual 2024-01-10 14-17-19.png",
        className: "w-1/2"
    },
    {
        thermalUrl: "https://edu.labir.cz/meteo//ntc/a/image-thermal 2024-01-10 14-17-08.lrc",
        visibleUrl: "https://edu.labir.cz/meteo//ntc/a/image-visual 2024-01-10 14-17-08.png",
        className: "w-1/2"
    }
];



export const IntroThermograms: React.FC = () => {


    return <div className="w-full">

        <ManualGroup files={files} id={"intro"} />

    </div>

}