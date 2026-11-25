// Applies the prepared zone work to the MDMS repo, one commit per run.
// Run from the MDMS repo root:
//   node ../MDMS-zone-staging/apply.mjs status   - plan with done/pending steps
//   node ../MDMS-zone-staging/apply.mjs next     - make the next commit
// It never pushes or merges: that stays manual (push, PR, merge, pull).
import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const STAGING = path.dirname(fileURLToPath(import.meta.url));
const FINAL = path.join(STAGING, "final");
const REPO = process.cwd();
const BASE = "Alex-branch";

// ---------- shell helpers ----------
// No shell: arguments go to the process as-is, nothing is parsed by cmd.exe.
function run(cmd, args, { quiet = false } = {}) {
  const r = spawnSync(cmd, args, { cwd: REPO, encoding: "utf8", stdio: quiet ? "pipe" : "inherit" });
  if (r.status !== 0) {
    if (quiet) process.stderr.write(r.stderr ?? "");
    throw new Error(`"${cmd} ${args.join(" ")}" failed`);
  }
  return (r.stdout ?? "").trim();
}
const git = (...args) => run("git", args, { quiet: true });
function fail(message) {
  console.error(`\n${message}`);
  process.exit(1);
}

// ---------- file helpers ----------
const fin = (p) => fs.readFileSync(path.join(FINAL, p), "utf8");
const put = (p, text) => {
  const full = path.join(REPO, p);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, text);
};
const copy = (...ps) => ps.forEach((p) => put(p, fin(p)));
const tidy = (t) => t.trimEnd() + "\n";

function cut(text, start, end) {
  const a = text.indexOf(start);
  if (a < 0) throw new Error(`start marker not found: ${start}`);
  const b = end === null ? text.length : text.indexOf(end, a + start.length);
  if (b < 0) throw new Error(`end marker not found: ${end}`);
  return text.slice(0, a) + text.slice(b);
}
const cuts = (text, pairs) => pairs.reduce((t, [s, e]) => cut(t, s, e), text);
function swap(text, from, to) {
  if (!text.includes(from)) throw new Error(`text not found: ${from}`);
  return text.replace(from, to);
}

// ---------- intermediate versions of files that grow over several commits ----------
const P = {
  css: "src/index.css",
  forms: "src/shared/components/forms/forms.css",
  feedback: "src/shared/components/feedback/feedback.css",
  ui: "src/shared/components/ui/ui.css",
  data: "src/shared/components/data/data.css",
  routes: "src/app/routes.tsx",
  zoneTypes: "src/features/zone/types/zone.ts",
  validation: "src/features/zone/utils/validation.ts",
  gen: "scripts/generate-db.mjs",
};

const indexCss = (level) => {
  // level 6 = final; block i is added at level i + 2
  const blocks = [
    ["/* Icon button */", "/* Dropdown menu"],
    ["/* Dropdown menu", "@media print {"],
    ["@media print {", null],
    [".detail-grid {", ".sr-only {"],
    ["/* Filter fields above", "/* Icon button */"],
  ];
  let t = fin(P.css);
  // Order matters: each cut's end marker must still be present when it runs.
  for (const i of [4, 3, 0, 1, 2]) if (level < i + 2) t = cut(t, ...blocks[i]);
  return tidy(t);
};

const formsCss = (level) => {
  // 1 base, 2 + hint/select, 3 + toggle, 4 + form-grid, 5 final (+unit)
  let t = fin(P.forms);
  if (level < 5) t = cut(t, "/* Unit shown", null);
  if (level < 4) t = cut(t, "/* Two fields side by side", "/* Select */");
  if (level < 3) t = cut(t, "/* Toggle */", null);
  if (level < 2) t = cuts(t, [[".field__hint {", ".field__adornment {"], ["/* Select */", null]]);
  return tidy(t);
};

const feedbackCss = (level) => {
  let t = fin(P.feedback);
  if (level < 3) t = cut(t, "/* Toast */", null);
  if (level < 2) t = cut(t, "/* Modal */", null);
  return tidy(t);
};

