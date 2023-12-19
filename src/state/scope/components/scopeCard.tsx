"use client"

import { GoogleScope } from "@/graphql/google/google"
import { Button, Card, CardBody, CardFooter, CardHeader, Divider, Link } from "@nextui-org/react"
import { useRouter } from "next/navigation"

type ScopeCardProps = GoogleScope

export const ScopeCard: React.FC<ScopeCardProps> = props => {

    const router = useRouter();

    return <Card
        className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 text-white bg-foreground bg-opacity-50 data-[hover=true]:bg-foreground data-[hover=true]:bg-opacity-0"
        isBlurred
        // isFooterBlurred
        isPressable
        isHoverable
        onPress={ () => router.push( `/${props.slug}` ) }
        radius="lg"
    >
        <CardHeader>
            <div className="text-left">
                <p className="text-md">{props.name}</p>
                <p className="text-small text-gray-400">{props.team}</p>
            </div>
        </CardHeader>
        <Divider />
        <CardBody>
            {props.description}
        </CardBody>
        <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
            <Button className="text-tiny text-white bg-black/20" variant="flat" color="default" radius="lg" size="sm">
          Notify me
        </Button>


        </CardFooter>
    </Card>

}