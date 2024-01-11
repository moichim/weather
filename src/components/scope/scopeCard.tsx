import { GoogleScope } from "@/graphql/google/google"
import { Button, Card, CardBody, CardFooter, CardHeader, Divider } from "@nextui-org/react"
import Link from "next/link"

type ScopeCardProps = GoogleScope

export const ScopeCard: React.FC<ScopeCardProps> = props => {

    return <Card
        className="w-full lg:w-1/2 xl:w-1/3 2xl:w-1/4 text-white bg-gradient-to-r from-primary-900 to-foreground bg-opacity-50 shadow-2xl shadow-primary-800 ring-2 ring-primary/50"
        isBlurred
        radius="lg"
    >
        <CardHeader>
            <div className="text-left p-4">
                <p className="text-lg font-bold">{props.name}</p>
                <p className="text-small opacity-30">{props.team}</p>
            </div>
        </CardHeader>
        <CardBody>
            <div className="text-left px-4">
                {props.description}
            </div>
        </CardBody>
        <Divider />
        <CardFooter>
            <div className="text-left px-4 pb-4 flex gap-3">
                <Button
                    variant="shadow"
                    color="primary"
                    as={Link}
                    href={`/${props.slug}`}
                >
                    Aktuální data
                </Button>
            </div>
        </CardFooter>
    </Card>

}