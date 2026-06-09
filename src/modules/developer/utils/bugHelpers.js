// bugHelpers.js
import { PRIORITY_COLORS } from '../constants/priorities';
import { SEVERITY_COLORS }  from '../constants/severities';
import { STATUS_COLORS }    from '../constants/statuses';

export const getPriorityColor = (priority) => PRIORITY_COLORS[priority] || '#6b7280';
export const getSeverityColor = (severity) => SEVERITY_COLORS[severity]  || '#6b7280';
export const getStatusColor   = (status)   => STATUS_COLORS[status]      || '#6b7280';

export const timeAgo = (ts) => {
  const diff = Date.now() - new Date(ts).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1)  return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24)  return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

export const formatDate = (ts) => {
  if (!ts) return '—';
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

export const sortBugs = (bugs, field, dir) => {
  return [...bugs].sort((a, b) => {
    const aVal = a[field] || '';
    const bVal = b[field] || '';
    return dir === 'asc' ? String(aVal).localeCompare(String(bVal)) : String(bVal).localeCompare(String(aVal));
  });
};

export const filterBugs = (bugs, filters, search) => {
  let result = [...bugs];
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(b =>
      b.title?.toLowerCase().includes(q) ||
      b.description?.toLowerCase().includes(q) ||
      b.module?.toLowerCase().includes(q)
    );
  }
  if (filters.status)   result = result.filter(b => b.status   === filters.status);
  if (filters.priority) result = result.filter(b => b.priority === filters.priority);
  if (filters.severity) result = result.filter(b => b.severity === filters.severity);
  if (filters.module)   result = result.filter(b => b.module   === filters.module);
  return result;
};
