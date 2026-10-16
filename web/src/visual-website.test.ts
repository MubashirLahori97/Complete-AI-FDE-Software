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
it('renders the dedicated area and only whitelisted teaching highlights', () => {
  const settings = {
    title: 'Repairs in North <district>',
    accent: 'coral' as const,
    size: 30,
    rule: false,
  };
  const shown = websiteDocument({ ...settings, showArea: true, focus: 'area' });
  const hidden = websiteDocument({ ...settings, showArea: false, focus: 'contact' });
  expect(shown).toContain('<span id="service-area">in the North district.</span>');
  expect(shown).toContain('#service-area{outline:2px dashed #b84a35');
  expect(hidden).not.toContain('id="service-area"');
  expect(hidden).toContain('Appliance repairs.<br>');
  expect(hidden).toContain('Repairs in North &lt;district&gt;');
  expect(hidden).toContain('const hasRule=false');
  const invalid = websiteDocument({
    ...settings,
    focus: '</style><script>bad()</script>' as never,
  });
  expect(invalid).not.toContain('bad()');
});
