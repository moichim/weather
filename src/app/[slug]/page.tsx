import { Graphs } from '@/components/graphs/graphs';
import { SettingsContainer } from '@/components/settings/settingsContainer';
import { GoogleScope } from '@/graphql/google';
import { GoogleSheetsProvider } from '@/graphql/googleProvider/googleProvider';
import { ScopeHeader } from '@/state/scope/components/scopeHeader';
import { NextPage } from 'next';


export const generateStaticParams = async () => {

    const scopes = await GoogleSheetsProvider.getAllScopes();
    return scopes;


}

export const dynamicParams = false


export type ScopePageProps = {
    params: GoogleScope
};

const ScopePage: NextPage<ScopePageProps> = (props) => {

    return <>

        <div className="flex">

            {props.params.slug}

            <div className="w-full">

                <Graphs />

                <SettingsContainer />

            </div>

        </div>

    </>
}

export default ScopePage;
