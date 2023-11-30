"use client";

import { Properties } from "@/graphql/weatherSources/properties";
import { useDisplayContext } from "@/state/displayContext";
import { cn } from "@nextui-org/react";

const properties = Properties.all();

export const GraphSettings: React.FC = () => {

    const context = useDisplayContext();

    return <div>

        {properties.map(prop => {

            return <div key={prop.slug}>
                <div
                role="button"
                    className={cn(
                        "mb-2",
                        "ease-in-out duration-300 transition-all",
                        "flex items-center"
                    )}
                    onClick={() => context.single.setProperty(prop.slug, !context.single.properties[prop.slug])}
                >
                    <div className={cn(
                        "block p-2 rounded-full mr-5",
                        "ease-in-out duration-300 transition-all",
                        prop.color,
                        context.single.properties[prop.slug] !== true
                        && "bg-opacity-20"
                    )}>
                        {context.single.properties[prop.slug] === true
                            ? <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 opacity-50">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                            </svg>


                            : <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 opacity-50">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" clipRule="evenodd" />
                            </svg>
                        }
                    </div>
                    <div className={`ease-in-out duration-300 transition-all ${context.single.properties[prop.slug] !== true
                       ? "opacity-50" : "opacity-100"}`}>
                        {prop.name}
                    </div>
                </div>
            </div>

        })}

    </div>
}