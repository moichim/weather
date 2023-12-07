"use client";

import { useDisplayContext } from "@/state/displayContext"
import { GraphGridInstance } from "../graphGrid/graphGridInstance";
import { GraphStackInstance } from "./graphStackInstance";
import { Toolbar } from "../ui/toolbar/toolbar";
import { useGraphStack } from "@/state/useGraphStack/useGraphStack";
import { Button } from "@nextui-org/react";
import { GraphActions, StackActions } from "@/state/useGraphStack/actions";

export const GraphStack: React.FC = () => {

    const setting = useDisplayContext();

    const reducer = useGraphStack();

    console.log(reducer.state);

    return <div className="w-full pb-10 relative bg-gray-100">

        <Button
            onClick={() => reducer.dispatch(StackActions.resetAll())}
        >Tlač</Button>

        <Button
            onClick={() => reducer.dispatch(StackActions.setHeights("2xl"))}
        >2xl</Button>

        <Button
            onClick={() => reducer.dispatch(StackActions.setInstanceHeight("temperature", "md"))}
        >sm</Button>

        <Button
            onClick={() => reducer.dispatch(StackActions.setInstanceProperty("temperature", "uv"))}
        >uv</Button>

        {setting.set.activeProps.map((prop, index) => <GraphStackInstance key={prop} prop={prop} index={index} />)}

        <Toolbar
            tool={setting.set.tool}
            setTool={setting.set.setTool}
            tools={setting.set.toolbar}
        />

    </div>

}