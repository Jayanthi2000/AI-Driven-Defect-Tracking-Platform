// statusHelpers.js
import { BUG_STATUS, STATUS_COLORS, STATUS_LABELS } from '../constants/statuses';

export const getStatusColor = (status) => STATUS_COLORS[status] || '#6b7280';
export const getStatusLabel = (status) => STATUS_LABELS[status] || status;

export const canStartProgress  = (status) => status === BUG_STATUS.ASSIGNED || status === BUG_STATUS.REOPENED;
export const canPauseProgress  = (status) => status === BUG_STATUS.IN_PROGRESS;
export const canMarkFixed      = (status) => status === BUG_STATUS.IN_PROGRESS;
export const canSendForTesting = (status) => status === BUG_STATUS.FIXED;

export const getNextStatus = (currentStatus) => {
  const flow = {
    [BUG_STATUS.ASSIGNED]:          BUG_STATUS.IN_PROGRESS,
    [BUG_STATUS.IN_PROGRESS]:       BUG_STATUS.FIXED,
    [BUG_STATUS.FIXED]:             BUG_STATUS.READY_FOR_TESTING,
    [BUG_STATUS.READY_FOR_TESTING]: BUG_STATUS.COMPLETED,
    [BUG_STATUS.REOPENED]:          BUG_STATUS.IN_PROGRESS,
  };
  return flow[currentStatus] || currentStatus;
};
