let fixedPtsThales = [
  { x: 210, y: 75 },
  { x: 90, y: 265 },
  { x: 375, y: 245 }
];
const namesThales = ['A', 'B', 'C'];
let rotThales = 0;

let activeInteractionMode = 'MN';

let curThalesM = null, curThalesN = null;
let animIdThales = null;

function dist(p1, p2) {
  return Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2);
}

function lerp(p1, p2, t) {
  return {
    x: p1.x + (p2.x - p1.x) * t,
    y: p1.y + (p2.y - p1.y) * t
  };
}

function easeOutCubic(x) {
  return 1 - Math.pow(1 - x, 3);
}

function setTag(txtId, bgId, textVal, p1, p2, ox, oy) {
  const txt = document.getElementById(txtId);
  const bg = document.getElementById(bgId);
  txt.textContent = textVal;
  const mx = (p1.x + p2.x) / 2 + ox;
  const my = (p1.y + p2.y) / 2 + oy;
  txt.setAttribute('x', mx);
  txt.setAttribute('y', my);
  const b = txt.getBBox();
  bg.setAttribute('x', b.x - 4);
  bg.setAttribute('y', b.y - 2);
  bg.setAttribute('width', b.width + 8);
  bg.setAttribute('height', b.height + 4);
}

function triggerPulse(lineId, p1, p2, activeClass) {
  const el = document.getElementById(lineId);
  el.setAttribute('x1', p1.x);
  el.setAttribute('y1', p1.y);
  el.setAttribute('x2', p2.x);
  el.setAttribute('y2', p2.y);
  
  el.classList.remove(activeClass);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.classList.add(activeClass);
    });
  });
}

function updateThalesLabels() {
  const vTop = namesThales[rotThales];
  const vL = namesThales[(rotThales + 1) % 3];
  const vR = namesThales[(rotThales + 2) % 3];

  const badgeText = `MN // ${vL}${vR}`;
  document.getElementById('badgeThales').textContent = badgeText;
  const mobBadge = document.getElementById('badgeThalesMob');
  if (mobBadge) mobBadge.textContent = badgeText;

  const labelConfigs = [
    { suf1: 'AM', suf2: 'AB', suf3: 'AN', suf4: 'AC', t1: `${vTop}M`, t2: `${vTop}${vL}`, t3: `${vTop}N`, t4: `${vTop}${vR}` },
    { suf1: 'AM2', suf2: 'BM2', suf3: 'AN2', suf4: 'CN2', t1: `${vTop}M`, t2: `M${vL}`, t3: `${vTop}N`, t4: `N${vR}` },
    { suf1: 'BM3', suf2: 'AB3', suf3: 'CN3', suf4: 'AC3', t1: `M${vL}`, t2: `${vTop}${vL}`, t3: `N${vR}`, t4: `${vTop}${vR}` }
  ];

  labelConfigs.forEach((cfg, idx) => {
    const qIdx = idx + 1;
    document.getElementById(`name${cfg.suf1}`).textContent = cfg.t1;
    document.getElementById(`name${cfg.suf2}`).textContent = cfg.t2;
    document.getElementById(`name${cfg.suf3}`).textContent = cfg.t3;
    document.getElementById(`name${cfg.suf4}`).textContent = cfg.t4;

    document.getElementById(`qName${cfg.suf1.replace(/\d+$/, '')}${qIdx}`).textContent = cfg.t1;
    document.getElementById(`qName${cfg.suf2.replace(/\d+$/, '')}${qIdx}`).textContent = cfg.t2;
    document.getElementById(`qName${cfg.suf3.replace(/\d+$/, '')}${qIdx}`).textContent = cfg.t3;
    document.getElementById(`qName${cfg.suf4.replace(/\d+$/, '')}${qIdx}`).textContent = cfg.t4;
  });
}

function computeThalesTargets() {
  const top = fixedPtsThales[rotThales];
  const left = fixedPtsThales[(rotThales + 1) % 3];
  const right = fixedPtsThales[(rotThales + 2) % 3];
  const k = parseFloat(document.getElementById('sliderMN').value);
  return {
    top, left, right, k,
    targetM: lerp(top, left, k),
    targetN: lerp(top, right, k)
  };
}

