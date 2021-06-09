/*
  Most of this code was stolen directly from
  https://github.com/rstacruz/mocha-jsdom/blob/master/index.js
  because it did not integrate well with jest-wrap.

  TODO(joe_lencioni): see if we can improve this now that we aren't confined
  to jest-wrap's weird API.
*/

import { JSDOM } from 'jsdom';

const defaults = {
  html: '<!doctype html><html><head><meta charset="utf-8"></head><body></body></html>',
  url: 'http://localhost',
};

export function wrapWithDOM() {

  const globals = Object.getOwnPropertyDescriptors(global);
  const originalGlobalsReference = {};
  for (const key in globals) {
    if (globals[key] !== undefined) {
      originalGlobalsReference[key] = global[key];
    }
  }
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
