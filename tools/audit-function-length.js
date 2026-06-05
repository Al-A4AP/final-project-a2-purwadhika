const fs = require("fs");
const path = require("path");

const ROOT_DIR = path.resolve(__dirname, "..");
const MAX_LINES = 15;
const SOURCE_DIRS = ["backend/src", "backend/tests", "backend/prisma", "frontend/src"];
const IGNORE_DIRS = new Set(["node_modules", "dist", "build", "coverage", ".git"]);

const loadTypescript = () => {
  const candidates = [
    "typescript",
    path.join(ROOT_DIR, "frontend", "node_modules", "typescript"),
    path.join(ROOT_DIR, "backend", "node_modules", "typescript"),
  ];
  for (const candidate of candidates) {
    try {
      return require(candidate);
    } catch {
      // Try the next workspace dependency location.
    }
  }
  return null;
};

const ts = loadTypescript();

const walkFiles = (dir) => {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => collectEntryFiles(dir, entry));
};

const collectEntryFiles = (dir, entry) => {
  const fullPath = path.join(dir, entry.name);
  if (entry.isDirectory()) return IGNORE_DIRS.has(entry.name) ? [] : walkFiles(fullPath);
  return isSourceFile(entry.name) ? [fullPath] : [];
};

const isSourceFile = (name) =>
  [".ts", ".tsx", ".js", ".jsx"].includes(path.extname(name)) && !name.endsWith(".d.ts");

const getLineSpan = (sourceFile, node) => {
  const start = sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile));
  const end = sourceFile.getLineAndCharacterOfPosition(node.getEnd());
  return { line: start.line + 1, lines: end.line - start.line + 1 };
};

const getFunctionName = (node) => {
  if (node.name?.getText) return node.name.getText();
  const parent = node.parent;
  if (ts.isVariableDeclaration(parent)) return parent.name.getText();
  if (ts.isPropertyAssignment(parent)) return parent.name.getText();
  return null;
};

const isNamedFunctionNode = (node) =>
  ts.isFunctionDeclaration(node) ||
  ts.isMethodDeclaration(node) ||
  ts.isArrowFunction(node) ||
  ts.isFunctionExpression(node);

const getFunctionKind = (node) => ts.SyntaxKind[node.kind];

const collectCandidates = (sourceFile, filePath) => {
  const candidates = [];
  const visit = (node) => {
    if (isNamedFunctionNode(node)) addCandidate(candidates, sourceFile, filePath, node);
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);
  return candidates;
};

const addCandidate = (candidates, sourceFile, filePath, node) => {
  const name = getFunctionName(node);
  if (!name) return;
  const span = getLineSpan(sourceFile, node);
  if (span.lines <= MAX_LINES) return;
  candidates.push(buildCandidate(filePath, name, node, span));
};

const buildCandidate = (filePath, name, node, span) => ({
  path: path.relative(ROOT_DIR, filePath).replace(/\\/g, "/"),
  name,
  kind: getFunctionKind(node),
  line: span.line,
  lines: span.lines,
});

const analyzeFile = (filePath) => {
  const content = fs.readFileSync(filePath, "utf8");
  const kind = filePath.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS;
  const sourceFile = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest, true, kind);
  return collectCandidates(sourceFile, filePath);
};

const getAllSourceFiles = () =>
  SOURCE_DIRS.flatMap((dir) => walkFiles(path.join(ROOT_DIR, dir)));

const printReport = (candidates) => {
  console.log("Function Length Audit (advisory only)");
  console.log(`Max lines: ${MAX_LINES}`);
  console.log("This script always exits 0 and is not a build blocker.\n");
  printSummary(candidates);
  if (!candidates.length) return console.log("No named function candidates exceed the limit.");
  console.table(candidates.map(formatCandidate));
};

const printSummary = (candidates) => {
  console.log(`Candidates found: ${candidates.length}`);
  console.table(buildAreaSummary(candidates));
};

const buildAreaSummary = (candidates) => {
  const summary = candidates.reduce((acc, candidate) => {
    const area = getCandidateArea(candidate.path);
    acc[area] = (acc[area] || 0) + 1;
    return acc;
  }, {});
  return Object.entries(summary).map(([area, count]) => ({ area, count }));
};

const getCandidateArea = (filePath) =>
  SOURCE_DIRS.find((sourceDir) => filePath.startsWith(sourceDir)) || "other";

const formatCandidate = (candidate) => ({
  location: `${candidate.path}:${candidate.line}`,
  name: candidate.name,
  kind: candidate.kind,
  lines: candidate.lines,
});

const main = () => {
  if (!ts) return console.log("TypeScript package not found. Audit skipped.");
  const candidates = getAllSourceFiles().flatMap(analyzeFile).sort(sortCandidates);
  printReport(candidates);
};

const sortCandidates = (a, b) => b.lines - a.lines || a.path.localeCompare(b.path);

main();
