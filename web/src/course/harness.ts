import { CHECK_MARKER, type CourseExercise, type ExerciseCase, type CheckResult } from './types';

export function casesForStep(exercise: CourseExercise, step: number): ExerciseCase[] {
  const selected = new Set(exercise.steps.slice(0, step + 1).flatMap((item) => item.cases));
  return exercise.cases
    .filter((item) => selected.has(item.id))
    .map((item) => ({ ...item, expected: item.expectedAtStep?.[String(step)] ?? item.expected }));
}

// This code is sent to the existing isolated worker, never evaluated in the app.
export function javascriptChecks(exercise: CourseExercise, code: string, step: number): string {
  const cases = casesForStep(exercise, step);
  return `return (async () => {
const student = async (${exercise.parameters.join(',')}) => {
${exercise.setup || ''}
${code}
return (${exercise.result});
};
const normalize = value => Array.isArray(value) ? value.map(normalize) : value && typeof value === 'object' ? Object.fromEntries(Object.keys(value).sort().map(key => [key, normalize(value[key])])) : value;
const show = value => (JSON.stringify(value) ?? String(value)).slice(0, 1000);
const equal = (left, right) => JSON.stringify(normalize(left)) === JSON.stringify(normalize(right));
const results = [];
for (const item of ${JSON.stringify(cases)}) {
  try {
    const actual = await student(...(item.args || []));
    results.push({id:item.id,label:item.label,passed:!item.error && equal(actual,item.expected),expected:item.error || show(item.expected),actual:show(actual)});
  } catch (error) {
    results.push({id:item.id,label:item.label,passed:!!item.error && error.name===item.error,expected:item.error || show(item.expected),actual:error.name+': '+error.message});
  }
}
for (const result of results) console.log(${JSON.stringify(CHECK_MARKER)} + JSON.stringify(result));
})();`;
}

export function pythonChecks(exercise: CourseExercise, code: string, step: number): string {
  const cases = casesForStep(exercise, step);
  return `import json as __fde_json
def __fde_student(${exercise.parameters.join(', ')}):
${(exercise.setup || '')
  .split('\n')
  .map((line) => '    ' + line)
  .join('\n')}
${code
  .split('\n')
  .map((line) => '    ' + line)
  .join('\n')}
    return (${exercise.result})
__fde_results = []
for __fde_case in __fde_json.loads(${JSON.stringify(JSON.stringify(cases))}):
    try:
        __fde_actual = __fde_student(*__fde_case.get('args', []))
        __fde_results.append({'id': __fde_case['id'], 'label': __fde_case['label'], 'passed': not __fde_case.get('error') and __fde_json.dumps(__fde_actual, sort_keys=True) == __fde_json.dumps(__fde_case.get('expected'), sort_keys=True), 'expected': __fde_case.get('error') or __fde_json.dumps(__fde_case.get('expected')), 'actual': __fde_json.dumps(__fde_actual)})
    except Exception as __fde_error:
        __fde_results.append({'id': __fde_case['id'], 'label': __fde_case['label'], 'passed': bool(__fde_case.get('error')) and type(__fde_error).__name__ == __fde_case['error'], 'expected': __fde_case.get('error') or __fde_json.dumps(__fde_case.get('expected')), 'actual': type(__fde_error).__name__ + ': ' + str(__fde_error)})
for __fde_result in __fde_results:
    __fde_result['expected'] = __fde_result['expected'][:1000]
    __fde_result['actual'] = __fde_result['actual'][:1000]
    print(${JSON.stringify(CHECK_MARKER)} + __fde_json.dumps(__fde_result))`;
}

export function parseChecks(
  line: string,
  expectedCases: ExerciseCase[],
): CheckResult[] | undefined {
  if (!line.startsWith(CHECK_MARKER)) return undefined;
  try {
    const values: unknown = JSON.parse(line.slice(CHECK_MARKER.length));
    const entries = Array.isArray(values) ? values : [values];
    if (!entries.length || entries.length > expectedCases.length) return undefined;
    const seen = new Set();
    return entries.map((value) => {
      const item = expectedCases.find(
        (item) => value && typeof value === 'object' && value.id === item.id,
      );
      if (!item || seen.has(item.id)) throw new Error('Invalid check id');
      seen.add(item.id);
      if (
        !value ||
        typeof value.passed !== 'boolean' ||
        typeof value.actual !== 'string' ||
        typeof value.expected !== 'string'
      )
        throw new Error('Invalid check result');
      return {
        id: item.id,
        label: item.label,
        passed: value.passed,
        expected: value.expected.slice(0, 1000),
        actual: value.actual.slice(0, 1000),
      };
    });
  } catch {
    return undefined;
  }
}

export function domChecks(cases: ExerciseCase[], nonce: string): string {
  return `(async () => {
await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
const results = [];
${cases.map((item) => `try { const actual = await (async () => { ${item.script || 'return false;'} })(); results.push({id:${JSON.stringify(item.id)},label:${JSON.stringify(item.label)},passed:JSON.stringify(actual)===JSON.stringify(${JSON.stringify(item.expected)}),expected:JSON.stringify(${JSON.stringify(item.expected)}),actual:JSON.stringify(actual) ?? String(actual)}); } catch (error) { results.push({id:${JSON.stringify(item.id)},label:${JSON.stringify(item.label)},passed:false,expected:JSON.stringify(${JSON.stringify(item.expected)}),actual:error.message}); }`).join('\n')}
parent.postMessage({source:'fde-course-dom',nonce:${JSON.stringify(nonce)},results}, '*');
})();`;
}
