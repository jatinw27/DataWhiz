export function generateInsights(data) {
  if (!data || data.length === 0) return null;

  const keys = Object.keys(data[0]);
  const labelKey = keys[0];
  const valueKey = keys[1];

  const sorted = [...data].sort((a, b) => b[valueKey] - a[valueKey]);

  const top = sorted[0];
  const second = sorted[1];
  const lowest = sorted[sorted.length - 1];

  const values = sorted.map(d => d[valueKey]);
  const total = values.reduce((a, b) => a + b, 0);
  const avg = (total / values.length).toFixed(2);

  //  detect distribution type
  const max = Math.max(...values);
  const min = Math.min(...values);

  let distribution = "";
  if (max - min <= 2) {
    distribution = "fairly even";
  } else if (max > avg * 2) {
    distribution = "highly skewed";
  } else {
    distribution = "moderately distributed";
  }

  return `
Most ${labelKey.toLowerCase()}s are from ${top[labelKey]} (${top[valueKey]}).
${
  second
    ? `Second highest is ${second[labelKey]} (${second[valueKey]}).`
    : ""
}
Lowest is ${lowest[labelKey]} (${lowest[valueKey]}).
Average count is ${avg}.
Overall distribution is ${distribution}.
  `;
}