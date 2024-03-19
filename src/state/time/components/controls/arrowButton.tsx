"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@/components/ui/icons";
import { Button, ButtonProps, cn } from "@nextui-org/react";

type ButtonArrowDirection = "left" | "right"; // | "up" | "down";

type ButtonArrowProps = ButtonProps & {
    direction?: ButtonArrowDirection,
    mayDo: boolean,
    onDo: () => void
}

export const ButtonArrow: React.FC< ButtonArrowProps > = ({
    direction,
    mayDo,
    onDo,
    className,
    ...props
}) => {

    const classes = cn(
        className,
        "transition-all duration-300 ease-in-out group-hover:border-primary-300 h-14 bg-white",
        direction === "left"
            ? "border-r-0 rounded-e-none"
            : "border-l-0 rounded-s-none",
        mayDo 
            ? "hover:bg-primary-300 hover:text-white"
            : "text-gray-400"
    );

    return <Button
        { ...props }
        onClick={ onDo }
        isIconOnly
        idDisabled={ mayDo === false }
        variant={ "bordered" }
        className={ classes }
    >
        {direction === "left"
            ? <ArrowLeftIcon />
            : <ArrowRightIcon />
        }
    </Button>

}