function renderThalesGeometry(M, N, top, left, right, k) {
  curThalesM = M;
  curThalesN = N;

  const extL1 = lerp(top, left, -0.45);
  const extL2 = lerp(top, left, 1.45);
  const extR1 = lerp(top, right, -0.45);
  const extR2 = lerp(top, right, 1.45);

  const elExtL = document.getElementById('extThalesL');
  elExtL.setAttribute('x1', extL1.x);
  elExtL.setAttribute('y1', extL1.y);
  elExtL.setAttribute('x2', extL2.x);
  elExtL.setAttribute('y2', extL2.y);

  const elExtR = document.getElementById('extThalesR');
  elExtR.setAttribute('x1', extR1.x);
  elExtR.setAttribute('y1', extR1.y);
  elExtR.setAttribute('x2', extR2.x);
  elExtR.setAttribute('y2', extR2.y);

  document.getElementById('polyABC').setAttribute(
    'points', 
    `${fixedPtsThales[0].x},${fixedPtsThales[0].y} ${fixedPtsThales[1].x},${fixedPtsThales[1].y} ${fixedPtsThales[2].x},${fixedPtsThales[2].y}`
  );

  const lineMN = document.getElementById('lineMN');
  lineMN.setAttribute('x1', M.x);
  lineMN.setAttribute('y1', M.y);
  lineMN.setAttribute('x2', N.x);
  lineMN.setAttribute('y2', N.y);

  function setPt(id, p) {
    const el = document.getElementById(id);
    el.setAttribute('cx', p.x);
    el.setAttribute('cy', p.y);
  }
  setPt('ptA', fixedPtsThales[0]);
  setPt('ptB', fixedPtsThales[1]);
  setPt('ptC', fixedPtsThales[2]);

  setPt('hitA', fixedPtsThales[0]);
  setPt('hitB', fixedPtsThales[1]);
  setPt('hitC', fixedPtsThales[2]);

  setPt('ptM', M);
  setPt('ptN', N);

  function setPos(id, p, dx, dy, text) {
    const el = document.getElementById(id);
    el.setAttribute('x', p.x + dx);
    el.setAttribute('y', p.y + dy);
    if (text) el.textContent = text;
  }
  setPos('lblA', fixedPtsThales[0], -4, -14, 'A');
  setPos('lblB', fixedPtsThales[1], -16, 14, 'B');
  setPos('lblC', fixedPtsThales[2], 14, 12, 'C');
  setPos('lblM', M, -18, -4);
  setPos('lblN', N, 16, -4);

  const dAB_raw = dist(top, left) / 25;
  const dAC_raw = dist(top, right) / 25;

  const dAM_raw = dist(top, M) / 25;
  const dMB_raw = dist(M, left) / 25;
  const dAN_raw = dist(top, N) / 25;
  const dNC_raw = dist(N, right) / 25;

  const dAM = dAM_raw.toFixed(1);
  const dMB = dMB_raw.toFixed(1);
  const dAN = dAN_raw.toFixed(1);
  const dNC = dNC_raw.toFixed(1);
  const dAB = dAB_raw.toFixed(1);
  const dAC = dAC_raw.toFixed(1);

  setTag('txtAM', 'bgAM', dAM, top, M, -18, 0);
  setTag('txtMB', 'bgMB', dMB, M, left, -18, 0);
  setTag('txtAN', 'bgAN', dAN, top, N, 18, 0);
  setTag('txtNC', 'bgNC', dNC, N, right, 18, 0);

  const ratioConfigs = [
    {
      numLId: 'numAM', denLId: 'denAB', numRId: 'numAN', denRId: 'denAC',
      numLVal: dAM, denLVal: dAB, numRVal: dAN, denRVal: dAC,
      valLId: 'valRatioL', valRId: 'valRatioR', eqLId: 'eqRatio1L', eqRId: 'eqRatio1R',
      isUndef: parseFloat(dAB) === 0 || parseFloat(dAC) === 0,
      ratioStr: Math.abs(k).toFixed(2)
    },
    {
      numLId: 'numAM2', denLId: 'denBM2', numRId: 'numAN2', denRId: 'denCN2',
      numLVal: dAM, denLVal: dMB, numRVal: dAN, denRVal: dNC,
      valLId: 'valRatio2L', valRId: 'valRatio2R', eqLId: 'eqRatio2L', eqRId: 'eqRatio2R',
      isUndef: parseFloat(dMB) === 0 || parseFloat(dNC) === 0 || Math.abs(1 - k) < 1e-4,
      ratioStr: (Math.abs(k) / Math.abs(1 - k)).toFixed(2)
    },
    {
      numLId: 'numBM3', denLId: 'denAB3', numRId: 'numCN3', denRId: 'denAC3',
      numLVal: dMB, denLVal: dAB, numRVal: dNC, denRVal: dAC,
      valLId: 'valRatio3L', valRId: 'valRatio3R', eqLId: 'eqRatio3L', eqRId: 'eqRatio3R',
      isUndef: parseFloat(dAB) === 0 || parseFloat(dAC) === 0,
      ratioStr: Math.abs(1 - k).toFixed(2)
    }
  ];

  ratioConfigs.forEach(rc => {
    document.getElementById(rc.numLId).textContent = rc.numLVal;
    document.getElementById(rc.denLId).textContent = rc.denLVal;
    document.getElementById(rc.numRId).textContent = rc.numRVal;
    document.getElementById(rc.denRId).textContent = rc.denRVal;

    const elValL = document.getElementById(rc.valLId);
    const elValR = document.getElementById(rc.valRId);
    const elEqL = document.getElementById(rc.eqLId);
    const elEqR = document.getElementById(rc.eqRId);

    if (rc.isUndef) {
      elValL.textContent = "---";
      elValR.textContent = "---";
      elEqL.style.display = 'none';
      elEqR.style.display = 'none';
    } else {
      elValL.textContent = rc.ratioStr;
      elValR.textContent = rc.ratioStr;
      elEqL.style.display = '';
      elEqR.style.display = '';
    }
  });
}

