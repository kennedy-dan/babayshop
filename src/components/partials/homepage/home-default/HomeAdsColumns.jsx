import React, { useEffect, useMemo } from 'react';
import Promotion from '~/components/elements/media/Promotion';
import useBanner from '~/hooks/useBanner';
// import { getStrapiImageURL } from '~/services/strapiServices/image/getStrapiImageService';

const BANNER_SLUGS = ['home-ads'];

const HomeAdsColumns = () => {
    const { loading, banners, getBannersBySlugs } = useBanner();
    const bann = ['/static/slide1.jpg','/static/slide2.jpg','/static/slide3.jpg',]

    useEffect(() => {
        getBannersBySlugs(BANNER_SLUGS);
    }, []);

    const bannerItems = useMemo(() => {
        if (loading) return [];
        if (!banners) return [];
        const items = banners.find(
            (item) => item.attributes.slug === 'home-ads'
        );

   
    }, [loading, banners]);

    return (
        <div className="ps-home-ads">
            <div className="ps-container">
                <div className="row">
                    {bann.map((item, index) => (
                        <div
                            className="col-xl-4 col-lg-4 col-md-12 col-sm-12 col-12"
                            key={index}>
                            <Promotion link="/shop" image={item} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default HomeAdsColumns;
