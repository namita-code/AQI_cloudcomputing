export function getAQIColor(aqi) {
  if (aqi <= 50) return '#00c853';
  if (aqi <= 100) return '#ffd600';
  if (aqi <= 150) return '#ff6d00';
  if (aqi <= 200) return '#d50000';
  if (aqi <= 300) return '#7b1fa2';
  return '#880e4f';
}

export function getAQICategory(aqi) {
  if (aqi <= 50) return 'Good';
  if (aqi <= 100) return 'Moderate';
  if (aqi <= 150) return 'Sensitive';
  if (aqi <= 200) return 'Unhealthy';
  if (aqi <= 300) return 'Very Unhealthy';
  return 'Hazardous';
}

export function getAQIEmoji(aqi) {
  if (aqi <= 50) return '🟢';
  if (aqi <= 100) return '🟡';
  if (aqi <= 150) return '🟠';
  if (aqi <= 200) return '🔴';
  if (aqi <= 300) return '🟣';
  return '⚫';
}

export function getHealthAdvice(aqi) {
  if (aqi <= 50) return 'Air quality is satisfactory. Enjoy outdoor activities.';
  if (aqi <= 100) return 'Acceptable air quality. Unusually sensitive people should limit outdoor activity.';
  if (aqi <= 150) return 'Sensitive groups should reduce outdoor activity. Others are fine.';
  if (aqi <= 200) return 'Everyone may begin to experience health effects. Limit outdoor exertion.';
  if (aqi <= 300) return 'Health alert! Everyone should avoid prolonged outdoor exertion.';
  return 'Health warning: Everyone should avoid all outdoor activity.';
}
