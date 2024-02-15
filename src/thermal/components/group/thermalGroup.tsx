import { ThermalImage } from "../instance/thermalImage"
import { ThermalGroupRange } from "./internal/thermalGroupRange"

export type ThermalGroupProps = {
    files: string[]
}

export const ThermalGroup: React.FC<ThermalGroupProps> = props => {
    return <div className="p-4">
        <ThermalGroupRange />
        <div style={{ display: "flex", width: "100%", gap: "10px" }}>
            {props.files.map(file => <ThermalImage key={file} url={file} />)}
        </div>
    </div>
}
