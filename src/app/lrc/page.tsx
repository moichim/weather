import { ProjectController } from "@/thermal/components/ProjectController";
import { RegistryContextProvider } from "@/thermal/context/RegistryContext";

export default async function Home() {

  return <div className="">

      <RegistryContextProvider>
          <ProjectController scope="ntc"/>
      </RegistryContextProvider>

  </div>;

}
