import React, { useEffect, useState } from 'react';
import Logo from '~/components/elements/common/Logo';
import SearchHeader from '~/components/shared/headers/modules/SearchHeader';
import DesktopNavigation from '~/components/shared/navigation/DesktopNavigation';
import HeaderActions from '~/components/shared/headers/modules/HeaderActions';
import { stickyHeader } from '~/utilities/common-helpers';
import MenuCategoriesDropdown from '~/components/shared/menus/MenuCategoriesDropdown';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { IoIosMenu } from 'react-icons/io';
import { Drawer, Space } from 'antd';
import { MdOutlineCancel } from 'react-icons/md';
import { Dropdown } from 'antd';
import { useRouter } from 'next/navigation';
import { MdArrowDropDown } from 'react-icons/md';

import {
    getcategories,
    getCategoriesWithProducts,
    addtocart,
    getAllProducts,
} from '~/redux/features/productSlice';
import { logOutCustomer } from '~/redux/features/authSlice';
const HeaderDefault = () => {
    const dispatch = useDispatch();
    const router = useRouter();

    const [openadv, setOpenAdv] = useState(false);
    const { user } = useSelector((state) => state.auth);

    const { getcats, categoriesWithProducts, allproducts } = useSelector(
        (state) => state.product
    );
    const catsData = getcats?.results?.data;
    const [advplacement, setadvPlacement] = useState('left');

    useEffect(() => {
        dispatch(getcategories());
    }, []);

    const logOut = () => {
        dispatch(logOutCustomer());
    };

    useEffect(() => {
        if (process.browser) {
            window.addEventListener('scroll', stickyHeader);
        }
    }, []);
    const handleMenuClick = (item) => {
        router.push(`/shop/${item.id}`);
    };

    const showDrawerAdv = () => {
        setOpenAdv(true);
    };

    const onCloseadv = () => {
        setOpenAdv(false);
    };

    const menuItems = catsData?.map((item) => ({
        key: item?.id,
        label: item?.name,
        onClick: () => handleMenuClick(item),
    }));

    return (
        <header
            className="header header--1 pb-16"
            data-sticky="true"
            id="headerSticky">
            <div className="header__top ">
                <div className="ps-container items-center ">
                    <div className="header__left">
                        <Link href="/">
                            <img
                                src="/static/logo.png"
                                className="md:w-40 md:h-28 mb-9 md:pb-0 md:block hidden"
                                alt=""
                            />
                              <img
                                src="/static/logomob.png"
                                className=" md:hidden block"
                                alt=""
                            />
                        </Link>
                        {/* <MenuCategoriesDropdown /> */}
                    </div>
                    <div className="header__center lg:block hidden">
                        <SearchHeader />
                    </div>
                    <div className="header__right  ">
                        <HeaderActions showDrawerAdv={showDrawerAdv} />
                    </div>
                </div>

                <div className="bg-[#fffff0] py-3 px-[30px] md:hidden block mt-8 ">
                    <Dropdown
                        menu={{
                            items: menuItems,
                        }}>
                        <a onClick={(e) => e.preventDefault()}>
                            <Space>
                                <div className="text-black ">Categories</div>
                                <MdArrowDropDown />
                            </Space>
                        </a>
                    </Dropdown>
                </div>
                <div className='mx-auto  overflow-x-scroll scrollcont'  >
                <div className=' w-[310%] '>
                <div className="w-full mt-4 bg-[#fffff0] space-x-5 pt-3 items-center md:justify-between hidden md:flex px-[30px] ">
                    {catsData?.map((items, index) => (
                        <div key={index} className=" ">
                            <div className="">
                                <Link href={`/shop/${items?.id}`}>
                                    <p className="text-center">{items?.name}</p>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
                </div>
                </div>
            </div>
            <div className="header__center lg:hidden mx-[30px] mt-10 block">
                        <SearchHeader />
                    </div>
            {/* <DesktopNavigation /> */}
            <Drawer
                // title="WeOut"
                placement={advplacement}
                closable={false}
                onClose={onCloseadv}
                open={openadv}
                key={advplacement}
                extra={
                    <Space>
                        <button onClick={onCloseadv}>
                            <MdOutlineCancel className="w-8 h-8" />
                        </button>
                    </Space>
                }>
                <section className="font-poppins space-y-9">
                    <div className="flex justify-end ">
                        <button onClick={onCloseadv}>
                            <MdOutlineCancel className="w-8 h-8" />
                        </button>
                    </div>
                    <div>
                        <img
                            src="/images/navbarlogo.png"
                            alt=""
                            className=" "
                        />
                    </div>
                    <div className="space-y-6 font-[500] text-[19px]">
                     

                        <div>
                            <Link href="/contact">
                                <div className="text-black">Contact us</div>
                            </Link>
                        </div>

                        {/* <div>
                            <Link href="/location">
                                <div className="text-black">Location</div>
                            </Link>
                        </div> */}
                    </div>

                    {!user && (
                        <div>
                            <div>
                                <Link href="/account/login">
                                    <div className="text-black font-[500] text-[19px]">
                                        Login
                                    </div>
                                </Link>
                            </div>
                        </div>
                    )}

                    {user && (
                        <div className="space-y-6 font-[500] text-[19px]">
                            <div>
                                <Link href="/account">
                                    <div className="flex space-x-3">
                                        <img src="/images/profile.png" alt="" />
                                        <p>My Profile</p>
                                    </div>
                                </Link>
                            </div>

                            <div>
                                <Link href="/account/wishlist">
                                    {' '}
                                    <div className="flex my-4 space-x-3">
                                        <img src="/images/fav.png" alt="" />
                                        <p>Favorite</p>
                                    </div>
                                </Link>
                            </div>

                            <div>
                                <Link href="/account/order-history">
                                    <div className="flex space-x-3">
                                        <img src="/images/ord.png" alt="" />
                                        <p>Orders History</p>
                                    </div>
                                </Link>
                            </div>

                            <div className="h-[1px] bg-gray-400 w-full mt-4 "></div>

                            <div
                                onClick={logOut}
                                className="flex mt-4 space-x-3 cursor-pointer ">
                                <img
                                    src="/images/ord.png"
                                    alt=""
                                    className="opacity-0"
                                />
                                <p>Logout</p>
                            </div>
                        </div>
                    )}
                </section>
            </Drawer>
        </header>
    );
};

export default HeaderDefault;