const uiCss1 = () => tidy(cuts(fin(P.ui), [["/* StatCard */", "/* PageHeader */"], ["/* Tabs */", null]]));

const dataCss = (level) => {
  let t = fin(P.data);
  if (level < 3) t = cut(t, "/* DataTable */", "/* Pagination */");
  if (level < 2) t = cut(t, "/* Pagination */", null);
  return tidy(t);
};

const zoneRoutePages = {
  meters: "MeterManagement",
  "meters/:meterId": "MeterDetails",
  users: "UserManagement",
  reports: "Reports",
  alerts: "Alerts",
  settings: "Settings",
};
const routes = (keep) => {
  let t = fin(P.routes);
  for (const [p, pageName] of Object.entries(zoneRoutePages)) {
    if (keep.includes(p)) continue;
    t = swap(
      t,
      `          {\n            path: "${p}",\n            ...page(() => import("../features/zone/pages/${pageName}")),\n          },\n`,
      "",
    );
  }
  return t;
};

const zoneTypes = (level) => {
  // 1 data types, 2 + meter form, 3 + customer form, 4 final
  let t = fin(P.zoneTypes);
  if (level < 4) t = cut(t, "export interface SettingsFormValues", null);
  if (level < 3) t = cut(t, "export interface CustomerFormValues", null);
  if (level < 2)
    t = cuts(t, [
      ['import type { TariffCategory } from "../../../shared/types/models";\n\n', "export interface ZoneSettings"],
      ["// Form values are kept as strings", null],
    ]);
  return tidy(t);
};

const validation = (level) => {
  // 1 meter, 2 + customer, 3 + date range, 4 final (+settings)
  let t = fin(P.validation);
  const twoTypes = 'import type { CustomerFormValues, MeterFormValues } from "../types/zone";';
  if (level < 4) {
    t = cut(t, "// Parses a numeric input", null);
    t = swap(t, 'import type { CustomerFormValues, MeterFormValues, SettingsFormValues } from "../types/zone";', twoTypes);
  }
  if (level < 3) t = cut(t, "export interface DateRangeErrors", null);
  if (level < 2) {
    t = cut(t, "export function validateCustomerForm", null);
    t = swap(t, twoTypes, 'import type { MeterFormValues } from "../types/zone";');
    t = cuts(t, [
      ["const EMAIL_RE", "const METER_ID_RE"],
      ["const NAME_RE", "\nconst today"],
    ]);
  }
  return tidy(t);
};

const APP_THEME_ONLY = `import { RouterProvider } from "react-router-dom";
import router from "./app/routes";
import ThemeProvider from "./shared/theme/ThemeProvider";

function App() {
  return (
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
export default App;
`;

const generateDb = () => run("node", ["scripts/generate-db.mjs"]);

