declare module 'plotly.js-dist-min' {
  interface PlotlyLib {
    react(root: HTMLElement, data: unknown[], layout?: unknown, config?: unknown): Promise<unknown>;
    purge(root: HTMLElement): void;
  }
  const Plotly: PlotlyLib;
  export default Plotly;
}
