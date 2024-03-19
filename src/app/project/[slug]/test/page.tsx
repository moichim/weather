import { googleSheetsProvider } from "@/graphql/google/googleProvider/googleProvider";
import { DataDebugger } from "@/state/data/components/DataDebugger";
import { getMetadataPublisher, getMetadataTitle } from "@/utils/metadata";
import { Metadata, NextPage, ResolvingMetadata } from "next";

export const generateStaticParams = async () => {

    const scopes = await googleSheetsProvider.fetchAllScopesDefinitions();
    return scopes;

}

export type ScopePageProps = {
    params: {
        slug: string
    }
};

export async function generateMetadata(
    { params }: ScopePageProps,
    parent: ResolvingMetadata
): Promise<Metadata> {


    const scope = await googleSheetsProvider.fetchScopeDefinition(params.slug);

    return {
        title: getMetadataTitle(scope.name),
        description: scope.description,
        publisher: getMetadataPublisher()
    }
}


const ScopePage: NextPage<ScopePageProps> = async (props) => {

    const scope = await googleSheetsProvider.fetchScopeDefinition(props.params.slug);

    return <DataDebugger {...scope}/>
}

export default ScopePage;