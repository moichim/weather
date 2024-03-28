import { useRegistryContext } from "@/thermal/context/RegistryContext";
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, cn } from "@nextui-org/react";

export const PaletteControl: React.FC = () => {

    const {thermalPaletteSlug, thermalPalette, setThermalPalette, availableThermalPalettes} = useRegistryContext();

    return <Dropdown>
        <DropdownTrigger>
            <Button >
                <div className="flex gap-2 items-center w-60">

                    <div className={cn(
                        `thermal-scale-${thermalPaletteSlug}`,
                        "w-10 h-4 rounded-xl"
                    )}></div>
                    <div className="text-sm flex-grow">{thermalPalette.name}</div>


                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9" />
                    </svg>
                </div>
            </Button>
        </DropdownTrigger>
        <DropdownMenu
            onAction={key => {

                setThermalPalette(key)

            }}
        >
            {Object.entries(availableThermalPalettes).map(([key, palette]) => {
                return <DropdownItem
                    key={key}
                >
                    <div>
                        <div className="text-sm text-gray-500 pb-2">{palette.name}</div>
                        <div className={cn(
                            `thermal-scale-${key}`,
                            "w-full h-4 rounded-xl"
                        )}></div>
                    </div>
                </DropdownItem>
            })}
        </DropdownMenu>
    </Dropdown>

}