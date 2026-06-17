export const formatTime12h = (timeStr) => {
  if (!timeStr) return "";
  console.log("Formatting time:", timeStr);
  const [hoursStr, minutesStr] = timeStr.split(":");
  let hours = parseInt(hoursStr, 10);
  const minutes = minutesStr;
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  const formattedHours = hours < 10 ? `0${hours}` : hours;
  return `${formattedHours}:${minutes} ${ampm}`;
};


const STATUS_STYLES = {
  active:    { bg: '#e6f6ec', color: '#15803d', dot: '#22c55e' },
  inactive:  { bg: '#fdeeee', color: '#b91c1c', dot: '#ef4444' },
  pending:   { bg: '#fff4e5', color: '#b45309', dot: '#f59e0b' },
  completed: { bg: '#e6f6ec', color: '#15803d', dot: '#22c55e' },
  rejected:  { bg: '#fdeeee', color: '#b91c1c', dot: '#ef4444' },
};

/**
 * @param {string}  status   - 'pending' | 'completed' | 'rejected' | 'active' | 'inactive'
 * @param {boolean|number} isActive - pass instead of status for active/inactive toggle (1 = active)
 */
export function StatusBadge({ status, isActive }) {
  const resolvedKey = status
    ? status.toLowerCase()
    : Number(isActive) === 1 ? 'active' : 'inactive';

  const style = STATUS_STYLES[resolvedKey] || STATUS_STYLES.pending;
  const label = resolvedKey.charAt(0).toUpperCase() + resolvedKey.slice(1);

  return (
    <span
      className="d-inline-flex align-items-center gap-2 rounded-pill px-3 py-1 fw-medium"
      style={{ background: style.bg, color: style.color, fontSize: '0.75rem' }}
    >
      <span
        className="rounded-circle"
        style={{ width: 6, height: 6, background: style.dot, display: 'inline-block' }}
      />
      {label}
    </span>
  );
}

// // With string status
// <StatusBadge status="pending" />
// <StatusBadge status="completed" />
// <StatusBadge status="rejected" />

// // With isActive (0 or 1)
// <StatusBadge isActive={1} />
// <StatusBadge isActive={user.is_active} />