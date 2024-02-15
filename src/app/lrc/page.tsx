import { ThermalGroup } from "@/thermal/components/group/thermalGroup";
import { ThermalImage } from "@/thermal/components/instance/thermalImage";
import { ThermalContextProvider } from "@/thermal/context/thermalContext";

export default async function Home() {
  
    return <div className="">
      <ThermalContextProvider>

        <ThermalGroup  files={[
          "/sample.lrc",
          "/sample2.lrc",
          "/sample3.lrc",
          "/sample4.lrc",
          "/sample5.lrc",
        ]} />
      
      </ThermalContextProvider>
  
    </div>;
  
  }