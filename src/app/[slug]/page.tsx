import { Graphs } from '@/components/graphs/graphs';
import { Bar } from '@/state/graph/components/bar/bar';
import { GoogleScope } from '@/graphql/google/google';
import { GoogleSheetsProvider } from '@/graphql/google/googleProvider/googleProvider';
import { ScopeHeader } from '@/state/scope/components/scopeHeader';
import { NextPage } from 'next';

export const generateStaticParams = async () => {

    const scopes = await GoogleSheetsProvider.getAllScopes();
    return scopes;

}

export const dynamicParams = true

const getScope = async ( slug: string ) => {
    return (await GoogleSheetsProvider.getAllScopes()).find( s => s.slug === slug )!
}

export type ScopePageProps = {
    params: {
        slug: string
    }
};

const ScopePage: NextPage<ScopePageProps> = async (props) => {

    const scope = await GoogleSheetsProvider.getScope( props.params.slug );

    return <>

        <div className="flex">

            <div className="w-full pt-20 bg-gray-200">

                <Graphs />

                <Bar />

            </div>

        </div>

    </>
}

export default ScopePage;
