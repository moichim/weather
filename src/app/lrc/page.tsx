import { ThermalGroup } from "@/thermal/components/group/thermalGroup";
import { ThermalImage } from "@/thermal/components/instance/thermalImage";
import { ThermalContextProvider } from "@/thermal/context/thermalContext";

export default async function Home() {
  
    return <div className="">
      <ThermalContextProvider>

        <ThermalGroup  files={[
          "http://localhost:3000/sample.lrc",
          "http://localhost:3000/sample2.lrc"
        ]} />
      
        <ThermalImage url="http://localhost:3000/sample.lrc" />
        <ThermalImage url="http://localhost:3000/sample2.lrc" originalSize={false}/>
      
      </ThermalContextProvider>
  
    </div>;
  
  }