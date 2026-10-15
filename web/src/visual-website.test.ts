import { expect, it } from 'vitest';
import { transferPoint, websiteDocument } from './visual-website';

it('keeps a learner heading as text and bounds appearance values in the actual document', () => {
  const document = websiteDocument({
    title: '<img src=x onerror="alert(1)">',
    accent: 'teal',
    size: 999,
    rule: false,
    channel: '</script><script>alert(2)</script>',
  });
  expect(document).toContain('&lt;img src=x onerror=&quot;alert(1)&quot;&gt;');
  expect(document).not.toContain('<img src=x');
  expect(document).not.toContain('</script><script>alert(2)');
  expect(document).toContain('font-size:38px');
  expect(document).toContain('const hasRule=false');
  expect(document).toContain('#147d80');
});
it('maps the controlled journey onto the same visual curve and clamps its endpoints', () => {
  expect(transferPoint(-10)).toEqual({ x: 12, y: 75 });
  expect(transferPoint(100)).toEqual({ x: 178, y: 75 });
  expect(transferPoint(150)).toEqual({ x: 178, y: 75 });
  expect(transferPoint(50).x).toBeGreaterThan(12);
  expect(transferPoint(50).x).toBeLessThan(178);
  expect(transferPoint(25).y).not.toBe(75);
});
