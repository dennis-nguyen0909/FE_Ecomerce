import useSelection from 'antd/es/table/hooks/useSelection';
import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import * as OrderService from '../../services/OrderService'
import { useQuery } from '@tanstack/react-query';


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};
export const PieChartsComponent = ({ orders }) => {

    const [stateCount, setStateCount] = useState({
        count: '',
        type: ''
    })
    const fetch = async () => {
        const res = await OrderService.getCountOrderByType();
        const newData = res?.response?.data.map((item) => ({
            count: item.count,
            type: item.type
        }));
        setStateCount(newData);
        return newData;
    }


    const query = useQuery({ queryKey: ['count'], queryFn: fetch })
    const { data: dataOrder } = query
    const data = dataOrder?.map((item) => ({
        name: item?.type,
        sales: item?.count,
    }));
    return (
        <BarChart width={1000} height={500} data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sales" fill="#8884d8" />
        </BarChart>
    )
}
