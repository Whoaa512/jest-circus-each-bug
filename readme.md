# jest-circus beforeEach/afterEach bug

Found this weird bug while migrating to jest-circus ahead of jest v27

I've added a minimal repro case, run `yarn test` to see the failing test

Move the `wrapWithDOM` function outside the describe block and the test passes

Relevant jest issue: https://github.com/facebook/jest/issues/11552

## update

The root of this failure is actually due to react trying to access the `global.window` after it's cleaned up in the afterEach from `wrapWithDOM`.

I believe this bug actually lies in [enzyme's react 16 adapter due to how to tries to get references to the Lazy tags](https://github.com/enzymejs/enzyme/blob/f0460799c805fb936f91e8b1947ec46c3a825a3d/packages/enzyme-adapter-react-16/src/detectFiberTags.js#L18-L39).

I was able to workaround by wrapping the contents of my afterEach in a setTimeout so the cleanup happens after the React-dom access global.window
