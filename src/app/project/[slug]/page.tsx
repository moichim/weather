import { Bar } from '@/components/bar/bar';
import { Graphs } from '@/components/graphs/graphs';
import { googleSheetsProvider } from '@/graphql/google/googleProvider/googleProvider';
import { GraphContextProvider } from '@/state/graph/graphContext';
import { DisplayContextProvider } from '@/state/graph/useBarInternal';
import { MeteoContextProvider } from '@/state/meteo/meteoContext';
import { getMetadataPublisher, getMetadataTitle } from '@/utils/metadata';
import { Metadata, NextPage, ResolvingMetadata } from 'next';

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

    return <MeteoContextProvider scope={scope}>
        <GraphContextProvider>
            <DisplayContextProvider>
                <Graphs />
                <Bar />
            </DisplayContextProvider>
        </GraphContextProvider>
    </MeteoContextProvider>
}

export default ScopePage;
