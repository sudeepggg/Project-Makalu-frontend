export const currency = (n?: number) => `NPR ${Number(n || 0).toLocaleString()}`;
export const dateShort = (s?: string) => s ? new Date(s).toLocaleDateString() : '';