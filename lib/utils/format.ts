export function formatVND(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Math.round(amount));
}

export function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export function calcTimeAmount(startedAt: Date, endedAt: Date, hourlyRate: number): number {
  const ms = endedAt.getTime() - startedAt.getTime();
  const hours = ms / (1000 * 60 * 60);
  return Math.round(hours * hourlyRate);
}

export function calcCurrentAmount(startedAt: Date, hourlyRate: number): number {
  return calcTimeAmount(startedAt, new Date(), hourlyRate);
}
