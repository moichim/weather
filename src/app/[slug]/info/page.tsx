// import { Map } from "@/components/ui/map";
import { googleSheetsProvider } from "@/graphql/google/googleProvider/googleProvider";
import dynamic from "next/dynamic";
import { ScopePageProps } from "../page";

const Map = dynamic( () => import("../../../components/ui/map"), {ssr: false} );

export const generateStaticParams = async () => {

    const scopes = await googleSheetsProvider.getAllScopes();
    return scopes;

}


const InfoPage: React.FC<ScopePageProps> = async props => {

    const scope = await googleSheetsProvider.getScope(props.params.slug);

    return <div className="flex gap-3 w-full">

        <Map scope={scope} height="50rem" />

        <article className="w-1/2">

            <header>{scope.name}</header>

        </article>
    </div>
}

export default InfoPage;