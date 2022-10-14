export function truncateText(text, maxLength) {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength)}…`;
}

export function randomNumber(n) {
  if (n <= 0) return -1;
  const random = Math.random() * n;
  return Math.round(random);
}
