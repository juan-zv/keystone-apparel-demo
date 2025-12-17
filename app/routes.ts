import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/sales-register.tsx"),
  route("/sales-report", "routes/sales-report.tsx"),
  route("/presales", "routes/presales.tsx"),
] satisfies RouteConfig;
