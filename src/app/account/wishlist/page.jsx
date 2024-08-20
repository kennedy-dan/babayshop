'use client';
import React from 'react';
import BreadCrumb from '~/components/elements/BreadCrumb';
import Wishlist from '~/components/partials/account/Wishlist';
import FooterDefault from '~/components/shared/footers/FooterDefault';
import PageContainer from '~/components/layouts/PageContainer';
import Newletters from '~/components/partials/commons/Newletters';

export default function Page() {
    const breadCrumb = [
        {
            text: 'Home',
            url: '/',
        },
        {
            text: 'Wishlist',
        },
    ];

    return (
        <PageContainer footer={<FooterDefault />} title="Wishlist">
            <div className="ps-page--simple">
                <BreadCrumb breacrumb={breadCrumb} />
                <div className="ps-section--shopping ps-whishlist">
            <div className="container">
                <div className="mb-6">
                    <h3 className="text-[26px] text-black ">Favorite</h3>
                </div>
                <Wishlist />
                </div>
                </div>
            </div>
            <Newletters layout="container" />
        </PageContainer>
    );
}
