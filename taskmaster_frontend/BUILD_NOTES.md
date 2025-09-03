# Build Notes

If you see the following during `npm run build`:

Browserslist: browsers data (caniuse-lite) is 7 months old. Please run:
  npx update-browserslist-db@latest

This is a warning and does not break the build in CI. You can optionally update locally:
  npx update-browserslist-db@latest

Our CI ignores this informational notice as documented in taskmaster_frontend/README.md.
