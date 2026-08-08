#!/usr/bin/env node
const fs = require('fs');
const os = require('os');
const path = require('path');
const { runFreeform, securityStatus } = require('../lib/judge');

let failures = 0;
function check(label, condition, detail = '') {
  console.log(`  ${condition ? '✓' : '✗'} ${label}${detail ? ` — ${detail}` : ''}`);
  if (!condition) failures++;
}

async function main() {
  console.log('Judge security boundaries');
  const status = securityStatus();
  check('JVM resource limits are declared', status.limits.heapMb === 128 && status.limits.processors === 1);

  const normal = await runFreeform('class Main { public static void main(String[] a) { System.out.println("ok"); } }');
  check('ordinary Java executes', normal.status === 'Success' && normal.stdout.trim() === 'ok', normal.error);

  if (process.platform === 'darwin') {
    check('macOS Seatbelt is active', status.seatbelt === true);
    const projectFile = path.join(__dirname, '..', 'package.json').replaceAll('\\', '\\\\');
    const outsideFile = path.join(os.tmpdir(), `dsa-security-escape-${process.pid}`);
    const attacks = [
      ['learner data and project reads are blocked', `System.out.println(java.nio.file.Files.readString(java.nio.file.Path.of("${projectFile}")));`],
      ['writes outside the run directory are blocked', `java.nio.file.Files.writeString(java.nio.file.Path.of("${outsideFile}"), "escape");`],
      ['network access is blocked', 'new java.net.Socket("example.com", 80);'],
      ['subprocess execution is blocked', 'new ProcessBuilder("/bin/sh", "-c", "echo escape").start().waitFor();']
    ];
    for (const [label, body] of attacks) {
      const out = await runFreeform(`class Main { public static void main(String[] a) throws Exception { ${body} } }`);
      check(label, out.status === 'Runtime Error');
    }
    check('blocked write created no artifact', !fs.existsSync(outsideFile));
  } else {
    console.log('  - Seatbelt attack probes skipped: this host is not macOS. JVM limits and private run directories remain active.');
  }

  if (failures) process.exit(1);
}

main().catch((err) => { console.error(err); process.exit(1); });