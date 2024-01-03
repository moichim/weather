// import { Map } from "@/components/ui/map";
import { GoogleSheetsProvider } from "@/graphql/google/googleProvider/googleProvider";
import { ScopePageProps } from "../page";
import dynamic from "next/dynamic";

const Map = dynamic( () => import("../../../components/ui/map"), {ssr: false} );

export const generateStaticParams = async () => {

    const scopes = await GoogleSheetsProvider.getAllScopes();
    return scopes;

}

export const dynamicParams = true;


const InfoPage: React.FC<ScopePageProps> = async props => {

    const scope = await GoogleSheetsProvider.getScope(props.params.slug);

    return <div className="flex gap-3 w-full">

        <Map scope={scope} height="50rem" />

        <article className="w-1/2">

            <header>{scope.name}</header>

        </article>
    </div>
}

export default InfoPage;