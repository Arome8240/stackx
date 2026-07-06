'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AppointmentVolumeData {
  date: string;
  completed: number;
  confirmed: number;
  cancelled: number;
}

interface AppointmentVolumeChartProps {
  data: AppointmentVolumeData[];
}

export function AppointmentVolumeChart({ data }: AppointmentVolumeChartProps) {
  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis 
            dataKey="date" 
            stroke="#9CA3AF"
            style={{ fontSize: '12px' }}
          />
          <YAxis 
            stroke="#9CA3AF"
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1F2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#F3F4F6',
            }}
            labelStyle={{ color: '#F3F4F6' }}
          />
          <Legend 
            wrapperStyle={{ color: '#9CA3AF' }}
          />
          <Bar 
            dataKey="completed" 
            fill="#04704b"
            name="Completed"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="confirmed"
            fill="#1865ff"
            name="Confirmed"
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="cancelled" 
            fill="#EF4444" 
            name="Cancelled"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
