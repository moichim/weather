import { Graphs } from '@/components/graphs/graphs';
import { GoogleSheetsProvider } from '@/graphql/google/googleProvider/googleProvider';
import { Bar } from '@/state/graph/components/bar/bar';
import { NextPage } from 'next';

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

const ScopePage: NextPage<ScopePageProps> = async (props) => {


    return <>
        <Graphs />
        <Bar />
    </>
}

export default ScopePage;
