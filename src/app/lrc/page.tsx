import { ContextDebugger } from "@/thermal/components/ContextDebugger";
import { ThermalGroup } from "@/thermal/components/group/thermalGroup";
import { ThermalImage } from "@/thermal/components/instance/thermalImage";
import { ThermalContextProvider } from "@/thermal/context/thermalContext";
import { ThermalContextNewProvider } from "@/thermal/context/thermalContextNew";

export default async function Home() {

  return <div className="">
      <ThermalContextNewProvider>

      {/*
        <ThermalGroup files={[
          "/sample.lrc",
          "/sample2.lrc",
          "/sample3.lrc",
          "/sample4.lrc",
          "/sample5.lrc",
        ]} />
        */}

        <ContextDebugger />

      </ThermalContextNewProvider>

  </div>;

}
