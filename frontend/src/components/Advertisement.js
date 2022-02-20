import React from 'react'
import { Carousel } from 'react-responsive-carousel';

const Advertisement = () => {
    return (
        <Carousel>
            <div>
                <img src="/assets/ad1.jpg" />
            </div>
            <div>
                <img src="/assets/ad3.jpg" />
            </div>
            <div>
                <img src="/assets/ad2.jpg" />
            </div>
        </Carousel>
    )
}

export default Advertisement