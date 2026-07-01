import type {
    Reporter, FullConfig, Suite, TestCase, TestResult, FullResult,
  } from '@playwright/test/reporter';

class SummaryReporter implements Reporter {
    private passed: number = 0;
    private skipped: number = 0;

    private failedTests: string[] = [];

    onBegin(config: FullConfig, suite: Suite) {
        const total = suite.allTests().length;
        console.log(`Starting the test run with ${total} tests`);
        console.log(`--------------------------------`);
    }

    onTestEnd(test: TestCase, result: TestResult) {
        switch (result.status) {
            case 'passed':
                this.passed++;
                break;
            case 'skipped':
                this.skipped++;
                break;
            case 'failed':
            case 'timedOut':
            case 'interrupted':
                this.failedTests.push(test.title);
                break;   
        }
    }
    onEnd(result: FullResult) {
        console.log(`--------------------------------`);
        console.log(`Test Run Summary`);
        console.log(`--------------------------------`);
        console.log(`Passed: ${this.passed}`);
        console.log(`Skipped: ${this.skipped}`);
        console.log(`Failed: ${this.failedTests.length}`);

        if (this.failedTests.length > 0) {
            console.log('\nFailed tests:');
            this.failedTests.forEach((title) => console.log(`  - ${title}`));
          }

        console.log(`\nOverall Test Result: ${result.status}`);
        console.log(`--------------------------------`);
   
    }

}
export default SummaryReporter;