// ---------- what each step writes ----------
const C = "src/shared/components";
const Z = "src/features/zone";
const steps = {
  fixcase: () =>
    git("mv", "src/features/auth/pages/ResetpasswordPage.tsx", "src/features/auth/pages/ResetPasswordPage.tsx"),

  data1: () => {
    let t = fin(P.gen);
    t = cut(t, "// ---------- zone alert settings", "// ---------- sample data from the Setup Guide");
    put(P.gen, t.split("  zoneSettings,\n").join(""));
    generateDb();
  },
  data2: () => {
    copy(P.gen);
    generateDb();
  },

  theme1: () => {
    put(P.css, indexCss(1));
    put(P.forms, formsCss(1));
  },
  theme2: () => {
    copy("src/shared/theme/theme-context.ts", "src/shared/theme/ThemeProvider.tsx", "index.html");
    put("src/App.tsx", APP_THEME_ONLY);
  },

  ui0: () => {
    for (const f of ["package.json", "package-lock.json"])
      put(f, fs.readFileSync(path.join(STAGING, "lockgen-lucide", f), "utf8"));
  },
  ui1: () => {
    copy(`${C}/ui/Button.tsx`, `${C}/ui/PageHeader.tsx`);
    put(P.ui, uiCss1());
  },
  ui2: () => {
    copy(`${C}/feedback/Loader.tsx`, `${C}/feedback/Skeleton.tsx`, `${C}/feedback/EmptyState.tsx`);
    put(P.feedback, feedbackCss(1));
  },
  ui3: () => copy(`${C}/ui/StatCard.tsx`, `${C}/ui/Tabs.tsx`, P.ui),
  ui4: () => {
    copy(`${C}/feedback/Modal.tsx`, `${C}/feedback/ConfirmDialog.tsx`);
    put(P.feedback, feedbackCss(2));
    put(P.css, indexCss(2));
  },
  ui5: () => copy(`${C}/feedback/toast-context.ts`, `${C}/feedback/ToastProvider.tsx`, P.feedback, "src/App.tsx"),

  fields1: () => {
    copy(`${C}/forms/Select.tsx`);
    put(P.forms, formsCss(2));
  },
  fields2: () => {
    copy(`${C}/forms/Toggle.tsx`);
    put(P.forms, formsCss(3));
  },

  api1: () => copy("src/shared/types/models.ts", "src/shared/types/api.ts"),
  api2: () => copy("src/services/query.ts"),
  api3: () => copy("src/shared/hooks/useApi.ts"),
  api4: () => copy("src/shared/utils/format.ts"),

  table1: () => {
    copy(`${C}/data/StatusBadge.tsx`);
    put(P.data, dataCss(1));
  },
  table2: () => {
    copy(`${C}/data/Pagination.tsx`);
    put(P.data, dataCss(2));
  },
  table3: () => {
    copy(`${C}/data/DataTable.tsx`, `${C}/data/RowActionsMenu.tsx`, P.data);
    put(P.css, indexCss(3));
  },
  table4: () => copy("src/shared/hooks/useDebouncedValue.ts", "src/shared/hooks/useTableState.ts"),

  charts1: () => copy("package.json", "package-lock.json"),
  charts2: () => copy(`${C}/charts/ChartCard.tsx`, `${C}/charts/TimeRangeToggle.tsx`, `${C}/charts/charts.css`),
  charts3: () => copy(`${C}/charts/chartTheme.ts`, `${C}/charts/ConsumptionChart.tsx`),

  layout1: () => copy("src/shared/layout/menuConfig.ts", "src/shared/session/demoAccounts.ts"),
  layout2: () =>
    copy(
      "src/shared/layout/Header.tsx",
      "src/shared/layout/Sidebar.tsx",
      "src/shared/layout/ProfileMenu.tsx",
      "src/shared/layout/layout.css",
    ),
  layout3: () => {
    copy("src/shared/layout/AppLayout.tsx");
    put(P.routes, routes([]));
    put(P.css, indexCss(4));
  },

  zsetup1: () => {
    copy(`${Z}/constants.ts`);
    put(P.zoneTypes, zoneTypes(1));
  },
  zsetup2: () =>
    copy(
      `${Z}/services/zoneService.ts`,
      `${Z}/services/meterService.ts`,
      `${Z}/services/customerService.ts`,
      `${Z}/services/alertService.ts`,
      `${Z}/hooks/useCurrentZone.ts`,
    ),
  zsetup3: () => copy(`${Z}/utils/consumption.ts`),

  zdash: () => copy(`${Z}/pages/ZoneDashboard.tsx`),

  zmeters1: () => copy(`${C}/meters/MeterTable.tsx`),
  zmeters2: () => copy("src/shared/hooks/useForm.ts"),
  zmeters3: () => {
    copy(`${Z}/components/MeterFormModal.tsx`, `${Z}/components/StatusChangeDialog.tsx`);
    put(P.validation, validation(1));
    put(P.zoneTypes, zoneTypes(2));
    put(P.forms, formsCss(4));
  },
  zmeters4: () => {
    copy(`${Z}/pages/MeterManagement.tsx`);
    put(P.routes, routes(["meters"]));
  },
  zmeters5: () => {
    copy(`${Z}/pages/MeterDetails.tsx`);
    put(P.routes, routes(["meters", "meters/:meterId"]));
    put(P.css, indexCss(5));
  },

  zusers1: () => {
    copy(`${Z}/components/CustomerFormModal.tsx`, `${Z}/components/CustomerDetailsModal.tsx`);
    put(P.validation, validation(2));
    put(P.zoneTypes, zoneTypes(3));
  },
  zusers2: () => {
    copy(`${Z}/pages/UserManagement.tsx`);
    put(P.routes, routes(["meters", "meters/:meterId", "users"]));
  },

  zreports: () => {
    copy(`${Z}/pages/Reports.tsx`);
    put(P.validation, validation(3));
    put(P.css, indexCss(6));
    put(P.routes, routes(["meters", "meters/:meterId", "users", "reports"]));
  },
  zalerts: () => {
    copy(`${Z}/pages/Alerts.tsx`);
    put(P.routes, routes(["meters", "meters/:meterId", "users", "reports", "alerts"]));
  },
  zsettings: () => copy(`${Z}/pages/Settings.tsx`, `${Z}/pages/zone.css`, P.validation, P.zoneTypes, P.forms, P.routes),
};

