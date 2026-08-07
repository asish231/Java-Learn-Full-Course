/**
 * problem-bank.js — curated, fully specified interview problems.
 *
 * Every entry contains a real statement, examples, constraints, hints, an
 * editorial, runnable starter code and machine-checkable test cases, so the
 * studio can grade a submission instead of only printing stdout.
 *
 * Entries live in ./bank/*.js and are merged here, keyed by LeetCode number.
 */
const fs = require('fs');
const path = require('path');

const BANK_DIR = path.join(__dirname, 'bank');

const bank = {};

if (fs.existsSync(BANK_DIR)) {
  for (const file of fs.readdirSync(BANK_DIR).sort()) {
    if (!file.endsWith('.js')) continue;
    try {
      const part = require(path.join(BANK_DIR, file));
      for (const problem of Array.isArray(part) ? part : Object.values(part)) {
        if (problem && problem.id != null) {
          bank[String(problem.id)] = { ...problem, sourceFile: file };
        }
      }
    } catch (err) {
      console.error(`[problem-bank] Skipping ${file}: ${err.message}`);
    }
  }
}

function getProblem(id) {
  return bank[String(id)] || null;
}

function hasProblem(id) {
  return Object.prototype.hasOwnProperty.call(bank, String(id));
}

function allProblems() {
  return Object.values(bank);
}

function byTopic(topic) {
  return allProblems().filter((p) => (p.topics || []).includes(topic));
}

module.exports = { bank, getProblem, hasProblem, allProblems, byTopic };
