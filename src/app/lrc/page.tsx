import { ProjectController } from "@/thermal/registry/components/ProjectController";
import { RegistryContextProvider } from "@/thermal/registry/context/RegistryContext";

export default async function Home() {

  return <div className="">

      <RegistryContextProvider>
          <ProjectController scope="ntc"/>
      </RegistryContextProvider>

  </div>;

}