// ---------- the plan: branches in order, each with its commits ----------
const plan = [
  ["fix/reset-password-casing", [["fixcase", "fix ResetPasswordPage file name casing to match its import"]]],
  [
    "feature/zone-data",
    [
      ["data1", "add daily meter readings and zone daily consumption to the data generator"],
      ["data2", "add zone alert settings to the data generator"],
    ],
  ],
  [
    "feature/theme",
    [
      ["theme1", "add light and dark colour tokens and base styles"],
      ["theme2", "add ThemeProvider that remembers the chosen theme"],
    ],
  ],
  [
    "feature/ui-components",
    [
      ["ui0", "install lucide-react for icons"],
      ["ui1", "add Button and PageHeader components"],
      ["ui2", "add Loader, Skeleton and EmptyState"],
      ["ui3", "add StatCard and Tabs"],
      ["ui4", "add Modal and ConfirmDialog"],
      ["ui5", "add toast notifications"],
    ],
  ],
  [
    "feature/select-toggle-fields",
    [
      ["fields1", "add Select field with error message and compact filter mode"],
      ["fields2", "add Toggle switch field"],
    ],
  ],
  [
    "feature/api-layer",
    [
      ["api1", "add shared data model types and paginated response type"],
      ["api2", "add typed JSON Server query helpers for filters, sort, search and pagination"],
      ["api3", "add useApi hook for loading data with abort on change"],
      ["api4", "add date, number and error formatting helpers"],
    ],
  ],
  [
    "feature/data-table",
    [
      ["table1", "add StatusBadge"],
      ["table2", "add Pagination"],
      ["table3", "add generic DataTable with sorting, search, row actions and selection"],
      ["table4", "add useTableState hook with debounced search"],
    ],
  ],
  [
    "feature/charts",
    [
      ["charts1", "install recharts"],
      ["charts2", "add ChartCard and TimeRangeToggle"],
      ["charts3", "add ConsumptionChart with theme-aware chart styles"],
    ],
  ],
  [
    "feature/app-layout",
    [
      ["layout1", "add sidebar menu config per role and temporary demo accounts"],
      ["layout2", "add Header, Sidebar and ProfileMenu"],
      ["layout3", "add AppLayout and nest role pages under it"],
    ],
  ],
  [
    "feature/zone-setup",
    [
      ["zsetup1", "add zone data types and current zone constant"],
      ["zsetup2", "add zone services for zones, meters, customers and alerts"],
      ["zsetup3", "add consumption helpers for charts and summaries"],
    ],
  ],
  ["feature/zone-dashboard", [["zdash", "build zone dashboard with stat cards and week/month consumption chart"]]],
  [
    "feature/zone-meters",
    [
      ["zmeters1", "add shared MeterTable for zone and enterprise meter pages"],
      ["zmeters2", "add useForm hook"],
      ["zmeters3", "add meter form with validation and activate/deactivate confirmation"],
      ["zmeters4", "build zone meter management page"],
      ["zmeters5", "build meter details page with usage chart and readings"],
    ],
  ],
  [
    "feature/zone-users",
    [
      ["zusers1", "add customer details modal and add-customer form with validation"],
      ["zusers2", "build zone user management page"],
    ],
  ],
  ["feature/zone-reports", [["zreports", "build zone reports with date range, meter filter, trend chart and weekly summary"]]],
  ["feature/zone-alerts", [["zalerts", "build zone alerts table with severity and status filters"]]],
  ["feature/zone-settings", [["zsettings", "build zone settings form for alert thresholds and notification channels"]]],
];

