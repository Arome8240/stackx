'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface TokenCirculationData {
  date: string;
  totalSupply: number;
  staked: number;
  circulating: number;
}

interface TokenCirculationChartProps {
  data: TokenCirculationData[];
}

export function TokenCirculationChart({ data }: TokenCirculationChartProps) {
  return (
    <div className="w-full h-[400px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorStaked" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="colorCirculating" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#10B981" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
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
          <Area
            type="monotone"
            dataKey="totalSupply"
            stroke="#3B82F6"
            fillOpacity={1}
            fill="url(#colorTotal)"
            name="Total Supply"
          />
          <Area
            type="monotone"
            dataKey="staked"
            stroke="#8B5CF6"
            fillOpacity={1}
            fill="url(#colorStaked)"
            name="Staked"
          />
          <Area
            type="monotone"
            dataKey="circulating"
            stroke="#10B981"
            fillOpacity={1}
            fill="url(#colorCirculating)"
            name="Circulating"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
