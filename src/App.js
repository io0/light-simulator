import * as THREE from 'three';
import { Stats, OrbitControls } from '@react-three/drei';
import Box from './components/Box';
import React, { useLayoutEffect, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import linspace from '@stdlib/array-linspace';

function Line({ start, end }) {
    const ref = useRef();
    useLayoutEffect(() => {
        ref.current.geometry.setFromPoints(
            [start, end].map((point) => new THREE.Vector3(...point))
        );
    }, [start, end]);
    return (
        <line ref={ref}>
            <bufferGeometry />
            <lineBasicMaterial color="hotpink" />
        </line>
    );
}
const N_SEGMENTS = 50;
const v = 2;
const vecFunction = (x, t) => {
    return Math.sin(x + v * t);
};
function LineSegments({ z }) {
    const mesh = useRef();
    const START = new Date();
    const xArr = Array.from(linspace(-5, 5, N_SEGMENTS));

    useLayoutEffect(() => {
        mesh.current.geometry.setFromPoints(
            xArr
                .map((x) => {
                    return [
                        new THREE.Vector3(x, 0, 0),
                        new THREE.Vector3(x, 1, 0),
                    ];
                })
                .flat()
        );
    }, []);
    useFrame(() => {
        const current = new Date();
        let timeDiff = current - START; //in ms
        timeDiff /= 1000;
        mesh.current.geometry.setFromPoints(
            xArr
                .map((x) => {
                    return [
                        new THREE.Vector3(x, 0, z),
                        new THREE.Vector3(x, vecFunction(x, timeDiff), z),
                    ];
                })
                .flat()
        );
        // mesh.current.rotation.x = mesh.current.rotation.y += 0.01
    });
    return (
        <lineSegments ref={mesh}>
            <bufferGeometry />
            <lineBasicMaterial color="hotpink" />
        </lineSegments>
    );
}
function VectorSegments() {
    // useFrame((_, delta) => {
    //   mesh.current.rotation.x

    //   mesh.current.rotation.y += 0.01
    // });

    const vecFunction = (x) => {
        return Math.sin(x / 10);
    };
    return (
        <>
            {[-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5].map((x) => (
                <Line start={[x, 0, 0]} end={[x, vecFunction(x), 0]} />
            ))}
        </>
    );
}

function App(props) {
    // // This reference will give us direct access to the mesh
    // const mesh = useRef();

    // // Rotate mesh every frame, this is outside of React without overhead
    // useFrame(() => (mesh.current.rotation.x = mesh.current.rotation.y += 0.01));
    const arr = Array.from(linspace(0, 5, 10));
    console.log(arr);

    return (
        <Canvas colorManagement>
            <fog attach="fog" color="black" near={4} far={15} />
            <OrbitControls />
            <Stats />
            <ambientLight />
            <pointLight position={[10, 10, 10]} />

            {/* <VectorSegments /> */}
            {[1, 2, 3, -4, -6, -9].map((z) => (
                <LineSegments z={z} />
            ))}
            {/* <Box position={[-1.2, 0, 0]} />
    <Box position={[1.2, 0, 0]} /> */}
        </Canvas>
    );
}
export default App;
