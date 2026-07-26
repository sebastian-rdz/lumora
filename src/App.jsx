import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import './App.css'

function Seat() {
  return (
    <group>
      <mesh position={[0, 0.25, 0]}>
        <boxGeometry args={[0.5, 0.1, 0.5]} />
        <meshStandardMaterial color="#7a1620" />
      </mesh>
      <mesh position={[0, 0.55, 0.2]} rotation={[-0.15, 0, 0]}>
        <boxGeometry args={[0.5, 0.6, 0.1]} />
        <meshStandardMaterial color="#7a1620" />
      </mesh>
    </group>
  )
}

function App() {
  return (
    <div className="app">
      <Canvas camera={{ position: [1.5, 1.5, 2.5], fov: 50 }}>
        <color attach="background" args={['#0d0a0f']} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 4, 2]} intensity={1.2} />
        <Seat />
        <OrbitControls />
      </Canvas>
    </div>
  )
}

export default App
