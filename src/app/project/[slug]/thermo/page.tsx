import { googleSheetsProvider } from "@/graphql/google/googleProvider/googleProvider";
import { ProjectController } from "@/thermal/components/ProjectController";
import { ScopePageProps } from "../page";

export const generateStaticParams = async () => {

  const scopes = await googleSheetsProvider.fetchAllScopesDefinitions();
  return scopes;

}

const InfoPage: React.FC<ScopePageProps> = async props => {

  return <div className="">
    <ProjectController scope={props.params.slug
    } />
  </div>;

}

export default InfoPage;