const all = plan.flatMap(([branch, list], bi) => list.map(([id, msg]) => ({ id, msg, branch, bi })));

// A step is done when a commit with its message exists on any branch.
const committedMessages = () => new Set(git("log", "--all", "--format=%s").split("\n"));

function status() {
  const done = committedMessages();
  for (const [branch, list] of plan) {
    console.log(branch);
    for (const [, msg] of list) console.log(`  ${done.has(msg) ? "[x]" : "[ ]"} ${msg}`);
  }
  const left = all.filter((s) => !done.has(s.msg)).length;
  console.log(`\n${all.length - left} of ${all.length} commits done.`);
}

function next() {
  if (!fs.existsSync(path.join(REPO, "package.json")) || !fs.existsSync(path.join(REPO, ".git")))
    fail("Run this from the MDMS repo root.");

  const done = committedMessages();
  const idx = all.findIndex((s) => !done.has(s.msg));
  if (idx < 0) {
    console.log("Everything is committed.");
    return;
  }
  const s = all[idx];
  if (git("status", "--porcelain")) fail("Working tree has uncommitted changes. Commit or stash them first.");

  const current = git("branch", "--show-current");
  if (current !== s.branch) {
    if (git("branch", "--list", s.branch)) fail(`Branch ${s.branch} already exists. Switch to it: git switch ${s.branch}`);
    if (current !== BASE) fail(`New branches start from ${BASE}. Run: git switch ${BASE}  (and git pull if the PR was merged on GitHub)`);
    if (s.bi > 0) {
      const [prevBranch, prevList] = plan[s.bi - 1];
      const merged = new Set(git("log", BASE, "--format=%s").split("\n"));
      if (!merged.has(prevList.at(-1)[1]))
        fail(`${prevBranch} is not merged into ${BASE} yet. Merge it (PR on GitHub + git pull, or git merge --no-ff ${prevBranch}) first.`);
    }
    git("switch", "-c", s.branch);
    console.log(`Created branch ${s.branch} from ${BASE}.`);
  }

  steps[s.id]();
  git("add", "-A");
  console.log("Checking types and lint...");
  // Run the tools' JS entry points with this node binary instead of npx.cmd,
  // which on Windows could only be started through a shell.
  run(process.execPath, ["node_modules/typescript/bin/tsc", "-p", "tsconfig.app.json", "--noEmit"]);
  run(process.execPath, ["node_modules/eslint/bin/eslint.js", "src"]);
  git("commit", "-q", "-m", s.msg);
  console.log(`Committed on ${s.branch}: ${git("log", "--oneline", "-1")}`);

  const branchDone = idx === all.length - 1 || all[idx + 1].branch !== s.branch;
  if (branchDone)
    console.log(
      `\nBranch ${s.branch} is complete. Push it and open a PR into ${BASE}:\n` +
        `  git push -u origin ${s.branch}\n` +
        `After the PR is merged: git switch ${BASE} && git pull`,
    );
  else console.log(`Next on this branch: ${all[idx + 1].msg}`);
}

const command = process.argv[2];
if (command === "status") status();
else if (command === "next") next();
else console.log("Usage: node ../MDMS-zone-staging/apply.mjs status | next");
