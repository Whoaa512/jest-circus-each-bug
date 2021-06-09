import { mount } from 'enzyme';
import React from 'react';
import configure from 'enzyme-adapter-react-helper';

import { wrapWithDOM } from './utils'
configure({ disableLifecycleMethods: true });


afterEach(async () => {
  const flush = new Promise((resolve) => setTimeout(resolve, 0))
  await flush;
});

// Ensure no window from jest
global.window = undefined;

// wrapWithDOM(); // This one passes
describe('render Foo', () => {
  wrapWithDOM(); // This one fails

  it('Foo', () => {
    const Foo = ({ children }) => <em>{children}</em>;
    const wrapper = mount(
      <div>
        Hello <Foo>world</Foo>
      </div>,
    );
    expect(wrapper.find(Foo)).toHaveLength(1);
  });
});
