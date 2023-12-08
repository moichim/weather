"use client";

import { AvailableWeatherProperties } from "@/graphql/weatherSources/properties";
import { Sources } from "@/graphql/weatherSources/source";
import { useGraphContext } from "@/state/graphStackContext";
import { StackActions } from "@/state/useGraphStack/actions";
import { GraphInstanceState } from "@/state/useGraphStack/storage";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@nextui-org/react";

const itemBargeDimension = 10;
const badgeWidth = Sources.all().length * itemBargeDimension;

export const GraphSelector: React.FC<GraphInstanceState> = props => {

    const {stack} = useGraphContext();

    return <Dropdown>
        <DropdownTrigger>
            <Button
                variant="light"
                className="bg-white shadow-xl"
                size="lg"
            >
                {props.property.name}
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
            </Button>
        </DropdownTrigger>
        <DropdownMenu
            aria-label="Přepnout vlastnost"
            onAction={(selection) => {
                stack.dispatch( StackActions.setInstanceProperty( props.property.slug, selection as AvailableWeatherProperties ) );
            }}
        >
            {stack.state.availableGraphs.map(prop => {
                return <DropdownItem key={prop.slug}>
                    <div className="flex w-full">
                        <div 
                            style={{width: badgeWidth + "px"}}
                            className="w-full flex items-center justify-center mr-4"
                        >
                            {prop.in.map( s => <div key={s} className="rounded-full" style={{
                                backgroundColor: Sources.one( s as any ).stroke,
                                width: itemBargeDimension + "px",
                                height: itemBargeDimension + "px"
                            }}></div> )}
                        </div>
                        <div>{prop.name}</div>
                    </div>
                </DropdownItem>
            })}
        </DropdownMenu>
    </Dropdown>;

}