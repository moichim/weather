import { ThermalImage } from "../instance/thermalImage"
import { ThermalGroupRange } from "./internal/thermalGroupRange"

export type ThermalGroupProps = {
    files: string[]
}

export const ThermalGroup: React.FC< ThermalGroupProps > = props => {
    return <>
    <ThermalGroupRange />
    <div style={{display:"flex", width: "100%", gap: "10px"}}>
        {props.files.map( file => <ThermalImage key={file} url={file}/> )}
    </div>
    </>
}
