import * as THREE from 'three';

const loader = new THREE.TextureLoader();

export function paintTexture (texturePath: string, obj: THREE.Object3D) {
  const texture = loader.load(texturePath);
  texture.colorSpace = THREE.SRGBColorSpace;
  const mesh = obj as THREE.Mesh;
  mesh.material = new THREE.MeshStandardMaterial({ map: texture });
}
