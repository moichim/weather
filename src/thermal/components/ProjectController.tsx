"use client";

import { Navbar } from "@/components/navigation/utils/Navbar";
import { Spinner } from "@nextui-org/react";
import { useProjectLoader } from "../context/useProjectLoader";
import { useRegistryListener } from "../context/useRegistryListener";
import { ThermalGroup } from "./ThermalGroup";
import { ThermalRangeInline } from "./controls/ThermalRangeInline";
import { OpacityScale } from "./registry/OpacityScale";

type ProjectControllerProps = {
    scope: string
}

/**
 * The master controller of a scope.
 * 
 * There may be more scopes. The parameter `scope` corresponds to values returned by `/graphql/google/googleProvider`
 */
export const ProjectController: React.FC<ProjectControllerProps> = props => {

    const { groups, loading } = useProjectLoader(props.scope);

    const listener = useRegistryListener();

    return <>

        <Navbar
            className="bg-slate-200"
            innerContent={listener.registry.range === undefined
                ? <div className="flex items-center gap-4 text-primary"><Spinner size="sm"/><span>Načítám a zpracovávám soubory</span></div>

                : <><ThermalRangeInline
                    object={listener.registry}
                    imposeInitialRange={listener.registry.range}
                    description="Klikněte na posuvník a změňte rozsah zobrazených teplot!" />
                    <div className="w-30 md:w-40 lg:w-60">
                        <OpacityScale />
                    </div>
                </>
                }
        />

        {(loading === true || listener.ready === false) &&
            <div className="text-center text-primary py-40" style={{ padding: "10rem 0rem" }}>
                <Spinner />
                <p>Načítám a zpracovávám soubory</p>
            </div>
        }

        <div className="flex flex-wrap">
            {Object.entries(groups).map(([groupId, definition]) => {
                return <ThermalGroup
                    key={groupId}
                    groupId={groupId}
                    name={definition.name}
                    description={definition.description}
                    files={definition.files}
                />
            })}
        </div>
    </>

}