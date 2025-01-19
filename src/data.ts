import { functionNames } from "./temp";

export type Node = {
  [key: string]: unknown;
  id: string;
  value?: number;
  color?: string;
  size?: number;
};

export type Link = {
  source: string;
  target: string;
  time?: string;
  width?: number;
  color?: string;
};

const randomIntFromInterval = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const colors = ["#88C6FF", "#FF99D2", "#2748A4"];

export const links: Link[] = functionNames.map((d) => ({
  source: d.source,
  target: d.target,
  color: colors[Math.floor(Math.random() * colors.length)],
  width: 1
  // date: new Date(d.time)
}));

export const nodes: Node[] = Array.from(
  new Set([
    ...functionNames.map((d) => d.source),
    ...functionNames.map((d) => d.target)
  ])
).map((id, i) => ({
  id,
  value: i % randomIntFromInterval(0, 100),
  size: 0.5
}));
