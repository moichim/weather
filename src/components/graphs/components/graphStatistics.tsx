"use client";

import { GraphInstanceState } from "@/state/graph/reducerInternals/storage";
import { Card, CardBody, Spinner, Tab, Tabs } from "@nextui-org/react";
import { useGraphInstanceMeteo } from "../utils/useGraphInstancData";
import { GraphTable } from "./ui/graphTable";
import { useEffect, useState } from "react";

export const GraphStatistics: React.FC<GraphInstanceState> = props => {

    const {
        viewStatistics,
        isLoadingData,
        rangeStatistics,
        isLoadingRange,
        selection
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

    const disabled = rangeStatistics === undefined
        || (rangeStatistics === undefined && isLoadingRange);

    return <>
        <Tabs
            aria-label="Statistiky"
            selectedKey={selected}
            onSelectionChange={value => setSelected(value.toString())}
        >
            <Tab key="view" title="Zobrazený rozsah">
                <Card>
                    <CardBody>
                        <GraphTable
                            statisticsData={viewStatistics}
                            property={props.property}
                        />
                    </CardBody>
                </Card>
            </Tab>

            <Tab
                key="range"
                title="Vybraný rozsah"
                disabled={disabled}
                className={disabled === true ? "cursor-not-allowed" : "cursor-pointer"}
            >
                <Card>
                    <CardBody>
                        <div>
                            {rangeStatistics
                                ? <GraphTable
                                    statisticsData={rangeStatistics}
                                    property={props.property}
                                />
                                : <div className="flex w-full items-center justify-center min-h-[5rem]"><Spinner color="default" /></div>
                            }
                        </div>
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