function updateThales() {
  if (animIdThales) cancelAnimationFrame(animIdThales);
  updateThalesLabels();
  const { top, left, right, k, targetM, targetN } = computeThalesTargets();
  renderThalesGeometry(targetM, targetN, top, left, right, k);
}

function animateThalesRotate() {
  if (animIdThales) cancelAnimationFrame(animIdThales);
  updateThalesLabels();
  const { top, left, right, k, targetM, targetN } = computeThalesTargets();

  triggerPulse('basePulseThales', left, right, 'pulse-active');

  const startM = curThalesM ? { ...curThalesM } : targetM;
  const startN = curThalesN ? { ...curThalesN } : targetN;
  const startTime = performance.now();
  const duration = 360;

  function frame(now) {
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / duration);
    const ease = easeOutCubic(progress);

    const currentM = lerp(startM, targetM, ease);
    const currentN = lerp(startN, targetN, ease);
    renderThalesGeometry(currentM, currentN, top, left, right, k);

    if (progress < 1) {
      animIdThales = requestAnimationFrame(frame);
    } else {
      animIdThales = null;
    }
  }
  animIdThales = requestAnimationFrame(frame);
}

function updateThemeColors() {
  const poly = document.getElementById('polyABC');
  const lineMN = document.getElementById('lineMN');
  const ptsABC = document.querySelectorAll('.pt-abc');
  const ptsMN = document.querySelectorAll('.pt-mn');
  const lblsABC = document.querySelectorAll('.lbl-abc');
  const lblsMN = document.querySelectorAll('.lbl-mn');

  if (activeInteractionMode === 'MN') {
    poly.setAttribute('fill', '#dbeafe');
    poly.setAttribute('stroke', '#2563eb');
    lineMN.setAttribute('stroke', '#ea580c');

    ptsABC.forEach(pt => {
      pt.setAttribute('fill', '#2563eb');
      pt.setAttribute('r', '6');
    });
    ptsMN.forEach(pt => pt.setAttribute('fill', '#f59e0b'));

    lblsABC.forEach(lbl => lbl.setAttribute('fill', '#1e40af'));
    lblsMN.forEach(lbl => lbl.setAttribute('fill', '#b45309'));
  } else {
    poly.setAttribute('fill', '#ffedd5');
    poly.setAttribute('stroke', '#ea580c');
    lineMN.setAttribute('stroke', '#2563eb');

    ptsABC.forEach(pt => {
      pt.setAttribute('fill', '#ea580c');
      pt.setAttribute('r', '8');
    });
    ptsMN.forEach(pt => pt.setAttribute('fill', '#3b82f6'));

    lblsABC.forEach(lbl => lbl.setAttribute('fill', '#c2410c'));
    lblsMN.forEach(lbl => lbl.setAttribute('fill', '#1d4ed8'));
  }
}

function setupModeSwitcher() {
  const btnMN = document.getElementById('btnModeMN');
  const btnABC = document.getElementById('btnModeABC');
  const wrap = document.getElementById('wrapThales');

  btnMN.addEventListener('click', () => {
    activeInteractionMode = 'MN';
    btnMN.classList.add('active');
    btnABC.classList.remove('active');
    wrap.classList.remove('mode-abc');
    updateThemeColors();
  });

  btnABC.addEventListener('click', () => {
    activeInteractionMode = 'ABC';
    btnABC.classList.add('active');
    btnMN.classList.remove('active');
    wrap.classList.add('mode-abc');
    updateThemeColors();
  });
}

