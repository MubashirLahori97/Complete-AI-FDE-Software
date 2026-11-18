import { useEffect, useRef, useState, type CSSProperties } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import WorldDiagram from './LabDiagram';

export type WorldNode = { name: string; runs: string; value: string };
export type WorldProps = {
  nodes: WorldNode[];
  selected: number;
  onSelect: (index: number) => void;
  revision: number;
  spread: number;
  angle: number;
  inspect: boolean;
  reduced: boolean;
  tone: string;
  traceEnd: number;
  onReady?: (mode: 'webgl' | 'diagram') => void;
};
const colours = ['#7ccfe2', '#e9bf79', '#b8a3ed'];

export default function LabWorld(props: WorldProps) {
  const root = useRef<HTMLDivElement>(null);
  const live = useRef(props);
  live.current = props;
  const update = useRef<(() => void) | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (failed) return;
    const host = root.current;
    if (!host) return;
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'low-power',
      });
    } catch {
      setFailed(true);
      live.current.onReady?.('diagram');
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setClearColor('#0c1420', 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.setAttribute('role', 'img');
    renderer.domElement.setAttribute(
      'aria-label',
      'Three-dimensional system. Use the labelled component buttons to inspect the same information.',
    );
    host.prepend(renderer.domElement);
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-7, 7, 4, -4, 0.1, 100);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.enableDamping = false;
    controls.minPolarAngle = 0.25;
    controls.maxPolarAngle = 1.48;
    scene.add(new THREE.HemisphereLight('#c6e1ff', '#17212c', 2.3));
    const key = new THREE.DirectionalLight('#fff0d2', 3);
    key.position.set(-3, 8, 6);
    scene.add(key);
    const back = new THREE.DirectionalLight('#8aa7e6', 2);
    back.position.set(6, 3, -5);
    scene.add(back);
    const meshes: THREE.Mesh[] = [];
    const groups: THREE.Group[] = [];
    const rings: THREE.Mesh[] = [];
    const geometry: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    const keepG = <T extends THREE.BufferGeometry>(g: T) => {
      geometry.push(g);
      return g;
    };
    const keepM = <T extends THREE.Material>(m: T) => {
      materials.push(m);
      return m;
    };
    const ground = new THREE.Mesh(
      keepG(new THREE.CircleGeometry(4.7, 96)),
      keepM(
        new THREE.MeshStandardMaterial({
          color: '#131e2d',
          roughness: 1,
          transparent: true,
          opacity: 0.15,
        }),
      ),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.7;
    scene.add(ground);
    for (let i = 0; i < 3; i++) {
      const group = new THREE.Group();
      groups.push(group);
      scene.add(group);
      const colour = new THREE.Color(colours[i]);
      const shape =
        i === 1
          ? keepG(new THREE.OctahedronGeometry(0.73, 0))
          : keepG(new RoundedBoxGeometry(1.48, 1.04, 0.23, 4, 0.1));
      const material = keepM(
        new THREE.MeshStandardMaterial({
          color: colour.clone().multiplyScalar(0.43),
          metalness: 0.25,
          roughness: 0.34,
          emissive: colour.clone().multiplyScalar(0.06),
        }),
      );
      const mesh = new THREE.Mesh(shape, material);
      mesh.userData.index = i;
      meshes.push(mesh);
      group.add(mesh);
      mesh.rotation.y = i === 1 ? 0.35 : -0.12;
      mesh.rotation.z = i === 1 ? 0 : (i - 1) * 0.05;
      const edge = new THREE.LineSegments(
        keepG(new THREE.EdgesGeometry(shape)),
        keepM(new THREE.LineBasicMaterial({ color: colour, transparent: true, opacity: 0.9 })),
      );
      mesh.add(edge);
      if (i !== 1) {
        for (let row = 0; row < (i === 0 ? 3 : 2); row++) {
          const line = new THREE.Mesh(
            keepG(new RoundedBoxGeometry(0.68 - row * 0.13, 0.035, 0.025, 2, 0.015)),
            keepM(
              new THREE.MeshBasicMaterial({
                color: colour,
                transparent: true,
                opacity: 0.85 - row * 0.15,
              }),
            ),
          );
          line.position.set(-0.15, 0.19 - row * 0.16, 0.13);
          mesh.add(line);
        }
        const dot = new THREE.Mesh(
          keepG(new THREE.SphereGeometry(0.045, 12, 8)),
          keepM(new THREE.MeshBasicMaterial({ color: colour })),
        );
        dot.position.set(0.51, 0.34, 0.14);
        mesh.add(dot);
      }
      const base = new THREE.Mesh(
        keepG(new THREE.CylinderGeometry(0.78, 0.86, 0.1, 64)),
        keepM(new THREE.MeshStandardMaterial({ color: '#1d2939', metalness: 0.3, roughness: 0.6 })),
      );
      base.position.y = -0.61;
      group.add(base);
      const ring = new THREE.Mesh(
        keepG(new THREE.TorusGeometry(0.83, 0.014, 8, 64)),
        keepM(new THREE.MeshBasicMaterial({ color: colour, transparent: true, opacity: 0.55 })),
      );
      ring.rotation.x = Math.PI / 2;
      ring.position.y = -0.55;
      group.add(ring);
      rings.push(ring);
    }
    const paths = [new THREE.CubicBezierCurve3(), new THREE.CubicBezierCurve3()];
    const wires = paths.map(() => {
      const geom = keepG(new THREE.BufferGeometry());
      geom.setAttribute('position', new THREE.BufferAttribute(new Float32Array(33 * 3), 3));
      const wire = new THREE.Line(
        geom,
        keepM(new THREE.LineBasicMaterial({ color: '#6d8b9c', transparent: true, opacity: 0.6 })),
      );
      scene.add(wire);
      return wire;
    });
    const packet = new THREE.Mesh(
      keepG(new THREE.SphereGeometry(0.08, 16, 12)),
      keepM(new THREE.MeshBasicMaterial({ color: '#f5e3bd' })),
    );
    packet.visible = false;
    scene.add(packet);
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    let frame = 0;
    let disposed = false;
    let until = 0;
    let beginning = 0;
    let previousRevision = props.revision;
    let previousSpread = -1;
    let previousAngle = NaN;
    let down = { x: 0, y: 0 };
    const positionPaths = () => {
      const spread = live.current.spread;
      groups.forEach((group, i) =>
        group.position.set(
          (i - 1) * (2.55 + spread * 0.8),
          i === 1 ? 0.23 : 0,
          (i === 1 ? -1 : 1) * spread * 0.9,
        ),
      );
      paths.forEach((path, i) => {
        const a = groups[i].position;
        const b = groups[i + 1].position;
        path.v0.copy(a).add(new THREE.Vector3(0.85, 0, 0));
        path.v3.copy(b).add(new THREE.Vector3(-0.85, 0, 0));
        path.v1.copy(path.v0).add(new THREE.Vector3(0.75, 0.55, 0));
        path.v2.copy(path.v3).add(new THREE.Vector3(-0.75, 0.55, 0));
        const attr = wires[i].geometry.getAttribute('position') as THREE.BufferAttribute;
        for (let j = 0; j <= 32; j++) {
          const p = path.getPoint(j / 32);
          attr.setXYZ(j, p.x, p.y, p.z);
        }
        attr.needsUpdate = true;
        wires[i].geometry.computeBoundingSphere();
      });
      previousSpread = spread;
    };
    const render = (now: number) => {
      frame = 0;
      if (disposed) return;
      const current = live.current;
      if (current.reduced) until = 0;
      controls.enabled = current.inspect;
      renderer.domElement.style.touchAction = current.inspect ? 'none' : 'pan-y';
      if (previousSpread !== current.spread) positionPaths();
      if (previousAngle !== current.angle) {
        camera.position.set(Math.sin(current.angle) * 10, 6.2, Math.cos(current.angle) * 10);
        camera.lookAt(0, -0.8, 0);
        controls.target.set(0, -0.8, 0);
        controls.update();
        previousAngle = current.angle;
      }
      if (previousRevision !== current.revision) {
        beginning = now;
        until = current.reduced ? now : now + 1800;
        previousRevision = current.revision;
      }
      const t = Math.max(0, Math.min(1, (now - beginning) / 1800));
      camera.updateMatrixWorld();
      packet.visible = now < until && current.traceEnd > 0;
      if (packet.visible) {
        const progress = Math.min(1.999, t * current.traceEnd);
        const edge = Math.floor(progress);
        packet.position.copy(paths[edge].getPoint(progress % 1));
      }
      groups.forEach((group, i) => {
        const mat = meshes[i].material as THREE.MeshStandardMaterial;
        mat.emissive
          .copy(new THREE.Color(colours[i]))
          .multiplyScalar(i === current.selected ? 0.22 : 0.035);
        (rings[i].material as THREE.MeshBasicMaterial).opacity = i === current.selected ? 1 : 0.32;
      });
      renderer.render(scene, camera);
      if (now < until) request();
    };
    const request = () => {
      if (!frame && !disposed) frame = requestAnimationFrame(render);
    };
    update.current = request;
    const resize = () => {
      const width = Math.max(1, host.clientWidth),
        height = Math.max(1, host.clientHeight - (host.clientWidth < 550 ? 160 : 115));
      const aspect = width / height;
      const halfWidth = width < 550 ? 5.4 : 6.2;
      camera.left = -halfWidth;
      camera.right = halfWidth;
      camera.top = halfWidth / aspect;
      camera.bottom = -halfWidth / aspect;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      request();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    controls.addEventListener('change', request);
    const onDown = (event: PointerEvent) => {
      down = { x: event.clientX, y: event.clientY };
    };
    const onPick = (event: PointerEvent) => {
      if (Math.hypot(event.clientX - down.x, event.clientY - down.y) > 6) return;
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.set(
        ((event.clientX - rect.left) / rect.width) * 2 - 1,
        (-(event.clientY - rect.top) / rect.height) * 2 + 1,
      );
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(meshes, false)[0];
      if (hit) live.current.onSelect(hit.object.userData.index);
    };
    const lost = (event: Event) => {
      event.preventDefault();
      setFailed(true);
      live.current.onReady?.('diagram');
    };
    renderer.domElement.addEventListener('pointerdown', onDown);
    renderer.domElement.addEventListener('pointerup', onPick);
    renderer.domElement.addEventListener('webglcontextlost', lost);
    resize();
    live.current.onReady?.('webgl');
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      controls.removeEventListener('change', request);
      controls.dispose();
      renderer.domElement.removeEventListener('pointerdown', onDown);
      renderer.domElement.removeEventListener('pointerup', onPick);
      renderer.domElement.removeEventListener('webglcontextlost', lost);
      geometry.forEach((item) => item.dispose());
      materials.forEach((item) => item.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
      update.current = null;
    };
  }, [failed]);
  useEffect(() => {
    update.current?.();
  }, [
    props.selected,
    props.revision,
    props.spread,
    props.angle,
    props.inspect,
    props.reduced,
    props.nodes,
    props.traceEnd,
  ]);
  if (failed)
    return <WorldDiagram nodes={props.nodes} selected={props.selected} onSelect={props.onSelect} />;
  return (
    <div ref={root} className="lab-world" data-renderer="webgl">
      {props.nodes.map((node, index) => (
        <button
          key={index}
          className="lab-world-label"
          style={
            {
              left: `${((index + 0.5) / 3) * 100}%`,
              '--node-colour': colours[index],
            } as CSSProperties
          }
          onClick={() => props.onSelect(index)}
          aria-pressed={props.selected === index}
        >
          <span>
            {String(index + 1).padStart(2, '0')} · {node.runs}
          </span>
          <strong>{node.name}</strong>
          <output>{node.value}</output>
        </button>
      ))}
    </div>
  );
}
