import { googleSheetsProvider } from "@/graphql/google/googleProvider/googleProvider";
import { ProjectController } from "@/thermal/components/ProjectController";
import { ScopePageProps } from "../layout";
import { getMetadataPublisher, getMetadataTitle } from "@/utils/metadata";
import { ResolvingMetadata, Metadata } from "next";

export const generateStaticParams = async () => {

  const scopes = await googleSheetsProvider.fetchAllScopesDefinitions();
  return scopes;

}

export async function generateMetadata(
  { params }: ScopePageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {


  const scope = await googleSheetsProvider.fetchScopeDefinition(params.slug);

  return {
      title: getMetadataTitle( scope.name + " 👀"),
      description: scope.description,
      publisher: getMetadataPublisher()
  }
}

const InfoPage = async ( props: ScopePageProps ) => {

  return <div className="">
    <ProjectController scope={props.params.slug
    } />
  </div>;

}

export default InfoPage;
