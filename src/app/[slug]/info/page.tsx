// import { Map } from "@/components/ui/map";
import { GraphLegendColumns } from "@/components/graphs/components/legend/graphLegendColumns";
import { GraphLegendSources } from "@/components/graphs/components/legend/graphLegendSources";
import { googleSheetsProvider } from "@/graphql/google/googleProvider/googleProvider";
import dynamic from "next/dynamic";
import { ScopePageProps } from "../page";
import { getMetadataPublisher, getMetadataTitle } from "@/utils/metadata";
import { ResolvingMetadata, Metadata } from "next";

const Map = dynamic(() => import("../../../components/ui/map"), { ssr: false });

export const generateStaticParams = async () => {

    const scopes = await googleSheetsProvider.getAllScopes();
    return scopes;

}

export async function generateMetadata(
    { params }: ScopePageProps,
    parent: ResolvingMetadata
): Promise<Metadata> {


    const scope = await googleSheetsProvider.getScope(params.slug);

    return {
        title: getMetadataTitle("Informace o měření " + scope.name),
        description: scope.description,
        publisher: getMetadataPublisher()
    }
}

type RowProps = React.PropsWithChildren & {
    label: React.ReactNode
}

const Row: React.FC<RowProps> = props => {
    return <div className="mb-4">
        <h2 className="text-small text-gray-500">{props.label}</h2>
        <div>{props.children}</div>
    </div>
}

const Section: React.FC<React.PropsWithChildren> = props => {
    return <section
        className="w-full md:w-1/2 lg:w-1/4 px-10 py-4"
    >{props.children}</section>
}


const InfoPage: React.FC<ScopePageProps> = async props => {

    const scope = await googleSheetsProvider.getScope(props.params.slug);

    return <article className="w-full overflow-hidden">

        <header className="w-full hidden">

            <h1 className="text-xl font-bold pb-4">{scope.name}</h1>

        </header>

        <main className="flex flex-wrap -mx-10 -my-4">

            <Section>
                <Row label="Škola">{scope.name}</Row>
                <Row label="Tým">{scope.team}</Row>
                <Row label="Lokalita">{scope.locality}</Row>
                <Row label="Popis">{scope.description}</Row>
            </Section>

            <Section>
                <Map scope={scope} height="400px" />
            </Section>

            <Section>

                <h2>Tento tým se rozhodl měřit následující údaje:</h2>

                <GraphLegendColumns showDescription={true} />

            </Section>

            <Section>

                <h2 className="pb-4">Pro porovnání jsou k dispozici data z těchto zdrojů:</h2>

                <GraphLegendSources showDescription={true} />

            </Section>

        </main>

    </article>
}

export default InfoPage;