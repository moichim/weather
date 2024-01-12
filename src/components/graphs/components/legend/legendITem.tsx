type LegendItemType = {
    name: string,
    color: string,
    in?: string,
    link?: string
}

export const LegendItem: React.FC<LegendItemType> = props => {
    return <li style={{color: props.color}}>{props.name} {props.link && <a href={props.link} target="_blank" rel="nofollow">info</a>}</li>
}