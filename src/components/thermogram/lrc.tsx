"use client";

import { useLrc } from "@/utils/reader/useLrc";

type LrcProps = {
    url: string
}

export const Lrc: React.FC<LrcProps> = props => {

    const file = useLrc( props.url );

    return <div>
        <h1>LRC Reader</h1>
        <div>Signatura: {file?.signature}</div>
        <div>Čas: {file?.timestamp}</div>
        <div>Verze: {file?.toString()}</div>
    </div>

}