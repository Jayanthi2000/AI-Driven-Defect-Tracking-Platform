import {
  AreaChart,
  Area,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { moduleData } from '../../data/dummyData';

function ModuleChart() {
  return (
    <div className='bg-[#161B22] border border-gray-800 rounded-2xl p-6 h-80'>
      <h3 className='text-xl font-semibold mb-6'>Module Issues</h3>

      <ResponsiveContainer width='100%' height='90%'>
        <AreaChart data={moduleData}>
          <XAxis dataKey='name' stroke='#9CA3AF' />
          <Tooltip />
          <Area type='monotone' dataKey='bugs' stroke='#10B981' fill='#10B981' />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default ModuleChart;