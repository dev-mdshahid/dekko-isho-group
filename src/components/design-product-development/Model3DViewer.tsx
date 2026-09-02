import { Suspense, useEffect, useRef } from 'react'

import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'

import * as THREE from 'three'

interface Model3DViewerProps {
  modelPath: string
  label: string
  color?: ProductModelColor
}

type ProductModelColor = 'default' | 'cyan' | 'magenta' | 'yellow'

type MaterialWithColor = THREE.Material & {
  color?: THREE.Color
}

const PRODUCT_MODEL_COLORS: Record<Exclude<ProductModelColor, 'default'>, string> = {
  cyan: '#00d5ff',
  magenta: '#ff2fc3',
  yellow: '#ffd91a',
}

const cloneMaterialWithOriginalColor = (material: THREE.Material): THREE.Material => {
  const clonedMaterial = material.clone() as MaterialWithColor

  if (clonedMaterial.color) {
    clonedMaterial.userData.dpdOriginalColor = clonedMaterial.color.clone()
  }

  return clonedMaterial
}

const cloneMeshMaterials = (mesh: THREE.Mesh) => {
  if (Array.isArray(mesh.material)) {
    mesh.material = mesh.material.map(cloneMaterialWithOriginalColor)
    return
  }

  mesh.material = cloneMaterialWithOriginalColor(mesh.material)
}

const applyModelColor = (model: THREE.Object3D, color: ProductModelColor) => {
  model.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return

    const materials = Array.isArray(child.material) ? child.material : [child.material]

    materials.forEach((material) => {
      const materialWithColor = material as MaterialWithColor

      if (!materialWithColor.color) return

      const originalColor = materialWithColor.userData.dpdOriginalColor as
        | THREE.Color
        | undefined

      if (color === 'default') {
        if (originalColor) {
          materialWithColor.color.copy(originalColor)
        }

        return
      }

      materialWithColor.color.set(PRODUCT_MODEL_COLORS[color])
    })
  })
}

// Model loading wrapper component
const ModelContent = ({
  modelPath,
  color = 'default',
}: {
  modelPath: string
  color?: ProductModelColor
}) => {
  const groupRef = useRef<THREE.Group>(null)
  const latestColorRef = useRef<ProductModelColor>(color)

  const fileExtension = modelPath.split('.').pop()?.toLowerCase()

  // For GLB / GLTF files
  let gltf: any = null

  if (fileExtension === 'glb' || fileExtension === 'gltf') {
    try {
      gltf = useGLTF(modelPath)
    } catch (error) {
      console.error('Error loading GLTF model:', error)
    }
  }

  useEffect(() => {
    latestColorRef.current = color

    if (groupRef.current) {
      applyModelColor(groupRef.current, color)
    }
  }, [color])

  useEffect(() => {
    if (!modelPath || !groupRef.current) return

    const loadModel = async () => {
      try {
        let model: THREE.Group | undefined

        if (fileExtension === 'glb' || fileExtension === 'gltf') {
          if (gltf?.scene) {
            model = gltf.scene.clone(true)
          }
        } else if (fileExtension === 'fbx') {
          const { FBXLoader } = await import(
            'three/examples/jsm/loaders/FBXLoader.js'
          )

          const loader = new FBXLoader()
          model = await loader.loadAsync(modelPath)
        } else if (fileExtension === 'obj') {
          const { OBJLoader } = await import(
            'three/examples/jsm/loaders/OBJLoader.js'
          )

          const loader = new OBJLoader()
          model = (await loader.loadAsync(modelPath)) as THREE.Group
        }

        if (!model || !groupRef.current) return

        // Clear previous model
        while (groupRef.current.children.length > 0) {
          groupRef.current.remove(groupRef.current.children[0])
        }

        // Get original bounding box
        const box = new THREE.Box3().setFromObject(model)

        const size = box.getSize(new THREE.Vector3())

        const maxDim = Math.max(size.x, size.y, size.z)

        // Scale model
        const scale = 2 / maxDim

        model.scale.multiplyScalar(scale)

        // Recalculate bounding box after scaling
        const scaledBox = new THREE.Box3().setFromObject(model)
        const scaledCenter = scaledBox.getCenter(new THREE.Vector3())

        // Center horizontally and depth-wise
        model.position.x -= scaledCenter.x
        model.position.z -= scaledCenter.z

        // Put the bottom of the model just above the floor
        const floorY = -1

        const updatedBox = new THREE.Box3().setFromObject(model)

        model.position.y += floorY - updatedBox.min.y + 0.03

        // Enable shadows if you later add shadow receiving surface
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true
            child.receiveShadow = true
            cloneMeshMaterials(child)
          }
        })

        applyModelColor(model, latestColorRef.current)

        groupRef.current.add(model)
      } catch (error) {
        console.error('Error loading 3D model:', error)
      }
    }

    loadModel()
  }, [modelPath, fileExtension, gltf])

  // Subtle automatic movement
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y =
        Math.sin(clock.elapsedTime * 0.3) * 0.2
    }
  })

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={1.2} />

      <directionalLight
        position={[5, 10, 7]}
        intensity={0.8}
      />

      {/* 3D model */}
      <group ref={groupRef} />

      {/* Bottom surface grid */}
      <gridHelper
        args={[
          8,          // grid total size
          24,         // divisions
          '#707070',  // center grid lines
          '#b5b5b5',  // normal grid lines
        ]}
        position={[0, -1, 0]}
      />

      {/* Camera controls */}
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        zoomSpeed={0.5}
        autoRotate={false}
        enableDamping={true}
        dampingFactor={0.05}
        target={[0, -0.05, 0]}
      />
    </>
  )
}

// Fallback while loading
const ModelLoader = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
        backgroundColor: '#909090',
        color: '#ffffff',
        fontSize: '14px',
      }}
    >
      Loading model...
    </div>
  )
}

const Model3DViewer = ({
  modelPath,
  label,
  color = 'default',
}: Model3DViewerProps) => {
  if (!modelPath) {
    return (
      <div
        className="dpd-product-range-card-placeholder"
        aria-label={`3D model placeholder for ${label}`}
      />
    )
  }

  return (
    <div
      className="dpd-product-range-card-3d-viewer"
      aria-label={`3D model viewer for ${label}`}
    >
      <Suspense fallback={<ModelLoader />}>
        <Canvas
          dpr={[1, 2]}
          shadows
          camera={{
            // Slightly elevated camera so the floor grid is visible
            position: [0, 0.6, 3.2],
            fov: 45,
            near: 0.1,
            far: 1000,
          }}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '1rem',
          }}
        >
          {/* Canvas background */}
          <color attach="background" args={['#909090']} />

          <ModelContent modelPath={modelPath} color={color} />
        </Canvas>
      </Suspense>
    </div>
  )
}

export default Model3DViewer
