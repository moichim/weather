"use client";

import { WeatherEntryDataType } from '@/graphql/weather';
import { Properties } from '@/graphql/weatherSources/properties';
import { useDataContext } from '@/state/dataContext';
import { useGraphContext } from '@/state/graphContext';
import { LineChart, Line, CartesianGrid, XAxis, YAxis } from 'recharts';

const properties = Properties.index();

const Graph: React.FC = () => {

    const config = useGraphContext();
    const {weather} = useDataContext();

    const activeData = Object.entries( config.single.properties )
        .filter( ( [key, prop] ) => {
            return prop;
        } )
        .map( e => {
            const property = Properties.one( e[0] as unknown as any );

            return property;
        } );

    return <LineChart width={1200} height={800} data={weather}>

        {activeData.map(row =>{

            // const item = properties[row as keyof WeatherEntryDataType];
            // console.log(item)
            // const item = properties[row as any];
            // return <Line key={item?.field} type="monotone" dataKey={ item?.field } stroke={item!.color}/>
        })}

        <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
        <CartesianGrid stroke="red" />
        <XAxis dataKey="temperature" />
        <YAxis dataKey={"time"}/>
    </LineChart>
};

export default Graph;