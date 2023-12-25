import { Graphs } from '@/components/graphs/graphs';
import { Bar } from '@/state/graph/components/bar/bar';
import { GoogleScope } from '@/graphql/google/google';
import { GoogleSheetsProvider } from '@/graphql/google/googleProvider/googleProvider';
import { ScopeHeader } from '@/state/scope/components/scopeHeader';
import { NextPage } from 'next';
import { useScopeContext } from '@/state/scope/scopeContext';
import { useEffect } from 'react';
import { ScopePageWrapper } from '@/state/scope/components/ScopePageWrapper';

export const generateStaticParams = async () => {

    const scopes = await GoogleSheetsProvider.getAllScopes();
    return scopes;

}

export const dynamicParams = true

const getScope = async (slug: string) => {
    return (await GoogleSheetsProvider.getAllScopes()).find(s => s.slug === slug)!
}

export type ScopePageProps = {
    params: {
        slug: string
    }
};

const ScopePage: NextPage<ScopePageProps> = async (props) => {

    const scope = await getScope( props.params.slug );

    return <>

        <div className="flex">

            <div className="w-full pt-20 bg-gray-200">

                <ScopePageWrapper scope={scope}>

                    <Graphs />

                    <Bar />

                </ScopePageWrapper>

            </div>

        </div>

    </>
}

export default ScopePage;
