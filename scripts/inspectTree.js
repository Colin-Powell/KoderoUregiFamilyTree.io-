const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, '..', 'src', 'data', 'familyData.json');
const raw = fs.readFileSync(dataPath, 'utf8');
const members = JSON.parse(raw);

function buildTree(members) {
  if (!members || members.length === 0) return null;

  // Step 1: Create memberMap
  const memberMap = new Map();
  members.forEach(member => {
    const id = String(member.id);
    memberMap.set(id, {
      ...member,
      id,
      children: [],
      _childIds: (member.children || []).map(String),
    });
  });

  // Step 2: child -> parents
  const childToParents = new Map();
  memberMap.forEach(parent => {
    (parent._childIds || []).forEach(childId => {
      const list = childToParents.get(childId) || [];
      list.push(parent.id);
      childToParents.set(childId, list);
    });
  });

  // Step 3: create family-units for children with multiple parents
  childToParents.forEach((parents, childId) => {
    if (parents.length > 1) {
      let pair = null;
      for (let pid of parents) {
        const pA = memberMap.get(String(pid));
        if (!pA) continue;
        const pASpouseId = pA.spouseId ? String(pA.spouseId) : null;
        if (!pASpouseId) continue;
        if (parents.includes(pASpouseId)) {
          const pB = memberMap.get(pASpouseId);
          if (pB) { pair = [pA, pB]; break; }
        }
      }
      if (pair) {
        const [pA,pB] = pair;
        const fuId = `family-${pA.id}-${pB.id}-${childId}`;
        const familyUnit = { id: fuId, name: `${pA.name} & ${pB.name}`, nodeType: 'family-unit', spouses: [pA,pB], children: [], _childIds: [childId] };
        memberMap.set(String(fuId), familyUnit);
        pA._childIds = pA._childIds.filter(id => id !== childId);
        pB._childIds = pB._childIds.filter(id => id !== childId);
        pA._childIds.push(String(fuId));
      } else {
        parents.slice(1).forEach(pid => {
          const p = memberMap.get(String(pid));
          if (p) p._childIds = p._childIds.filter(id => id !== childId);
        });
      }
    }
  });

  // Step 4: resolve _childIds
  memberMap.forEach(member => {
    (member._childIds || []).forEach(childId => {
      const child = memberMap.get(String(childId));
      if (child) {
        if (child.nodeType === 'family-unit' && child._childIds) {
          child.children = child._childIds.map(cid => memberMap.get(String(cid))).filter(Boolean);
          delete child._childIds;
        }
        member.children.push(child);
      }
    });
    delete member._childIds;
  });

  // Step 5: find roots
  const usedAsChild = new Set();
  memberMap.forEach(m => (m.children || []).forEach(c => usedAsChild.add(c.id)));
  const rootNodes = Array.from(memberMap.values()).filter(m => !usedAsChild.has(m.id));

  return { memberMap, rootNodes };
}

const { memberMap, rootNodes } = buildTree(members);

// Find Augustine (by name or id 6)
const augustine = memberMap.get('6');
if (!augustine) {
  console.log('Augustine not found in memberMap');
  process.exit(1);
}

console.log('Augustine children (direct):', (augustine.children || []).map(c => ({ id: c.id, name: c.name, nodeType: c.nodeType })));

// Collect grandchildren (children of Augustine's children)
const grandchildren = [];
(augustine.children || []).forEach(child => {
  (child.children || []).forEach(gc => {
    grandchildren.push({ id: gc.id, name: gc.name, via: child.name });
  });
});

console.log('Grandchildren count:', grandchildren.length);
console.log('Grandchildren list:', grandchildren);

// Print tree roots and whether family units exist
console.log('Root nodes count:', rootNodes.length);
console.log('Some root names:', rootNodes.slice(0,10).map(n => n.name));

// For debugging: print family-units
const fus = Array.from(memberMap.values()).filter(m => m.nodeType === 'family-unit');
console.log('Family units:', fus.map(f => ({ id: f.id, name: f.name, children: (f.children||[]).map(c=>c.id) })));

// Optional: write a snapshot
fs.writeFileSync(path.join(__dirname, 'tree-snapshot.json'), JSON.stringify({ roots: rootNodes.map(r=>r.id), augustine: { id: augustine.id, children: augustine.children.map(c=>c.id) }, familyUnits: fus.map(f=> ({ id: f.id, children: (f.children||[]).map(c=>c.id) })) }, null, 2));
console.log('Snapshot written to scripts/tree-snapshot.json');
