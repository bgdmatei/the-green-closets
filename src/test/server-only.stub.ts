/**
 * Stand-in for the `server-only` marker package under test.
 *
 * That package resolves to an empty module under the `react-server` condition
 * and to a module that throws everywhere else — which is exactly its job in the
 * app, and exactly what breaks a test runner. Aliasing it here lets server
 * modules be unit-tested while the real guard still applies in the build.
 */
export {};
