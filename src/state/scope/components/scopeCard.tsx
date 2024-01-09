"use client"

import { GoogleScope } from "@/graphql/google/google"
import { Button, ButtonGroup, Card, CardBody, CardFooter, CardHeader, Divider, Link } from "@nextui-org/react"
import { useRouter } from "next/navigation"
import { useScopeContext } from "../scopeContext"
import { ScopeActions, ScopeActionsFactory } from "../reducerInternals/actions"

type ScopeCardProps = GoogleScope

export const ScopeCard: React.FC<ScopeCardProps> = props => {

    const router = useRouter();

    const { dispatch } = useScopeContext();

    return <Card
        className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 text-white bg-gradient-to-r from-primary-900 to-foreground bg-opacity-50 shadow-2xl shadow-primary-800 ring-2 ring-primary/50"
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
                    onClick={() => {
                        dispatch(ScopeActionsFactory.setActiveScope(props));
                        router.push(`/${props.slug}`)
                    }}>
                    Aktuální data
                </Button>
            </div>
        </CardFooter>
    </Card>

}