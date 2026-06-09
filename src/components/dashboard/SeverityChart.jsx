import {
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { severityData } from '../../data/dummyData';

function SeverityChart() {
  return (
    <div className='bg-[#161B22] border border-gray-800 rounded-2xl p-6 h-80'>
      <h3 className='text-xl font-semibold mb-6'>Severity Analysis</h3>

      <ResponsiveContainer width='100%' height='90%'>
        <PieChart>
          <Pie
            data={severityData}
            dataKey='value'
            outerRadius={90}
            fill='#10B981'
          />
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default SeverityChart;