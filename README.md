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

## Завдання 1 — Налаштувати репортери та запустити тести _(обов'язково)_

### 1.1 Конфігурація

Додати до `playwright.config.ts` секцію `reporter` і налаштування `trace` — кожен репортер під свій сценарій:

| Репортер                 | Сценарій використання                        |
| ------------------------ | -------------------------------------------- |
| `list`                   | Локальна розробка — швидкий вивід у термінал |
| `html`                   | Перегляд і поширення з командою              |
| `junit` (з `outputFile`) | CI-дашборди (Jenkins, GitHub Actions тощо)   |

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

- **`list`** - використовую під час локальної розробки для швидкого й лаконічного відображення результатів прогону прямо в терміналі.
- **`html`** - ідеально підходить для детального розбору помилок та обміну результатами в команді завдяки інтерактивному звіту із вбудованими трейсами.
- **`junit`** - генерує XML-файл для інтеграції з CI/CD системами (GitHub Actions/Jenkins), де автоматично будується статистика успішності тестів.
- **`custom reporter`** (summary-reporter.ts) - власний репортер, що виводить компактний підсумок прогону (passed/skipped/failed) та список назв усіх впалих тестів прямо в консоль, без потреби гортати повні логи.

**Аналіз впалого тесту:**
#### Header › 3. should display correct logo

- **Що впало:**
  - Assertion `expect().toBeVisible()` завершився помилкою element(s) not found (таймаут 5000 ms) для локатора `getByAltText(/greencity-logo/i).first()`.
- **Як впало:**
  - Сторінка завантажилася повністю, і логотип візуально присутній на екрані (підтверджено Trace Viewer). Проте Playwright протягом 5 секунд безуспішно намагався знайти елемент за вказаним alt-текстом.
- **Чому (root cause):**
  - Помилка в локаторі (typo)
  - Регулярний вираз `/greencity-logo/i` шукав суцільний текст, тоді як реальний атрибут елемента на сторінці - `alt="Image green city logo"`.
  - `.first()` був доданий для обробки ситуації, коли локатор міг повертати кілька елементів.
  - Після виправлення тексту локатор став унікальним, тому `.first()` видалено.

**Додаткові спостереження:**

- Поточна реалізація:

```html
<a _ngcontent-ng-c3629200733="" role="none" routerlinkactive="active-link" tabindex="0" class="header_logo active-link" href="#/greenCity">
<img _ngcontent-ng-c3629200733="" role="link" alt="Image green city logo" src="assets/img/logo.svg">
</a>
```

- Пропозиція:

  - У поточній реалізації <img> має role="link", хоча інтерактивним елементом є <a>.
  - Доцільніше залишити семантику за замовчуванням: <a> як посилання, <img> як зображення, при цьому прибравши role="none" з <a>.
  - Це покращить accessibility та коректну роботу скрінрідерів.

---

## Завдання 2 — Перевірити свій аналіз через AI-агента _(опційно)_

Запустити будь-який AI-агент (Claude Code, Cursor тощо) у проєкті й дати йому промпт нижче.

Промпт навмисно обмежує агента **лише аналізом** — без виправлень, без переписування коду, без пропозицій «давай зроблю». Мета — отримати другу думку про причину падіння, а не делегувати роботу.

### Промпт для агента _(скопіювати без змін)_

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

**Відповідь агента**

На прикладі тесту - **Header › 3. should display correct logo**

1. **WHAT** failed:

  - `expect(page.getByAltText(/greencity-logo/i).first()).toBeVisible()` - element not found

2. **HOW** it failed:

  - Page has a link `"Image green city logo"` in the banner; no element with alt text matching `/greencity-logo/i`.

3. **WHY** it failed:

  - Wrong or mistyped selector: `/greencity-logo/i` vs alt `"Image green city logo"`;

**Порівняння з власним аналізом (3–5 речень):**
  - Аналіз агента збігається з моїм у частині root cause.
  - Агент діяв строго в межах заданого промпту, тому обмежився лише безпосередньою причиною без додаткового контексту.
  - Мій аналіз ширший, оскільки включає розгляд .first() та додаткові спостереження щодо accessibility HTML.
  - Таким чином, агент дав більш вузький, але формально коректний аналіз, тоді як мій - більш детальний.

**Оцінка дотримання обмежень:**
  - Агент дотримався усіх встановлених обмежень промпту.
  - Він надав відповідь строго за структурою (WHAT, HOW, WHY).
  - Не запропонував жодного рядка виправленого коду, не намагався рефакторити файли чи запускати тести знову.

---

## Завдання 3 — Виправити помилки _(обов'язково)_

На основі власного аналізу (Завдання 1) і, за бажанням, висновків агента (Завдання 2) виправити всі впалі тести.

### Що здати

- [ ] Diff або опис змін по кожному виправленому тесту (що саме було не так і як виправлено).
- [ ] Скриншот успішного прогону (усі тести green).
- [ ] 1–2 речення: чи збіглися реальні виправлення з вашими початковими гіпотезами про root cause.

### Мої відповіді — Завдання 3

#### Header › 3. should display correct logo

- **Опис змін:** Виправлено регулярний вираз у `getByAltText` відповідно до реального `alt` атрибута елемента та видалено надлишковий метод `.first()`.

- **Чи збіглось з початковою гіпотезою:** Так, первинна гіпотеза повністю підтвердилася. Причиною падіння була невідповідність тексту в локаторі реальному `alt` атрибуту елемента.

---

#### Header › 7. should display login button

- **Опис змін:** Змінено роль у локаторі з прихованого посилання (link) на видиму картинку-іконку (img), яка фактично відображається на сторінці.

