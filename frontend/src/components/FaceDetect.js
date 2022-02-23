import React, { useRef } from 'react'
import styles from './FaceDetect.module.css';

const FaceDetect = () => {
    const imgRef = useRef();
    const canvasRef = useRef();

    return (
        <>
            <img src="" alt="" ref={imgRef} />
            <canvas ref={canvasRef} />
        </>
    )
}

export default FaceDetect