function setupNormalVectorDrag(wrapId, svgId, sliderId, callback) {
  const wrap = document.getElementById(wrapId);
  const svg = document.getElementById(svgId);
  const slider = document.getElementById(sliderId);
  let isDragging = false;
  let startPoint = { x: 0, y: 0 };
  let startRatio = 0;
  let normalVector = { x: 0, y: 1 };
  let normalLengthSq = 1;

  function getSvgPoint(e) {
    const pt = svg.createSVGPoint();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    pt.x = clientX;
    pt.y = clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  }

  function handleStart(e) {
    if (activeInteractionMode !== 'MN') return;
    if (e.target.classList.contains('vertex-hitbox')) return;

    isDragging = true;
    const pt = getSvgPoint(e);
    startPoint = { x: pt.x, y: pt.y };
    startRatio = parseFloat(slider.value);

    const A = fixedPtsThales[rotThales];
    const B = fixedPtsThales[(rotThales + 1) % 3];
    const C = fixedPtsThales[(rotThales + 2) % 3];

    const bcX = C.x - B.x;
    const bcY = C.y - B.y;
    const bcLenSq = bcX * bcX + bcY * bcY;
    const t = ((A.x - B.x) * bcX + (A.y - B.y) * bcY) / bcLenSq;
    const H = { x: B.x + t * bcX, y: B.y + t * bcY };

    normalVector = { x: H.x - A.x, y: H.y - A.y };
    normalLengthSq = normalVector.x * normalVector.x + normalVector.y * normalVector.y;

    if (e.cancelable) e.preventDefault();
  }

  function handleMove(e) {
    if (!isDragging) return;
    const pt = getSvgPoint(e);
    const deltaVec = { x: pt.x - startPoint.x, y: pt.y - startPoint.y };

    const dotProduct = deltaVec.x * normalVector.x + deltaVec.y * normalVector.y;
    const deltaK = dotProduct / normalLengthSq;

    let ratio = startRatio + deltaK;
    const minVal = parseFloat(slider.min);
    const maxVal = parseFloat(slider.max);
    ratio = Math.max(minVal, Math.min(maxVal, ratio));

    slider.value = ratio;
    callback();
    if (e.cancelable) e.preventDefault();
  }

  function handleEnd() {
    isDragging = false;
  }

  wrap.addEventListener('mousedown', handleStart);
  wrap.addEventListener('touchstart', handleStart, { passive: false });

  window.addEventListener('mousemove', handleMove);
  window.addEventListener('touchmove', handleMove, { passive: false });

  window.addEventListener('mouseup', handleEnd);
  window.addEventListener('touchend', handleEnd);
}

function setupVertexDragging(svgId, callback) {
  const svg = document.getElementById(svgId);
  let draggingVertexIdx = -1;

  function getSvgPoint(e) {
    const pt = svg.createSVGPoint();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    pt.x = clientX;
    pt.y = clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
  }

  function onVertexStart(idx, e) {
    if (activeInteractionMode !== 'ABC') return;
    draggingVertexIdx = idx;
    if (e.cancelable) e.preventDefault();
  }

  document.getElementById('hitA').addEventListener('mousedown', (e) => onVertexStart(0, e));
  document.getElementById('hitA').addEventListener('touchstart', (e) => onVertexStart(0, e), { passive: false });

  document.getElementById('hitB').addEventListener('mousedown', (e) => onVertexStart(1, e));
  document.getElementById('hitB').addEventListener('touchstart', (e) => onVertexStart(1, e), { passive: false });

  document.getElementById('hitC').addEventListener('mousedown', (e) => onVertexStart(2, e));
  document.getElementById('hitC').addEventListener('touchstart', (e) => onVertexStart(2, e), { passive: false });

  window.addEventListener('mousemove', (e) => {
    if (draggingVertexIdx === -1) return;
    const pt = getSvgPoint(e);
    fixedPtsThales[draggingVertexIdx].x = Math.max(25, Math.min(435, pt.x));
    fixedPtsThales[draggingVertexIdx].y = Math.max(25, Math.min(315, pt.y));
    callback();
    if (e.cancelable) e.preventDefault();
  });

  window.addEventListener('touchmove', (e) => {
    if (draggingVertexIdx === -1) return;
    const pt = getSvgPoint(e);
    fixedPtsThales[draggingVertexIdx].x = Math.max(25, Math.min(435, pt.x));
    fixedPtsThales[draggingVertexIdx].y = Math.max(25, Math.min(315, pt.y));
    callback();
    if (e.cancelable) e.preventDefault();
  }, { passive: false });

  function onVertexEnd() {
    draggingVertexIdx = -1;
  }

  window.addEventListener('mouseup', onVertexEnd);
  window.addEventListener('touchend', onVertexEnd);
}