- **Чи збіглось з початковою гіпотезою:** Так, гіпотеза підтвердилася: тест намагався взаємодіяти з прихованим CSS-елементом, а зміна на видимий тег <img> вирішила проблему.

---

#### Header › 10. should home page has search input

- **Опис змін:** Додано крок `click()` на іконку пошуку перед перевіркою placeholder, щоб відкрити динамічне поле пошуку.

- **Чи збіглось з початковою гіпотезою:** Так, первинна гіпотеза повністю підтвердилася. Після додавання кроку взаємодії (.click()) для відкриття поля пошуку, тест пройшов успішно.

---

#### Main Content Section › 1. should display home page text

- **Опис змін:** Оновлено текст заголовка у локаторі відповідно до актуального тексту на сторінці.

- **Чи збіглось з початковою гіпотезою:** Так, первинна гіпотеза повністю підтвердилася. Причиною падіння була зміна тексту заголовка на сторінці.

---

#### Main Content Section › 4. Newsletter subscription form accepts email input and Subscribe button is clickable

- **Опис змін:** Синхронізовано значення рядків: у полі `toHaveValue` вказано той самий імейл, який фактично вводиться на крок раніше через `.fill()`.

- **Чи збіглось з початковою гіпотезою:** Так, первинна гіпотеза повністю підтвердилася. Причиною падіння була невідповідність очікуваного та фактичного значень.

---

#### Footer Section › 1. Footer navigation links are visible

- **Опис змін:**
  - Переписано базовий локатор футера на семантичний - `getByRole('contentinfo')`.
  - Використано регулярні вирази замість строгих рядків для захисту від зайвих пробілів у тексті посилань.
  - До очікуваного масиву додано пропущений пункт `"Places"`.
  
- **Чи збіглось з початковою гіпотезою:** Так, первинна гіпотеза підтвердилася. Причиною падіння була зміна структури меню, яка не була врахована в тесті.

---

#### Footer Section › 2. Footer "Follow us" social links are visible

- **Опис змін:**
  - Переписано базовий локатор футера на семантичний — `getByRole("contentinfo")`.
  - Виправлено одруківку в регулярному виразі локатора з `/leenkedin/i` на `/linkedin/i`.

- **Чи збіглось з початковою гіпотезою:** Так, первинна гіпотеза повністю підтвердилася. Причиною падіння була помилка в назві локатора.

---

## Завдання 4 — Додати власний репортер _(опційно)_

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
>
> - Загальна кількість тестів — у документації [`Suite`](https://playwright.dev/docs/api/class-suite).
> - Статуси — `result.status` (`'passed' | 'failed' | 'timedOut' | 'skipped' | 'interrupted'`).
> - Назва тесту — `test.title`.

```ts
// reports/summary-reporter.ts
import type {
  Reporter,
  FullConfig,
  Suite,
  TestCase,
  TestResult,
  FullResult,
} from "@playwright/test/reporter";

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

| #   | Артефакт                                                                                                            | Завдання |
| --- | ------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | Репозиторій: конфіг, тести, власний репортер                                                                        | Усі      |
| 2   | README з відповідями (вписати прямо в цей файл): вибір репортерів, аналіз падіння, порівняння з агентом, опис фіксу | 1, 2, 3  |
| 3   | Скриншот терміналу з результатом прогону тестів                                                                     | 1        |
| 4   | Скриншоти HTML-репорту та Trace Viewer впалого тесту                                                                | 1        |
| 5   | Скриншот успішного прогону (всі тести green)                                                                        | 3        |
| 6   | Скриншот терміналу з виводом власного репортера                                                                     | 4        |
| 7   | Файл `test-results/results.xml`                                                                                     | 1        |

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

## Task 1 — Configure Reporters and Run Tests _(required)_

### 1.1 Configuration

Add a `reporter` section and a `trace` setting to `playwright.config.ts` — each reporter for its own scenario:

| Reporter                    | Use case                                      |
| --------------------------- | --------------------------------------------- |
| `list`                      | Local development — fast terminal output      |
| `html`                      | Viewing and sharing with the team             |
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

## Task 2 — Validate Your Analysis with an AI Agent _(optional)_

Run any AI agent (Claude Code, Cursor, etc.) in the project and give it the prompt below.

The prompt intentionally restricts the agent to **analysis only** — no fixes, no rewrites, no "let me do it" offers. The goal is to get a second opinion on the failure cause, not to delegate the work.

### Agent Prompt _(copy without changes)_

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

## Task 3 — Fix the Bugs _(required)_

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

## Task 4 — Add a Custom Reporter _(optional)_

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
>
> - Total test count — see the [`Suite`](https://playwright.dev/docs/api/class-suite) API docs.
> - Statuses — `result.status` (`'passed' | 'failed' | 'timedOut' | 'skipped' | 'interrupted'`).
> - Test name — `test.title`.

```ts
// reports/summary-reporter.ts
import type {
  Reporter,
  FullConfig,
  Suite,
  TestCase,
  TestResult,
  FullResult,
} from "@playwright/test/reporter";

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

| #   | Artifact                                                                                                                   | Task    |
| --- | -------------------------------------------------------------------------------------------------------------------------- | ------- |
| 1   | Repository: config, tests, custom reporter                                                                                 | All     |
| 2   | README with answers (written directly in this file): reporter choices, failure analysis, agent comparison, fix description | 1, 2, 3 |
| 3   | Terminal screenshot with the test run result                                                                               | 1       |
| 4   | Screenshots of the HTML report and Trace Viewer for the failing test                                                       | 1       |
| 5   | Screenshot of a successful run (all tests green)                                                                           | 3       |
| 6   | Terminal screenshot showing the custom reporter output                                                                     | 4       |
| 7   | `test-results/results.xml` file                                                                                            | 1       |
