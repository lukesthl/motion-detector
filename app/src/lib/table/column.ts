import type { SvelteComponent } from "svelte";

export interface IColumn<T = any> {
  title: string;
  render?: (source: T) => string;
  component?: typeof SvelteComponent;
  onClick?: (source: T) => void;
}