function setupSignDropInteraction() {
  let activeSelectedSign = null;
  const signTiles = document.querySelectorAll('.sign-tile');
  const dropZones = document.querySelectorAll('.drop-zone');

  function applySignToZone(zone, sign) {
    zone.textContent = sign;
    zone.classList.remove('correct', 'wrong');
    zone.classList.add('filled');
    if (sign === '=') {
      zone.classList.add('correct');
    } else {
      zone.classList.add('wrong');
    }
  }

  signTiles.forEach(tile => {
    tile.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', tile.getAttribute('data-sign'));
    });

    tile.addEventListener('click', () => {
      const sign = tile.getAttribute('data-sign');
      if (activeSelectedSign === sign) {
        tile.classList.remove('selected');
        activeSelectedSign = null;
      } else {
        signTiles.forEach(t => t.classList.remove('selected'));
        tile.classList.add('selected');
        activeSelectedSign = sign;
      }
    });

    let ghostEl = null;

    tile.addEventListener('touchstart', (e) => {
      const touch = e.touches[0];
      const sign = tile.getAttribute('data-sign');

      ghostEl = document.createElement('div');
      ghostEl.className = 'touch-drag-ghost';
      ghostEl.textContent = sign;
      ghostEl.style.left = `${touch.clientX}px`;
      ghostEl.style.top = `${touch.clientY}px`;
      document.body.appendChild(ghostEl);

      if (e.cancelable) e.preventDefault();
    }, { passive: false });

    tile.addEventListener('touchmove', (e) => {
      if (!ghostEl) return;
      const touch = e.touches[0];
      ghostEl.style.left = `${touch.clientX}px`;
      ghostEl.style.top = `${touch.clientY}px`;

      const elUnder = document.elementFromPoint(touch.clientX, touch.clientY);
      dropZones.forEach(zone => {
        if (zone === elUnder || zone.contains(elUnder)) {
          zone.classList.add('dragover');
        } else {
          zone.classList.remove('dragover');
        }
      });

      if (e.cancelable) e.preventDefault();
    }, { passive: false });

    function handleTouchEnd(e) {
      if (!ghostEl) return;
      const touch = e.changedTouches[0];
      const elUnder = document.elementFromPoint(touch.clientX, touch.clientY);
      const sign = tile.getAttribute('data-sign');

      dropZones.forEach(zone => {
        zone.classList.remove('dragover');
        if (zone === elUnder || zone.contains(elUnder)) {
          applySignToZone(zone, sign);
        }
      });

      ghostEl.remove();
      ghostEl = null;
    }

    tile.addEventListener('touchend', handleTouchEnd);
    tile.addEventListener('touchcancel', handleTouchEnd);
  });

  dropZones.forEach(zone => {
    zone.addEventListener('dragover', (e) => {
      e.preventDefault();
      zone.classList.add('dragover');
    });

    zone.addEventListener('dragleave', () => {
      zone.classList.remove('dragover');
    });

    zone.addEventListener('drop', (e) => {
      e.preventDefault();
      zone.classList.remove('dragover');
      const sign = e.dataTransfer.getData('text/plain');
      if (sign) {
        applySignToZone(zone, sign);
      }
    });

    zone.addEventListener('click', () => {
      if (activeSelectedSign) {
        applySignToZone(zone, activeSelectedSign);
      } else if (zone.textContent !== '?') {
        zone.textContent = '?';
        zone.classList.remove('filled', 'correct', 'wrong');
      }
    });
  });
}

document.getElementById('sliderMN').addEventListener('input', updateThales);

document.getElementById('btnRotateThales').addEventListener('click', () => {
  rotThales = (rotThales + 1) % 3;
  animateThalesRotate();
});

setupModeSwitcher();
setupNormalVectorDrag('wrapThales', 'svgThales', 'sliderMN', updateThales);
setupVertexDragging('svgThales', updateThales);

window.addEventListener('DOMContentLoaded', () => {
  setupSignDropInteraction();
  updateThemeColors();
  updateThales();
});