"use client";

import { Button, cn } from "@nextui-org/react";
import { useNotficationsContext } from "./useNotifications";
import { CloseIcon } from "@/components/ui/icons";

export const NotificationListing: React.FC = () => {

    const { notifications } = useNotficationsContext();

    if (notifications.length === 0) return <></>

    return <aside
        className="fixed bottom-0 right-0 w-full h-0 z-20"
    >

        <div className="absolute bottom-0 right-0 flex flex-col gap-3 items-end" style={{right: "5rem", bottom: "1rem"}} >

            {notifications.map(notification => {
                const Icon = notification.icon;
                    return <div className={cn([
                        "px-6 py-3 rounded-lg shadow-lg flex gap-3",
                        notification.classes
                    ])} key={notification.id}>
                        {Icon && <div><Icon /></div>}
                        <div>{notification.message}</div>
                        <div onClick={notification.onRemove} className="cursor-pointer">
                            <CloseIcon />
                        </div>
                    </div>
            })}

        </div>
    </aside>

}

