import { Lrc } from "@/components/thermogram/lrc";
import { LrcContainer } from "@/components/thermogram/lrcContainer";
import { ThermalContextProvider } from "@/state/thermal/thermalContext";

export default async function Home() {
  
    return <div className="">
      <ThermalContextProvider>
      
        <LrcContainer url="http://localhost:3000/sample.lrc" />
        <LrcContainer url="http://localhost:3000/sample2.lrc" />
      
      </ThermalContextProvider>
  
    </div>;
  
  }