const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

test.describe.configure({ mode: 'serial' });

async function expectNoSeriousA11yIssues(page) {
  const toast = page.locator('.toast');
  if (await toast.count()) await toast.last().waitFor({ state: 'detached', timeout: 6000 });
  const results = await new AxeBuilder({ page }).analyze();
  const violations = results.violations.filter((row) => ['critical', 'serious'].includes(row.impact));
  expect(violations, violations.map((row) => `${row.id}: ${row.help}`).join('\n')).toEqual([]);
}

test.beforeAll(async ({ request }) => {
  await request.post('/api/progress/reset');
});

test('onboarding creates a real learning path', async ({ page }) => {
  await page.goto('/#/');
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await dialog.getByRole('button', { name: /Crack interviews/ }).click();
  await dialog.getByRole('button', { name: /Continue/ }).click();
  await dialog.getByRole('button', { name: /New to Java/ }).click();
  await dialog.getByRole('button', { name: /Continue/ }).click();
  await dialog.getByRole('button', { name: /30 min a day/ }).click();
  await dialog.getByRole('button', { name: /Start learning/ }).click();
  await expect(dialog).toBeHidden();
  await expect(page.getByRole('heading', { name: 'Java DSA Studio' })).toBeVisible();
  await expectNoSeriousA11yIssues(page);
});

