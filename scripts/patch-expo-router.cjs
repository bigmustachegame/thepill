/**
 * Expo Router (bundled RN) crashes on web when navigation state is missing
 * preloadedRoutes / preloadedRouteKeys / history during route-name changes.
 * Re-apply safe fallbacks after each install.
 */
const fs = require("fs");
const path = require("path");

const patches = [
  {
    file: "node_modules/expo-router/build/react-navigation/routers/TabRouter.js",
    from: "const preloadedRouteKeys = state.preloadedRouteKeys.filter((key) => routes.some((route) => route.key === key));",
    to: "const preloadedRouteKeys = (state.preloadedRouteKeys ?? []).filter((key) => routes.some((route) => route.key === key));",
  },
  {
    file: "node_modules/expo-router/build/react-navigation/routers/TabRouter.js",
    from: "let history = state.history.filter(",
    to: "let history = (state.history ?? []).filter(",
  },
  {
    file: "node_modules/expo-router/build/react-navigation/routers/StackRouter.js",
    from: "const preloadedRoutes = state.preloadedRoutes.filter((route) => routeNames.includes(route.name) && !routeKeyChanges.includes(route.name));",
    to: "const preloadedRoutes = (state.preloadedRoutes ?? []).filter((route) => routeNames.includes(route.name) && !routeKeyChanges.includes(route.name));",
  },
  {
    file: "node_modules/expo-router/build/layouts/StackClient.js",
    from: "preloadedRoutes: state.preloadedRoutes.filter((route) => routes[routes.length - 1].key !== route.key),",
    to: "preloadedRoutes: (state.preloadedRoutes ?? []).filter((route) => routes[routes.length - 1].key !== route.key),",
  },
];

let changed = 0;
for (const { file, from, to } of patches) {
  const full = path.join(process.cwd(), file);
  if (!fs.existsSync(full)) {
    console.warn(`[patch-expo-router] missing ${file}`);
    continue;
  }
  const src = fs.readFileSync(full, "utf8");
  if (src.includes(to)) continue;
  if (!src.includes(from)) {
    console.warn(`[patch-expo-router] pattern not found in ${file}`);
    continue;
  }
  fs.writeFileSync(full, src.replace(from, to));
  changed += 1;
}

if (changed) {
  console.log(`[patch-expo-router] applied ${changed} fix(es)`);
}
