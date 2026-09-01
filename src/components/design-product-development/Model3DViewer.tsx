import { Suspense, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, useGLTF } from '@react-three/drei'
import * as THREE from 'three'

interface Model3DViewerProps {
  modelPath: string
  label: string
}

// Model loading wrapper component
const ModelContent = ({ modelPath }: { modelPath: string }) => {
  const groupRef = useRef<THREE.Group>(null)
  const fileExtension = modelPath.split('.').pop()?.toLowerCase()

  // For GLB files, use useGLTF hook
  let gltf: any = null
  if (fileExtension === 'glb' || fileExtension === 'gltf') {
    try {
      gltf = useGLTF(modelPath)
    } catch (error) {
      console.error('Error loading GLTF model:', error)
    }
  }

  // Load model based on file type
  useEffect(() => {
    if (!modelPath || !groupRef.current) return

    const loadModel = async () => {
      try {
        let model: THREE.Group | undefined

        if (fileExtension === 'glb' || fileExtension === 'gltf') {
          // Use the gltf hook result
          if (gltf && gltf.scene) {
            model = gltf.scene.clone()
          }
        } else if (fileExtension === 'fbx') {
          // Dynamically import FBXLoader
          const { FBXLoader } = await import('three/examples/jsm/loaders/FBXLoader.js')
          const loader = new FBXLoader()
          model = await loader.loadAsync(modelPath)
        } else if (fileExtension === 'obj') {
          // Dynamically import OBJLoader
          const { OBJLoader } = await import('three/examples/jsm/loaders/OBJLoader.js')
          const loader = new OBJLoader()
          model = (await loader.loadAsync(modelPath)) as THREE.Group
        }

        if (model && groupRef.current) {
          // Clear previous content
          while (groupRef.current.children.length > 0) {
            groupRef.current.remove(groupRef.current.children[0])
          }

          // Center and scale the model
          const box = new THREE.Box3().setFromObject(model)
          const center = box.getCenter(new THREE.Vector3())
          const size = box.getSize(new THREE.Vector3())
          const maxDim = Math.max(size.x, size.y, size.z)
          const scale = 2 / maxDim

          model.position.sub(center.multiplyScalar(scale))
          model.scale.multiplyScalar(scale)

          groupRef.current.add(model)
        }
      } catch (error) {
        console.error('Error loading 3D model:', error)
      }
    }

    loadModel()
  }, [modelPath, fileExtension, gltf])

  // Auto-rotate on initial load (subtle)
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.3) * 0.2
    }
  })

  return (
    <>
      <ambientLight intensity={1.2} />
      <directionalLight position={[5, 10, 7]} intensity={0.8} />
      <group ref={groupRef} />
      <OrbitControls
        enablePan={false}
        enableZoom={true}
        zoomSpeed={0.5}
        autoRotate={false}
        autoRotateSpeed={4}
        enableDamping={true}
        dampingFactor={0.05}
      />
    </>
  )
}

// Fallback component while loading
const ModelLoader = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
        backgroundColor: '#ffffff',
        color: '#999',
        fontSize: '14px',
      }}
    >
      Loading model...
    </div>
  )
}

const Model3DViewer = ({ modelPath, label }: Model3DViewerProps) => {
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
          camera={{
            position: [0, 0, 2.5],
            fov: 50,
            near: 0.1,
            far: 1000,
          }}
          style={{
            width: '100%',
            height: '100%',
          }}
        >
          <color attach="background" args={['#ffffff']} />
          <ModelContent modelPath={modelPath} />
        </Canvas>
      </Suspense>
    </div>
  )
}

export default Model3DViewer
