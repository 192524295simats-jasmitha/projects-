import * as THREE from 'three';

let cachedSoftwareGl: boolean | null = null;

export function detectSoftwareWebGL(): boolean {
  if (cachedSoftwareGl !== null) return cachedSoftwareGl;
  if (typeof document === 'undefined') {
    cachedSoftwareGl = false;
    return false;
  }
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) {
      cachedSoftwareGl = true;
      return true;
    }
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const rendererStr = String(gl.getParameter(param) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    cachedSoftwareGl = /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(rendererStr);
    return cachedSoftwareGl;
  } catch {
    cachedSoftwareGl = false;
    return false;
  }
}

export function createAsphaltTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#1d2433';
  ctx.fillRect(0, 0, 256, 256);

  // Subtle aggregate grain
  for (let i = 0; i < 2400; i++) {
    const x = (i * 73) % 256;
    const y = (i * 137) % 256;
    const shade = 28 + (i % 18);
    ctx.fillStyle = `rgb(${shade}, ${shade + 4}, ${shade + 12})`;
    ctx.fillRect(x, y, 2, 2);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(8, 8);
  tex.anisotropy = 8;
  return tex;
}

export function createTerracottaPaverTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#9c5243';
  ctx.fillRect(0, 0, 256, 256);

  const brickW = 32;
  const brickH = 16;
  for (let row = 0; row < 16; row++) {
    const offset = row % 2 === 0 ? 0 : brickW / 2;
    for (let col = -1; col < 9; col++) {
      const shade = ((row * 7 + col * 13) % 16) - 8;
      ctx.fillStyle = `rgb(${158 + shade}, ${84 + Math.floor(shade * 0.5)}, ${68 + Math.floor(shade * 0.4)})`;
      ctx.fillRect(col * brickW + offset + 1, row * brickH + 1, brickW - 2, brickH - 2);
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(6, 6);
  tex.anisotropy = 8;
  return tex;
}

export function createGrassTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#1e4d2b';
  ctx.fillRect(0, 0, 256, 256);

  // Subtle lawn stripes
  for (let i = 0; i < 8; i++) {
    ctx.fillStyle = i % 2 === 0 ? 'rgba(40, 108, 56, 0.28)' : 'rgba(18, 58, 30, 0.25)';
    ctx.fillRect(i * 32, 0, 32, 256);
  }

  for (let i = 0; i < 1800; i++) {
    const x = (i * 59) % 256;
    const y = (i * 101) % 256;
    ctx.fillStyle = i % 3 === 0 ? 'rgba(72, 145, 78, 0.22)' : 'rgba(14, 42, 22, 0.22)';
    ctx.fillRect(x, y, 2, 3);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(14, 14);
  tex.anisotropy = 8;
  return tex;
}

export function createSolarPanelTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#0f2547';
  ctx.fillRect(0, 0, 256, 128);

  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.5;
  for (let x = 0; x <= 256; x += 32) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, 128);
    ctx.stroke();
  }
  for (let y = 0; y <= 128; y += 32) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(256, y);
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = 8;
  return tex;
}

export function createPorticoSignTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 96;
  const ctx = canvas.getContext('2d')!;

  // Navy left & center background matching Saveetha portico banner (Image 2)
  ctx.fillStyle = '#172554';
  ctx.fillRect(0, 0, 396, 96);

  // Crimson SEC badge on right matching Image 2
  ctx.fillStyle = '#be123c';
  ctx.fillRect(396, 0, 116, 96);

  // Gold Autonomous badge
  ctx.fillStyle = '#eab308';
  ctx.fillRect(250, 14, 124, 20);
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 12px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('AUTONOMOUS', 312, 28);

  // College title
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'left';
  ctx.font = 'bold 21px sans-serif';
  ctx.fillText('SAVEETHA', 28, 38);
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText('ENGINEERING COLLEGE', 28, 68);

  // SEC text
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.font = 'bold 34px sans-serif';
  ctx.fillText('SEC', 454, 60);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

export function createHealthSignTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 384;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#0284c7';
  ctx.fillRect(0, 0, 384, 128);
  ctx.strokeStyle = '#e0f2fe';
  ctx.lineWidth = 4;
  ctx.strokeRect(8, 8, 368, 112);

  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.font = 'bold 30px sans-serif';
  ctx.fillText('SAVEETHA', 192, 54);
  ctx.font = 'bold 20px sans-serif';
  ctx.fillText('HEALTH SCIENCES BLOCK', 192, 88);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}

export function createTricolorFlagTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 192;
  canvas.height = 128;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#ff9933';
  ctx.fillRect(0, 0, 192, 43);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 43, 192, 42);
  ctx.fillStyle = '#138808';
  ctx.fillRect(0, 85, 192, 43);

  // Ashoka Chakra ring
  ctx.strokeStyle = '#000080';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(96, 64, 14, 0, Math.PI * 2);
  ctx.stroke();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 8;
  return tex;
}
