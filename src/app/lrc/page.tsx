import { ContextDebugger } from "@/thermal/components/ContextDebugger";
import { ThermoContextProvider } from "@/thermal/context/thermoContext";
import { ProjectController } from "@/thermal/registry/components/ProjectController";
import { ThermalGroup } from "@/thermal/registry/components/ThermalGroup";
import { RegistryContextProvider } from "@/thermal/registry/context/RegistryContext";

export default async function Home() {

  return <div className="">

      <RegistryContextProvider>
          <ProjectController scope="ntc"/>
      </RegistryContextProvider>

  </div>;

}
