"use client";

import { GraphInstanceState, graphInstanceHeights } from "@/state/graph/reducerInternals/storage";
import { Button, ScrollShadow, Skeleton, cn } from "@nextui-org/react";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useGraphInstanceMeteo } from "../utils/useGraphInstancData";
import { GraphTable } from "./ui/graphTable";
import { StatisticsButton } from "./ui/statisticsButton";
import { StatisticsContent } from "./ui/statisticsContent";

export const GraphStatistics: React.FC<GraphInstanceState> = props => {

    const {
        viewStatistics,
        isLoadingData,
        rangeStatistics,
        isLoadingRange,
        selection,
        data
    } = useGraphInstanceMeteo(props.property.slug);


    // Content switching

    const [activeView, setActiveView] = useState<string>("view");

    useEffect(() => {

        if (selection.hasRange === true && activeView !== "range") {
            setActiveView("range");
        }
        if (selection.hasRange === false && activeView === "range") {
            setActiveView("view");
        }

    }, [selection.hasRange]); // eslint-disable-line react-hooks/exhaustive-deps


    // Expanding

    const heightValue = useMemo(() => graphInstanceHeights[props.scale], [props.scale]);

    const [expanded, setExpanded] = useState(false);


    // Display prevention  this is ugly @todo

    if (isLoadingData) return <></>;
    if (!data) return <></>
    if (!("data" in data)) return <></>

    // Prepare the render

    const shouldShowViewStatistics = isLoadingData === false && viewStatistics !== undefined;
    const shouldShowRangeStatistics = rangeStatistics !== undefined
        || isLoadingRange;
    const shouldShowInfo = props.property.description;


    // Hack the TailwindCSS limitations - inability to select a peer based on two data attributes simultaneously
    const stl = `
        #${props.id}Shadow[data-expanded=false][data-bottom-scroll=false] ~ .shadow-peer {
            display: none;
        }
        #${props.id}Shadow[data-expanded=false][data-bottom-scroll=true] ~ .shadow-peer {
            height: 100%;
        }
    `;


    return <div data-expanded={expanded}>

        <style>{stl}</style>


        <div className="flex flex-wrap items-center gap-2 justify-center lg:justify-start pb-2 text-sm">
            <h3 className="opacity-70">Statistiky:</h3>
            {shouldShowViewStatistics && <StatisticsButton slug="view" activeTab={activeView} onClick={() => setActiveView("view")}>
                Pro zobrazený rozsah
            </StatisticsButton>}
            {shouldShowRangeStatistics && <><div className="opacity-70">/</div><StatisticsButton slug="range" activeTab={activeView} onClick={() => setActiveView("range")}>
                Pro zvýrazněný rozsah
            </StatisticsButton></>}

            {shouldShowInfo && <StatisticsButton slug="info" activeTab={activeView} onClick={() => setActiveView("info")}>
                Informace
            </StatisticsButton>}
        </div>

        <div id={`${props.id}Statistics`} className="relative">

            <ScrollShadow
                id={`${props.id}Shadow`}
                style={!expanded ? { height: `${heightValue - 70}px` } : undefined}
                hideScrollBar
                size={100}
                data-expanded={expanded}
                className="peer relative transition-all duration-300 ease-in-out"
            >

                {activeView === "view" && <StatisticsContent id={`${props.id}StatisticsView`}>
                    <GraphTable statisticsData={viewStatistics} property={props.property} primaryLabel={`${selection.fromHumanReadable} - ${selection.toHumanReadable}`} />
                </StatisticsContent>}

                {activeView === "range" && <StatisticsContent id={`${props.id}StatisticsRange`}>
                    {rangeStatistics !== undefined
                        ? <GraphTable statisticsData={rangeStatistics!} property={props.property} primaryLabel={`${selection.rangeMinHumanReadable} - ${selection.rangeMaxMumanReadable}`}/>
                        : <Skeleton className="h-30 rounded-xl bg-gray-500" />
                    }
                </StatisticsContent>}

                {activeView === "info" && <div>{props.property.description}</div>}

            </ScrollShadow>

            <div className="absolute w-full height-0 bottom-0 left-0 shadow-peer">

                <div className="absolute w-full text-center -bottom-4">
                    <Button
                        onClick={() => { setExpanded(!expanded) }}
                        isIconOnly
                        className={cn(
                            "shadow-2xl shadow-primary-900",
                            expanded ? "bg-gray-400" : "bg-white"
                        )}
                    >
                        {expanded === true
                            ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                            </svg>
                            : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                            </svg>
                        }
                    </Button>
                </div>
            </div>

        </div>

    </div>

}