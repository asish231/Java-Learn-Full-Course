#!/usr/bin/env node
/**
 * verify-bank.js — quality gate for the curated problem bank.
 *
 * For every problem it:
 *   1. validates the required fields are present,
 *   2. compiles `solutionCode` against the problem's own test cases and
 *      requires every case to pass,
 *   3. compiles `starterCode` to make sure the learner starts from code that
 *      at least builds (failing tests are expected and fine).
 *
 * Usage:
 *   node web/tools/verify-bank.js                       # verify everything
 *   node web/tools/verify-bank.js 1 121 200             # verify selected problem ids
 *   node web/tools/verify-bank.js --file bank-01-x.js   # verify a single bank file
 */
const { runTests } = require('../lib/judge');
const { allProblems, getProblem } = require('../data/problem-bank');

const REQUIRED = ['id', 'slug', 'title', 'difficulty', 'topics', 'statement',
  'examples', 'constraints', 'hints', 'approach', 'complexity', 'starterCode',
  'solutionCode', 'tests'];

function validateShape(problem) {
  const issues = [];
  for (const field of REQUIRED) {
    const value = problem[field];
    if (value == null || (Array.isArray(value) && value.length === 0)) {
      issues.push(`missing/empty field: ${field}`);
    }
  }
  if (!/^(Easy|Medium|Hard)$/.test(problem.difficulty || '')) issues.push('difficulty must be Easy|Medium|Hard');
  if ((problem.tests || []).length < 3) issues.push('needs at least 3 test cases');
  if (!/class\s+Solution\b/.test(problem.starterCode || '')) issues.push('starterCode must declare `class Solution`');
  if (!/class\s+Solution\b/.test(problem.solutionCode || '')) issues.push('solutionCode must declare `class Solution`');
  for (const example of problem.examples || []) {
    if (!example.input || !example.output) issues.push('every example needs input and output');
  }
  return issues;
}

async function main() {
  const args = process.argv.slice(2);
  const fileIndex = args.indexOf('--file');
  let problems;
  if (fileIndex !== -1) {
    const wanted = args[fileIndex + 1];
    problems = allProblems().filter((p) => p.sourceFile === wanted);
  } else if (args.length) {
    problems = args.map((id) => getProblem(id)).filter(Boolean);
  } else {
    problems = allProblems();
  }

  if (problems.length === 0) {
    console.error('No problems found to verify.');
    process.exit(1);
  }

  let failures = 0;
  problems.sort((a, b) => a.id - b.id);

  for (const problem of problems) {
    const label = `#${problem.id} ${problem.title}`;
    const issues = validateShape(problem);
    if (issues.length) {
      failures++;
      console.log(`✗ ${label}\n    ${issues.join('\n    ')}`);
      continue;
    }

    const graded = await runTests(problem.solutionCode, problem.tests, problem.testHelpers);
    if (graded.status !== 'Accepted') {
      failures++;
      console.log(`✗ ${label} — reference solution ${graded.status} (${graded.passed}/${graded.total})`);
      if (graded.error) console.log(`    ${String(graded.error).split('\n').slice(0, 6).join('\n    ')}`);
      for (const r of graded.results.filter((x) => !x.passed).slice(0, 3)) {
        console.log(`    case "${r.name}" input=${r.input}\n      expected: ${r.expected}\n      actual:   ${r.actual}${r.error ? `\n      error: ${r.error.split('\n')[0]}` : ''}`);
      }
      continue;
    }

    const starter = await runTests(problem.starterCode, problem.tests, problem.testHelpers);
    if (starter.status === 'Compilation Error') {
      failures++;
      console.log(`✗ ${label} — starterCode does not compile`);
      console.log(`    ${String(starter.error).split('\n').slice(0, 5).join('\n    ')}`);
      continue;
    }

    console.log(`✓ ${label} (${graded.total} cases, ${graded.elapsedMs}ms)`);
  }

  console.log(`\n${problems.length - failures}/${problems.length} problems verified.`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
