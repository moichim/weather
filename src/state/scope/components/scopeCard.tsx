"use client"

import { GoogleScope } from "@/graphql/google/google"
import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Link } from "@nextui-org/react"
import { useRouter } from "next/navigation"
import { useScopeContext } from "../scopeContext"
import { ScopeActions, ScopeActionsFactory } from "../reducerInternals/actions"

type ScopeCardProps = GoogleScope

export const ScopeCard: React.FC<ScopeCardProps> = props => {

    const router = useRouter();

    const {dispatch} = useScopeContext();

    return <Card
        className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 text-white bg-foreground bg-opacity-50 data-[hover=true]:bg-foreground data-[hover=true]:bg-opacity-0"
        isBlurred
        isPressable
        isHoverable
        onPress={ () => {
            dispatch( ScopeActionsFactory.setActiveScope( props ) );
            router.push( `/${props.slug}` )
        } }
        radius="lg"
    >
        <CardHeader>
            <div className="text-left">
                <p className="text-lg">{props.name}</p>
                <p className="text-small text-gray-400">{props.team}</p>
            </div>
        </CardHeader>
        <Divider />
        <CardBody>
            {props.description}
        </CardBody>
        <Divider />
        <CardFooter>
            <div>Tlačítko</div>
        </CardFooter>
    </Card>

}