test('lesson checkpoint records retrieval without a fake completion', async ({ page }) => {
  await page.goto('/#/lesson/quickstart/ArrayAndListQuickstart');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Array And List Quickstart');
  const checkpoint = page.locator('.section-title', { hasText: 'Retrieval checkpoints' })
    .locator('xpath=following-sibling::*[1]').getByRole('button').first();
  await checkpoint.click();
  await expect(page.getByText(/^Correct\./)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Mark complete' })).toBeVisible();
  await expectNoSeriousA11yIssues(page);
});

test('workspace submits Java through private grading cases', async ({ page }) => {
  await page.goto('/#/problem/lc-1');
  await expect(page.getByRole('heading', { name: /Two Sum/ })).toBeVisible();
  await page.getByRole('textbox', { name: /code editor/i }).fill(
    'class Solution { int[] twoSum(int[] nums, int target) { java.util.Map<Integer,Integer> m=new java.util.HashMap<>(); for(int i=0;i<nums.length;i++){ int n=target-nums[i]; if(m.containsKey(n)) return new int[]{m.get(n),i}; m.put(nums[i],i); } return new int[0]; } }');
  await page.getByRole('button', { name: 'Submit', exact: true }).click();
  await expect(page.getByText('Accepted', { exact: true })).toBeVisible({ timeout: 30000 });
  await expectNoSeriousA11yIssues(page);
});

test('algorithm visualizer plays steps and synchronizes the editor line', async ({ page, request }) => {
  await request.post('/api/profile', { data: { onboardedAt: new Date().toISOString() } });
  await page.goto('/#/problem/lc-1');
  await page.getByRole('button', { name: /Tutor/ }).click();
  await page.evaluate(async () => {
    const { AlgorithmVisualizer } = await import('/js/algorithm-visualizer.js');
    const editor = document.querySelector('.code-editor').__codeEditor;
    editor.setValue('class Solution {\n  int[] twoSum(int[] nums, int target) { return new int[0]; }\n}');
    const visualizer = new AlgorithmVisualizer({
      visualization: {
        version: 1,
        category: 'arrays',
        title: 'Two pointers',
        steps: [
          { description: 'Start at both ends', line: 1, state: { values: [2, 7, 11], pointers: [{ label: 'L', index: 0 }, { label: 'R', index: 2 }] } },
          { description: 'Move the left pointer', line: 2, state: { values: [2, 7, 11], pointers: [{ label: 'L', index: 1 }, { label: 'R', index: 2 }] } }
        ]
      },
      onStep: (step) => editor.highlightExecutionLine(step.line)
    });
    document.querySelector('.tutor-msgs').append(visualizer.el);
  });

  await expect(page.getByRole('region', { name: 'Two pointers visualization' })).toBeVisible();
  await expect(page.getByText('Start at both ends')).toBeVisible();
  await page.getByRole('button', { name: 'Next step' }).click();
  await expect(page.getByText('Move the left pointer')).toBeVisible();
  await expect(page.locator('.ce-gutter [data-execution-line="true"]')).toHaveText('2');
  await expect(page.getByLabel('Playback speed')).toBeVisible();
  await expectNoSeriousA11yIssues(page);
});

test('diagnostic, insights, and tutor-off flows stay grounded', async ({ page }) => {
  await page.goto('/#/mock');
  await page.getByRole('button', { name: /Topic diagnostic/ }).click();
  await expect(page.getByRole('heading', { name: 'Assessment in progress' })).toBeVisible();
  await expect(page.getByText(/Private cases are graded/)).toBeVisible();

  await page.goto('/#/insights');
  await expect(page.getByText('Company topic readiness')).toBeVisible();
  await expect(page.getByText('Your next 7 days')).toBeVisible();
  await expectNoSeriousA11yIssues(page);

  await page.goto('/#/problem/lc-1');
  await page.getByRole('button', { name: /Tutor/ }).click();
  await expect(page.getByText(/Tutor is offline|not configured|unavailable/i).first()).toBeVisible();
});

test('placement hub records only real evidence and rubric results', async ({ page }) => {
  await page.goto('/#/placement');
  await expect(page.getByRole('heading', { name: 'Placement prep' })).toBeVisible();
  await expect(page.getByText('Preparation evidence, not hiring probability')).toBeVisible();
  await page.getByLabel('System design evidence rating').selectOption('3');
  await page.getByLabel('System design evidence note').fill('Explained an API and data model with trade-offs.');
  const designCard = page.getByText('System design', { exact: true }).locator('..').locator('..');
  await designCard.getByRole('button', { name: 'Record evidence' }).click();
  await expect(page.getByText('1/5').first()).toBeVisible();

  for (const label of ['Problem Framing', 'Technical Depth', 'Structure', 'Evidence', 'Reflection']) {
    await page.locator(`select[aria-label="${label}"]`).selectOption('3');
  }
  await page.getByRole('button', { name: 'Save simulation rubric' }).click();
  await expect(page.getByText(/1 interview simulations/)).toBeVisible();

  await page.getByLabel('Application company').fill('Example Co');
  await page.getByLabel('Application role').fill('Backend Engineer');
  await page.getByRole('button', { name: 'Add application' }).click();
  await expect(page.getByText('Example Co · Backend Engineer')).toBeVisible();
  await expectNoSeriousA11yIssues(page);
});

test('keyboard, responsive layout, visual baseline, and performance budgets', async ({ page }) => {
  await page.goto('/#/practice');
  const firstProblem = page.locator('.q-row').first();
  await firstProblem.focus();
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL(/#\/problem\//);

  for (const route of ['#/', '#/insights', '#/lesson/quickstart/ArrayAndListQuickstart']) {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/${route}`);
    const viewport = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth
    }));
    expect(viewport.scrollWidth, `${route}: ${JSON.stringify(viewport)}`).toBeLessThanOrEqual(viewport.clientWidth + 1);
  }

  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/#/insights');
  await expect(page).toHaveScreenshot('insights.png', { fullPage: true, animations: 'disabled' });

  const metrics = await page.evaluate(() => {
    const nav = performance.getEntriesByType('navigation')[0];
    const bytes = performance.getEntriesByType('resource').reduce((sum, row) => sum + (row.transferSize || 0), 0);
    return { domReadyMs: nav.domContentLoadedEventEnd - nav.startTime, transferredBytes: bytes };
  });
  expect(metrics.domReadyMs).toBeLessThan(2000);
  expect(metrics.transferredBytes).toBeLessThan(2 * 1024 * 1024);
});