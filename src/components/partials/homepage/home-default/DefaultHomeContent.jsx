'use client';
import React from 'react';
import HomeDefaultBanner from '~/components/partials/homepage/home-default/HomeDefaultBanner';
import SiteFeatures from '~/components/partials/homepage/home-default/SiteFeatures';
import HomeDefaultDealOfDay from '~/components/partials/homepage/home-default/HomeDefaultDealOfDay';
import HomeAdsColumns from '~/components/partials/homepage/home-default/HomeAdsColumns';
import HomeDefaultTopCategories from '~/components/partials/homepage/home-default/HomeDefaultTopCategories';
import HomeDefaultProductListing from '~/components/partials/homepage/home-default/HomeDefaultProductListing';
import HomeAds from '~/components/partials/homepage/home-default/HomeAds';
import DownLoadApp from '~/components/partials/commons/DownLoadApp';
import NewArrivals from '~/components/partials/homepage/home-default/NewArrivals';
import Newletters from '~/components/partials/commons/Newletters';

export default function DefaultHomeContent() {
    return (
        <main id="homepage-1">
            {/* <HomeDefaultBanner /> */}
            {/* <HomeAdsColumns /> */}

            {/* <SiteFeatures /> */}
            {/* <HomeDefaultDealOfDay collectionSlug="deals-of-the-day" /> */}

            <HomeDefaultTopCategories />
           
            {/* <HomeAds /> */}
            {/* <DownLoadApp /> */}
            {/* <NewArrivals collectionSlug="hot-new-arrivals" /> */}
            {/* <Newletters /> */}
        </main>
    );
}
