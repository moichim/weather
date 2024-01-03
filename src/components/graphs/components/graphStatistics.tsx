"use client";

import { GraphInstanceState, graphInstanceHeights } from "@/state/graph/reducerInternals/storage";
import { Card, CardBody, ScrollShadow, Spinner, Tab, Tabs } from "@nextui-org/react";
import { useGraphInstanceMeteo } from "../utils/useGraphInstancData";
import { GraphTable } from "./ui/graphTable";
import { useEffect, useState } from "react";

export const GraphStatistics: React.FC<GraphInstanceState> = props => {

    const {
        viewStatistics,
        isLoadingData,
        rangeStatistics,
        isLoadingRange,
        selection,
        data
    } = useGraphInstanceMeteo(props.property.slug);

    const [selected, setSelected] = useState<string>("view");

    useEffect(() => {

        if (selection.hasRange === true && selected !== "range") {
            setSelected("range");
        }
        if (selection.hasRange === false && selected === "range") {
            setSelected("view");
        }

    }, [selection.hasRange]);

    if (isLoadingData) return <></>;
    if (!data) return <></>
    if (!("data" in data)) return <></>

    const disabled = rangeStatistics === undefined
        || (rangeStatistics === undefined && isLoadingRange);

    return <>
        <Tabs
            aria-label="Statistiky"
            selectedKey={selected}
            onSelectionChange={value => setSelected(value.toString())}
        >
            <Tab
                id={`graph${props.id}statiscicsView`}
                key="view"
                title="Zobrazený rozsah"
            >

                <Card>
                    <CardBody>
                        <ScrollShadow style={{ height: `${graphInstanceHeights[props.scale]-75}px` }} size={50}>
                            <GraphTable
                                statisticsData={viewStatistics}
                                property={props.property}
                            />
                        </ScrollShadow>
                    </CardBody>
                </Card>
            </Tab>

            <Tab
                id={`graph${props.id}statiscicsSelection`}
                key="range"
                title="Vybraný rozsah"
                disabled={disabled}
                className={disabled === true ? "cursor-not-allowed" : "cursor-pointer"}
            >
                <Card id={`${props.id}statistics`}>
                    <CardBody>
                    <ScrollShadow style={{ height: `${graphInstanceHeights[props.scale]-75}px` }} size={50}>
                        <div>
                            {rangeStatistics
                                ? <GraphTable
                                    statisticsData={rangeStatistics}
                                    property={props.property}
                                />
                                : <div className="flex w-full items-center justify-center min-h-[5rem]"><Spinner color="default" /></div>
                            }
                        </div>
                        </ScrollShadow>
                    </CardBody>
                </Card>
            </Tab>
            {props.property.description &&
                <Tab key="info" title="Info">
                    <Card>
                        <CardBody>
                            {props.property.description}
                        </CardBody>
                    </Card>
                </Tab>
            }
        </Tabs>

    </>

}