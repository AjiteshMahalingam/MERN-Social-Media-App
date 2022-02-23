import React from 'react'
import Carousel from 'react-elastic-carousel';
import styles from './Advertisement.module.css';

const Advertisement = () => {
    const items = [
        { id: 1, src: "/assets/ad1.jpg" },
        { id: 2, src: "/assets/ad2.jpg" },
        { id: 3, src: "/assets/ad3.jpg" }
    ]
    return (
        <Carousel className={styles['container']}>
            {items.map(item => (
                <div key={item.id}>
                    <img src={item.src} alt="" />
                </div>
            ))}
        </Carousel>
    )
}

export default Advertisement