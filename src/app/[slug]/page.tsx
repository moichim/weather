import { Bar } from '@/components/bar/bar';
import { Graphs } from '@/components/graphs/graphs';
import { googleSheetsProvider } from '@/graphql/google/googleProvider/googleProvider';
import { getMetadataPublisher, getMetadataTitle } from '@/utils/metadata';
import { Metadata, NextPage, ResolvingMetadata } from 'next';

export const generateStaticParams = async () => {

    const scopes = await googleSheetsProvider.getAllScopes();
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


    const scope = await googleSheetsProvider.getScope(params.slug);

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
