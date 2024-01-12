import { GoogleSheetsProvider } from "@/graphql/google/googleProvider/googleProvider";
import { Skeleton } from "@nextui-org/react";
import dynamic from "next/dynamic";

const Map = dynamic( () => import("../ui/map"), {
    ssr: false,
    loading: () => <Skeleton className="h-[500px] w-full rounded-lg"/>
} );

export const ScopeMap = async () => {

    const data = await GoogleSheetsProvider.getAllScopes();

    return <Map scopes={data} height="500px" />


}