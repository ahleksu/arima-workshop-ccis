import { mountArima, mountArimaUnavailable } from '../demos/arima';
import { mountArmaSim } from '../demos/armasim';
import { mountStationarity } from '../demos/stationarity';
import type { Demo } from '../demos/types';
import { loadSeries } from '../lib/series';
import { h } from '../ui';
import type { Page } from './page';

export type { Page } from './page';

export function demosPage(): Page {
  const mounted: Demo[] = [];
  let destroyed = false;

  const stationarity = mountStationarity();
  const armaSim = mountArmaSim();
  mounted.push(stationarity, armaSim);

  const arimaSlot = h('div', {}, h('p', { class: 'chart-message', role: 'status' }, 'Loading the weekly series.'));
  void loadSeries().then((result) => {
    if (destroyed) {
      return;
    }
    const demo = result.ok ? mountArima(result.series) : mountArimaUnavailable(result.message);
    mounted.push(demo);
    arimaSlot.replaceChildren(demo.root);
  });

  const root = h(
    'div',
    { class: 'page' },
    h('h1', { class: 'sign sign-demos' }, 'Demos'),
    h('p', { class: 'lead' }, 'Three tools that run in your browser. Move a control and the chart updates. Below each chart you can read a text summary of what it shows.'),
    stationarity.root,
    armaSim.root,
    arimaSlot,
  );
  return {
    root,
    destroy() {
      destroyed = true;
      for (const demo of mounted) {
        demo.destroy();
      }
    },
  };
}
