import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface ProjectTypeChartProps {
  data: {
    name: string;
    value: number;
  }[];
}

const COLORS = ['#60A5FA', '#34D399', '#FBBF24', '#F87171'];

export function ProjectTypeChart({ data }: ProjectTypeChartProps) {
  return (
    <div className="rounded-xl bg-gradient-to-br from-blue-600/20 to-blue-900/20 p-6 backdrop-blur-lg border border-white/10">
      <h2 className="text-lg font-semibold mb-6 text-white">Projects by Type</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={COLORS[index % COLORS.length]}
                  stroke="rgba(255,255,255,0.1)"
                />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(15,23,42,0.9)', 
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '6px',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
                color: 'white'
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}