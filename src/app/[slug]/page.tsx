import { Graphs } from '@/components/graphs/graphs';
import { GoogleSheetsProvider } from '@/graphql/google/googleProvider/googleProvider';
import { Bar } from '@/components/bar/bar';
import { Metadata, NextPage, ResolvingMetadata } from 'next';
import { getMetadataPublisher, getMetadataTitle } from '@/utils/metadata';

export const generateStaticParams = async () => {

    const scopes = await GoogleSheetsProvider.getAllScopes();
    return scopes;

}

export const dynamicParams = true


export type ScopePageProps = {
    params: {
        slug: string
    }
};


export async function generateMetadata(
    { params }: ScopePageProps,
    parent: ResolvingMetadata
): Promise<Metadata> {


    const scope = await GoogleSheetsProvider.getScope(params.slug);

    return {
        title: getMetadataTitle( scope.name ),
        description: scope.description,
        publisher: getMetadataPublisher()
    }
}

const ScopePage: NextPage<ScopePageProps> = async (props) => {
    return <>
        <Graphs />
        <Bar />
    </>
}

export default ScopePage;
