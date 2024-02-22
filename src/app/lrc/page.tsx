import { ContextDebugger } from "@/thermal/components/ContextDebugger";
import { ThermoContextProvider } from "@/thermal/context/thermoContext";

export default async function Home() {

  return <div className="">

      <ThermoContextProvider>
        <ContextDebugger />
      </ThermoContextProvider>

  </div>;

}
