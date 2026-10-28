import assert from 'node:assert/strict';
import { searchPortfolio } from '../src/utils/search.js';
import { dockLayout, dockMagnification } from '../src/utils/dockLayout.js';

const projects = [
  { id: 'one', title: 'Café Identity', category: 'Branding', description: 'A warm visual identity.', tools: ['Illustrator'], thumbnail: 'one.webp' },
  { id: 'two', title: 'Summer', category: 'Packaging', description: 'A sunny bottle.', tools: ['Photoshop'], thumbnail: 'two.webp' },
];
const apps = [{ id: 'notes', label: 'Notes', icon: 'notes.svg' }, { id: 'mail', label: 'Mail', fallbackIcon: 'mail.svg' }];
const snapshot = JSON.stringify({ projects, apps });
assert.deepEqual(searchPortfolio(' cafe  illustrator ', projects, apps).map(item => item.id), ['project-one']);
assert.equal(searchPortfolio('PACKAGING', projects, apps)[0].project, projects[1]);
assert.equal(searchPortfolio('warm branding', projects, apps)[0].title, 'Café Identity');
assert.equal(searchPortfolio('no results', projects, apps).length, 0);
assert.equal(searchPortfolio('notes', projects, apps)[0].app, apps[0]);
assert.equal(searchPortfolio('mail', projects, apps)[0].icon, 'mail.svg');
assert.equal(searchPortfolio('', projects, apps).length, 4);
assert.equal(searchPortfolio('', Array.from({ length: 20 }, (_, id) => ({ ...projects[0], id })), apps).length, 12);
assert.equal(JSON.stringify({ projects, apps }), snapshot, 'Search must not mutate content');

const dockApps = Array.from({ length: 8 }, (_, index) => ({ dividerBefore: index === 4 || index === 7, iconScale: index === 1 ? 1.2 : 1 }));
const layout = dockLayout(dockApps, 36, 44);
let maximum = 0;
for (let pointer = 0; pointer <= layout.width; pointer += 2) {
  let width = 18 + 7 * 4 + 2 * 16;
  layout.items.forEach((item, index) => {
    const scale = dockMagnification(pointer, item.center);
    const artwork = 36 * Math.max(1, dockApps[index].iconScale) * scale;
    assert.ok(item.slot * scale - artwork >= 7.99);
    width += item.slot * scale;
  });
  maximum = Math.max(maximum, width);
}
assert.ok(maximum > layout.width && maximum < 769 - 24);
console.log('PASS: search matching/limit/immutability, and compact non-overlapping Dock geometry.');
