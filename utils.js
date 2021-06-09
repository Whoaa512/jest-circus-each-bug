import { JSDOM } from 'jsdom';

const defaults = {
  html: '<!doctype html><html><head><meta charset="utf-8"></head><body></body></html>',
  url: 'http://localhost',
};

export function wrapWithDOM() {

  const globals = Object.getOwnPropertyDescriptors(global);
  let windowDescriptors;
  let windowDescriptorKeys;


  beforeEach(() => {
    return new Promise((resolve) => {
      const { html, ...restDefaults } = defaults;

      const dom = new JSDOM(html, restDefaults);

      const jsdomWindow = dom.window;

      windowDescriptors = Object.getOwnPropertyDescriptors(jsdomWindow);
      windowDescriptorKeys = Object.keys(windowDescriptors);
      windowDescriptorKeys.forEach((key) => {
        if (!global[key]) {
          global[key] = jsdomWindow[key];
        }
      });

      global.window = jsdomWindow;

      resolve();
    });
  });

  afterEach(() => {
    windowDescriptorKeys.forEach((key) => {
      delete global[key];
      // If deletion fails (jest), attempt to clean up manually.
      if (global[key] && !(key in globals)) {
        global[key] = undefined;
      }
    });
    Object.defineProperties(global, globals);
  });
}
