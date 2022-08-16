
function getBaseString(seconds: number) {

  if (seconds <= 45) return 'a few seconds';

  if (seconds <= 90) return 'a minute';

  const minutes = Math.round(Math.abs(seconds / 60));

  if (minutes <= 45) return `${minutes} minutes`;

  if (minutes <= 90) return 'an hour';

  const hours = Math.round(Math.abs(minutes / 60));

  if (hours <= 22) return `${hours} hours`;

  if (hours <= 36) return 'a day';

  const days = Math.round(Math.abs(hours / 24));

  if (days <= 25) return `${days} days`;

  if (days <= 45) return 'a month';

  const months = Math.round(Math.abs(days / 30.416));

  if (days <= 345) return `${months} months`;

  if (days <= 545) return 'a year';

  const years = Math.round(Math.abs(days / 365));

  return `${years} years`;
}

export function secondsToTimeAgo(seconds: number, inFuture = false) {
  if (seconds <= 5) return 'now';

  const base = getBaseString(seconds);
  return inFuture ? `in ${base}` : `${base} ago`;
}
