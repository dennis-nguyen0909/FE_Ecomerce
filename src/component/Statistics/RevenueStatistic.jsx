import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import * as OrderService from '../../services/OrderService';

const RevenueStatistic = ({ accessToken }) => {
  const [revenue, setRevenue] = useState([]);

  const fetchRevenue = async () => {
    try {
      const res = await OrderService.getRevenueByMonth();
      setRevenue(res.response.data);
    } catch (error) {
      console.error("Failed to fetch revenue data:", error);
    }
  };

  useEffect(() => {
    fetchRevenue();
  }, []);

  return (
    <div style={{ margin: "20px 50px" }}>
      <h1>Thống kê doanh thu</h1>
      {revenue.length > 0 ? (
        <BarChart width={800} height={400} data={revenue} style={{width:"1000px"}}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          {revenue.map((data, index) => (
            <Bar key={`${data.year}-${data.month}`} dataKey="totalRevenue" name={`Tháng ${data.month} - ${data.year}`} fill={`#${Math.floor(Math.random()*16777215).toString(16)}`} />
          ))}
        </BarChart>
      ) : (
        <p>No data available for the selected years.</p>
      )}
    </div>
  );
};

export default RevenueStatistic;
