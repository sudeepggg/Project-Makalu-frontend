import type { LucideIcon } from "lucide-react";

export interface KPICardProps {
  title: string;
  value: string | number;
  sub?: string;
  Icon?: LucideIcon;
  accent?: 'green' | 'gold' | 'blue' | 'red';
}