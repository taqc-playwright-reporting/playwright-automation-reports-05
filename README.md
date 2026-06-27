# Reporting & Debugging in Playwright

> **Мова / Language:** [Українська](#ua) · [English](#en)

---

<a id="ua"></a>

# 🇺🇦 Українська версія

## Мета

Навчитися конфігурувати вбудовані репортери Playwright, запускати тести зі збором артефактів, **самостійно аналізувати** причину падіння, перевіряти свій аналіз за допомогою AI-агента, виправляти помилку та підключати власний репортер.

---

## Передумови

- Встановлений Playwright (`@playwright/test`) і браузери:
  ```bash
  npx playwright install
  ```
- Базовий функціонал:
  - Існуючі тести і за бажанням можна доповнити власними.
  - Деякі тести свідомо зламані.

---

## Завдання 1 — Налаштувати репортери та запустити тести *(обов'язково)*

### 1.1 Конфігурація

Додати до `playwright.config.ts` секцію `reporter` і налаштування `trace` — кожен репортер під свій сценарій:

| Репортер | Сценарій використання |
|---|---|
| `list` | Локальна розробка — швидкий вивід у термінал |
| `html` | Перегляд і поширення з командою |
| `junit` (з `outputFile`) | CI-дашборди (Jenkins, GitHub Actions тощо) |

```ts
// playwright.config.ts — додайте ці поля всередину defineConfig({...})
reporter: [
  ['list'],
  ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ['junit', { outputFile: 'test-results/results.xml' }],
],
use: {
  // ... інші налаштування use, що вже є
  trace: 'retain-on-failure',
},
```

> `trace: 'retain-on-failure'` зберігає trace-файли лише для впалих тестів — саме вони потрібні для аналізу в розділах 1.3 і 1.4.

### 1.2 Запуск тестів

```bash
npx playwright test
```

### 1.3 Перегляд результатів

```bash
# Відкрити HTML-репорт у браузері
npx playwright show-report

# Відкрити trace впалого тесту (точний шлях — у HTML-репорті, клік на впалий тест → вкладка Traces)
npx playwright show-trace test-results/<describe-name>-<test-name>-chromium/trace.zip
```

> Шлях до `trace.zip` формується автоматично з назви describe і тесту, наприклад:
> `test-results/GreenCityHome-Page-Guest-Role-Footer-2-Follow-us-chromium/trace.zip`

### 1.4 Аналіз впалого тесту

Перед зверненням до агента або колег потрібно **самостійно** описати один впалий тест за схемою:

- **Що** впало — який саме assertion або локатор (з HTML-репорту).
- **Як** воно впало — послідовність дій і стан сторінки на момент падіння (з trace).
- **Чому** — ваша гіпотеза про справжню причину (root cause).

> Спочатку думаємо самі — потім звертаємось до агента. У цьому суть.

### Що здати

- [ ] Скриншот терміналу з результатом прогону.
- [ ] Файл `test-results/results.xml`.
- [ ] 3–4 речення: який репортер для якого сценарію і чому саме він.
- [ ] Власний аналіз впалого тесту за схемою вище.

### Мої відповіді — Завдання 1

**Вибір репортерів (3–4 речення):**

> _Вписати тут..._

**Аналіз впалого тесту:**

- **Що** впало:
- **Як** впало:
- **Чому** (root cause):

---

## Завдання 2 — Перевірити свій аналіз через AI-агента *(опційно)*

Запустити будь-який AI-агент (Claude Code, Cursor тощо) у проєкті й дати йому промпт нижче.

Промпт навмисно обмежує агента **лише аналізом** — без виправлень, без переписування коду, без пропозицій «давай зроблю». Мета — отримати другу думку про причину падіння, а не делегувати роботу.

### Промпт для агента *(скопіювати без змін)*

```
Analyze the failing Playwright test in this project. Open the HTML report and/or
the trace and determine the root cause of the failure.

Output ONLY an analysis with exactly three parts:
1. WHAT failed — the specific assertion or locator that failed.
2. HOW it failed — the sequence of actions and the page state at the moment of failure.
3. WHY it failed — the most likely root cause.

Strict constraints:
- Do NOT propose any fix, rewrite, or refactoring.
- Do NOT modify any file.
- Do NOT suggest improvements, best practices, or next steps.
- Do NOT run or re-run the tests.
Limit the answer to the three parts above and nothing else.
```

### Що здати

- [ ] Відповідь агента (скриншот або текст).
- [ ] **Порівняння з власним аналізом** (3–5 речень): у чому збіглися висновки, у чому розійшлися, чи знайшов агент щось, що ви пропустили (або навпаки).
- [ ] **Оцінка, чи дотримався агент обмежень**: чи дав він тільки аналіз, чи все ж зісковзнув у пропозиції/виправлення попри заборону в промпті.

> Уміння помітити, що агент порушив рамки промпту, — це частина навички роботи з AI-інструментами.

### Мої відповіді — Завдання 2

**Відповідь агента:**

> _Вставити текст або посилання на скриншот..._

**Порівняння з власним аналізом (3–5 речень):**

> _Вписати тут..._

**Оцінка дотримання обмежень:**

> _Вписати тут..._

---

## Завдання 3 — Виправити помилки *(обов'язково)*

На основі власного аналізу (Завдання 1) і, за бажанням, висновків агента (Завдання 2) виправити всі впалі тести.

### Що здати

- [ ] Diff або опис змін по кожному виправленому тесту (що саме було не так і як виправлено).
- [ ] Скриншот успішного прогону (усі тести green).
- [ ] 1–2 речення: чи збіглися реальні виправлення з вашими початковими гіпотезами про root cause.

### Мої відповіді — Завдання 3

**Що було не так і як виправлено:**

> _Вписати diff або опис по кожному тесту..._

**Чи збіглось з початковою гіпотезою:**

> _Вписати тут..._

---

## Завдання 4 — Додати власний репортер *(опційно)*

Реалізувати власний репортер — клас, що `implements Reporter`. Він має:

- На старті прогону вивести загальну кількість тестів.
- Рахувати `passed` / `failed` / `skipped` по ходу виконання.
- У кінці вивести підсумок і **список назв** впалих тестів.

### Підготовка

Створити директорію для репортера (якщо вона ще не існує):

```bash
mkdir reports
```

> **TypeScript-репортер напряму** підтримується Playwright v1.31+ без додаткових налаштувань. Якщо отримаєте помилку при підключенні `.ts`-файлу, скомпілюйте його через `tsc` і підключайте `.js`-версію.

### Скелет репортера

Скелет нижче дає сигнатури методів і типи імпортів — логіку треба дописати самостійно.

> **Підказки:**
> - Загальна кількість тестів — у документації [`Suite`](https://playwright.dev/docs/api/class-suite).
> - Статуси — `result.status` (`'passed' | 'failed' | 'timedOut' | 'skipped' | 'interrupted'`).
> - Назва тесту — `test.title`.

```ts
// reports/summary-reporter.ts
import type {
  Reporter, FullConfig, Suite, TestCase, TestResult, FullResult,
} from '@playwright/test/reporter';

class SummaryReporter implements Reporter {
  // TODO: поля для лічильників passed / skipped і масиву назв впалих тестів

  onBegin(config: FullConfig, suite: Suite) {
    // TODO: вивести, скільки всього тестів буде запущено
  }

  onTestEnd(test: TestCase, result: TestResult) {
    // TODO: залежно від result.status оновити лічильник
    //       або додати test.title до списку впалих
  }

  onEnd(result: FullResult) {
    // TODO: вивести підсумок (passed / failed / skipped)
    // TODO: якщо є впалі — вивести їхні назви
    // TODO: вивести загальний статус прогону (result.status)
  }
}

export default SummaryReporter;
```

### Підключення власного репортера

Додати **поряд** з іншими репортерами (а не замість):

```ts
// playwright.config.ts — додати останнім рядком у масив reporter
reporter: [
  ['list'],
  ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ['junit', { outputFile: 'test-results/results.xml' }],
  ['./reports/summary-reporter.ts'],
],
```

### Що здати

- [ ] Файл репортера (`reports/summary-reporter.ts`).
- [ ] Скриншот терміналу з його виводом.

---

## Підсумок: що здавати

| # | Артефакт | Завдання |
|---|---|---|
| 1 | Репозиторій: конфіг, тести, власний репортер | Усі |
| 2 | README з відповідями (вписати прямо в цей файл): вибір репортерів, аналіз падіння, порівняння з агентом, опис фіксу | 1, 2, 3 |
| 3 | Скриншот терміналу з результатом прогону тестів | 1 |
| 4 | Скриншоти HTML-репорту та Trace Viewer впалого тесту | 1 |
| 5 | Скриншот успішного прогону (всі тести green) | 3 |
| 6 | Скриншот терміналу з виводом власного репортера | 4 |
| 7 | Файл `test-results/results.xml` | 1 |

---

<a id="en"></a>

# 🇬🇧 English Version

## Goal

Learn to configure Playwright's built-in reporters, run tests with artifact collection, **independently analyze** the cause of a failure, validate your analysis using an AI agent, fix the bug, and plug in a custom reporter.

---

## Prerequisites

- Playwright (`@playwright/test`) and browsers installed:
  ```bash
  npx playwright install
  ```
- Base functionality:
  - Existing tests are provided; you may add your own.
  - Some tests are intentionally broken.

---

## Task 1 — Configure Reporters and Run Tests *(required)*

### 1.1 Configuration

Add a `reporter` section and a `trace` setting to `playwright.config.ts` — each reporter for its own scenario:

| Reporter | Use case |
|---|---|
| `list` | Local development — fast terminal output |
| `html` | Viewing and sharing with the team |
| `junit` (with `outputFile`) | CI dashboards (Jenkins, GitHub Actions, etc.) |

```ts
// playwright.config.ts — add these fields inside defineConfig({...})
reporter: [
  ['list'],
  ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ['junit', { outputFile: 'test-results/results.xml' }],
],
use: {
  // ... other use settings already present
  trace: 'retain-on-failure',
},
```

> `trace: 'retain-on-failure'` saves trace files only for failing tests — exactly what you need for the analysis in sections 1.3 and 1.4.

### 1.2 Running Tests

```bash
npx playwright test
```

### 1.3 Viewing Results

```bash
# Open the HTML report in the browser
npx playwright show-report

# Open the trace for a failing test (find the exact path in the HTML report: click the failing test → Traces tab)
npx playwright show-trace test-results/<describe-name>-<test-name>-chromium/trace.zip
```

> The path to `trace.zip` is generated automatically from the describe and test names, for example:
> `test-results/GreenCityHome-Page-Guest-Role-Footer-2-Follow-us-chromium/trace.zip`

### 1.4 Analyzing a Failing Test

Before asking an agent or a colleague, you must **independently** describe one failing test using this structure:

- **What** failed — the specific assertion or locator (from the HTML report).
- **How** it failed — the sequence of actions and the page state at the moment of failure (from the trace).
- **Why** — your hypothesis about the true root cause.

> Think for yourself first — then consult the agent. That is the whole point.

### What to Submit

- [ ] Terminal screenshot with the test run result.
- [ ] The `test-results/results.xml` file.
- [ ] 3–4 sentences: which reporter serves which scenario and why.
- [ ] Your own analysis of one failing test following the structure above.

### My Answers — Task 1

**Reporter choices (3–4 sentences):**

> _Write here..._

**Failing test analysis:**

- **What** failed:
- **How** it failed:
- **Why** (root cause):

---

## Task 2 — Validate Your Analysis with an AI Agent *(optional)*

Run any AI agent (Claude Code, Cursor, etc.) in the project and give it the prompt below.

The prompt intentionally restricts the agent to **analysis only** — no fixes, no rewrites, no "let me do it" offers. The goal is to get a second opinion on the failure cause, not to delegate the work.

### Agent Prompt *(copy without changes)*

```
Analyze the failing Playwright test in this project. Open the HTML report and/or
the trace and determine the root cause of the failure.

Output ONLY an analysis with exactly three parts:
1. WHAT failed — the specific assertion or locator that failed.
2. HOW it failed — the sequence of actions and the page state at the moment of failure.
3. WHY it failed — the most likely root cause.

Strict constraints:
- Do NOT propose any fix, rewrite, or refactoring.
- Do NOT modify any file.
- Do NOT suggest improvements, best practices, or next steps.
- Do NOT run or re-run the tests.
Limit the answer to the three parts above and nothing else.
```

### What to Submit

- [ ] The agent's response (screenshot or text).
- [ ] **Comparison with your own analysis** (3–5 sentences): where conclusions aligned, where they diverged, whether the agent found something you missed (or vice versa).
- [ ] **Assessment of whether the agent stayed within the constraints**: did it give only an analysis, or did it slip into suggestions/fixes despite the prompt restrictions?

> Noticing when an agent violates the boundaries of a prompt is itself a key AI tooling skill.

### My Answers — Task 2

**Agent's response:**

> _Paste text or link to screenshot here..._

**Comparison with my own analysis (3–5 sentences):**

> _Write here..._

**Assessment of constraint compliance:**

> _Write here..._

---

## Task 3 — Fix the Bugs *(required)*

Based on your own analysis (Task 1) and, optionally, the agent's conclusions (Task 2), fix all failing tests.

### What to Submit

- [ ] Diff or description of changes for each fixed test (what exactly was wrong and how it was fixed).
- [ ] Screenshot of a successful run (all tests green).
- [ ] 1–2 sentences: did the actual fixes match your initial root cause hypotheses?

### My Answers — Task 3

**What was wrong and how it was fixed:**

> _Write a diff or description for each test..._

**Did the fix match the initial hypothesis:**

> _Write here..._

---

## Task 4 — Add a Custom Reporter *(optional)*

Implement a custom reporter — a class that `implements Reporter`. It must:

- Print the total number of tests at the start of the run.
- Count `passed` / `failed` / `skipped` during execution.
- Print a summary and the **list of failed test names** at the end.

### Setup

Create the directory for the reporter file (if it does not exist yet):

```bash
mkdir reports
```

> **TypeScript reporters** are supported natively in Playwright v1.31+ without extra tooling. If you get an error loading the `.ts` file, compile it with `tsc` and reference the `.js` output instead.

### Reporter Skeleton

The skeleton below provides method signatures and import types — you must implement the logic yourself.

> **Hints:**
> - Total test count — see the [`Suite`](https://playwright.dev/docs/api/class-suite) API docs.
> - Statuses — `result.status` (`'passed' | 'failed' | 'timedOut' | 'skipped' | 'interrupted'`).
> - Test name — `test.title`.

```ts
// reports/summary-reporter.ts
import type {
  Reporter, FullConfig, Suite, TestCase, TestResult, FullResult,
} from '@playwright/test/reporter';

class SummaryReporter implements Reporter {
  // TODO: fields for passed / skipped counters and array of failed test names

  onBegin(config: FullConfig, suite: Suite) {
    // TODO: print how many tests will be run in total
  }

  onTestEnd(test: TestCase, result: TestResult) {
    // TODO: depending on result.status, update the counter
    //       or add test.title to the list of failed tests
  }

  onEnd(result: FullResult) {
    // TODO: print summary (passed / failed / skipped)
    // TODO: if there are failures — print their names
    // TODO: print the overall run status (result.status)
  }
}

export default SummaryReporter;
```

### Connecting the Custom Reporter

Add it **alongside** the other reporters (not instead of them):

```ts
// playwright.config.ts — add as the last entry in the reporter array
reporter: [
  ['list'],
  ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ['junit', { outputFile: 'test-results/results.xml' }],
  ['./reports/summary-reporter.ts'],
],
```

### What to Submit

- [ ] Reporter file (`reports/summary-reporter.ts`).
- [ ] Terminal screenshot showing its output.

---

## Deliverables Summary

| # | Artifact | Task |
|---|---|---|
| 1 | Repository: config, tests, custom reporter | All |
| 2 | README with answers (written directly in this file): reporter choices, failure analysis, agent comparison, fix description | 1, 2, 3 |
| 3 | Terminal screenshot with the test run result | 1 |
| 4 | Screenshots of the HTML report and Trace Viewer for the failing test | 1 |
| 5 | Screenshot of a successful run (all tests green) | 3 |
| 6 | Terminal screenshot showing the custom reporter output | 4 |
| 7 | `test-results/results.xml` file | 1 |
