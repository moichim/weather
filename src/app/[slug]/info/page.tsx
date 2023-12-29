import { Map } from "@/components/ui/map";
import { GoogleSheetsProvider } from "@/graphql/google/googleProvider/googleProvider";
import { notFound } from "next/navigation";
import { ScopePageProps } from "../page";

export const generateStaticParams = async () => {

    const scopes = await GoogleSheetsProvider.getAllScopes();
    return scopes;

}

export const dynamicParams = true;


const InfoPage: React.FC<ScopePageProps> = async props => {

    const scope = await GoogleSheetsProvider.getScope(props.params.slug);

    return <div className="flex gap-3 w-full">

        <section className="min-h-[50rem] w-1/2 rounded-xl overflow-hidden shadow-xl">
            <Map position={{lat: scope.lat, lng: scope.lon}} zoom={15}/>
        </section>
        <article className="w-1/2">

            <header>{scope.name}</header>

        </article>
    </div>
}

export default InfoPage;