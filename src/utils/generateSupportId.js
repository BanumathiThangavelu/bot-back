export function generateSupportId(userId) {
  const timestamp = Date.now();
  return `SUP-${userId.slice(-4)}-${timestamp}`;
}
