import React, { useEffect, useMemo } from 'react';
import Slider from 'react-slick';
import NextArrow from '~/components/elements/carousel/NextArrow';
import PrevArrow from '~/components/elements/carousel/PrevArrow';
import Link from 'next/link';
import Promotion from '~/components/elements/media/Promotion';
import useBanner from '~/hooks/useBanner';
// import { getStrapiImageURL } from '~/services/strapiServices/image/getStrapiImageService';

const BANNER_SLUGS = ['home-banner', 'home-right-banner'];

const HomeDefaultBanner = () => {
    const { loading, banners, getBannersBySlugs } = useBanner();

    useEffect(() => {
        getBannersBySlugs(BANNER_SLUGS);
    }, []);

    const primaryBannerItems = useMemo(() => {
        if (loading) return [];
        if (!banners) return [];
        const primaryBanner = banners.find(
            (item) => item.attributes.slug === 'home-banner'
        );

       
    }, [loading, banners]);

    const secondBannerItems = [
        '/static/ads2.png',
        '/static/ads3.png',
    ]



    const carouselSetting = {
        dots: false,
        infinite: true,
        speed: 750,
        fade: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
    };

    const mainCarouselItems = useMemo(() => {
        return (
            <div className="ps-carousel">
                    <div className="slide-item" >
                        <Link
                            href={'/shop'}
                            className="ps-banner-item--default bg--cover"
                            style={{
                                backgroundImage: "url(`/static/ads1.png`)",
                            }}
                        />
                    </div>
            </div>
        );
    }, [loading, primaryBannerItems]);

    // Views

    return (
        <div className="ps-home-banner ps-home-banner--1">
            <div className="ps-container">
                <div className="ps-section__left">   <div className="">
                    <div className="slide-item" >
                        <div
                            // href={'/shop'}
                            className=""
                            // style={{
                            //     backgroundImage: "url(`/static/slide1.jpg`)",
                            // }}
                        >
                            <img src='/static/ads1.png' alt='' />
                        </div>
                    </div>
            </div></div>
                <div className="ps-section__right">
                    { secondBannerItems.map((item, index) => (
                              <Promotion
                                  key={index}
                                  link="/shop"
                                  image={item}
                              />
                          ))
                        }
                </div>
            </div>
        </div>
    );
};

export default HomeDefaultBanner;
