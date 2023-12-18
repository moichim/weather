import { GoogleScope } from "@/graphql/google";
import { GoogleSheetsProvider } from "@/graphql/googleProvider/googleProvider";
import { Card, CardBody, CardFooter, CardHeader, Divider } from "@nextui-org/react";
import Link from "next/link";

type ScopeCardProps = GoogleScope

const ScopeCard: React.FC<ScopeCardProps> = props => {

    return <Card
        className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4"
        isBlurred
    >
        <CardHeader>
            <div className="flex flex-col">
                <p className="text-md">{props.name}</p>
                <p className="text-small text-default-500">{props.team}</p>
            </div>
        </CardHeader>
        <Divider />
        <CardBody>
            {props.description}
        </CardBody>
        <CardFooter>
            <Link href={`/${props.slug}`}>{props.name}</Link>
        </CardFooter>
    </Card>

}


export const ScopeSelectScreen = async () => {

    const data = await GoogleSheetsProvider.getAllScopes();

    return <div className="flex wrap w-full gap-4">
        {data.map(scope => <ScopeCard {...scope} />)}
    </div>
}