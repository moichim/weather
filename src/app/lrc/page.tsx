import { ThermalGroup } from "@/thermal/components/group/thermalGroup";
import { ThermalImage } from "@/thermal/components/instance/thermalImage";
import { ThermalContextProvider } from "@/thermal/context/thermalContext";

export default async function Home() {
  
    return <div className="">
      <ThermalContextProvider>

        <ThermalGroup  files={[
          "https://localhost:3000/sample.lrc",
          "https://localhost:3000/sample2.lrc"
        ]} />
      
        <ThermalImage url="https://localhost:3000/sample.lrc" />
        <ThermalImage url="https://localhost:3000/sample2.lrc" originalSize={false}/>
      
      </ThermalContextProvider>
  
    </div>;
  
  }