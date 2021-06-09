# jest-circus beforeEach/afterEach bug

Found this weird bug while migrating to jest-circus ahead of jest v27

I've added a minimal repro case, run `yarn test` to see the failing test

Move the `wrapWithDOM` function outside the describe block and the test passes
