import React, { useEffect } from 'react';
import Logo from '~/components/elements/common/Logo';
import SearchHeader from '~/components/shared/headers/modules/SearchHeader';
import DesktopNavigation from '~/components/shared/navigation/DesktopNavigation';
import HeaderActions from '~/components/shared/headers/modules/HeaderActions';
import { stickyHeader } from '~/utilities/common-helpers';
import MenuCategoriesDropdown from '~/components/shared/menus/MenuCategoriesDropdown';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';

import {
    getcategories,
    getCategoriesWithProducts,
    addtocart,
    getAllProducts,
} from '~/redux/features/productSlice';
const HeaderDefault = () => {
    const dispatch = useDispatch();
    const { getcats, categoriesWithProducts, allproducts } = useSelector(
        (state) => state.product
    );
    const catsData = getcats?.results?.data;

    useEffect(() => {
        dispatch(getcategories());
    }, []);

    useEffect(() => {
        if (process.browser) {
            window.addEventListener('scroll', stickyHeader);
        }
    }, []);

    return (
        <header
            className="header header--1"
            data-sticky="true"
            id="headerSticky">
            <div className="header__top">
                <div className="ps-container">
                    <div className="header__left">
                        <div>
                            <img
                                src="/static/logo.png"
                                className="w-32 h-20 "
                                alt=""
                            />
                        </div>
                        <MenuCategoriesDropdown />
                    </div>
                    <div className="header__center">
                        <SearchHeader />
                    </div>
                    <div className="header__right">
                        <HeaderActions />
                    </div>
                </div>
                <div
              
              className="w-full mt-4 bg-white space-x-5 pt-3 items-center flex ps-container">
              {catsData?.slice(0,8)?.map((items, index) => (
                  <div key={index} className=" ">
                      <div className="">
                          <Link
                              href={`/shop/${items?.id}`}
                              // className="ps-block__overlay"
                          />

                          <p className="text-center">{items?.name}</p>
                      </div>
                  </div>
              ))}
          </div>
            </div>
            {/* <DesktopNavigation /> */}
           
        </header>
    );
};

export default HeaderDefault;
