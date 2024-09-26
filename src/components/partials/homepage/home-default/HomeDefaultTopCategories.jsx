import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import {
    getcategories,
    getCategoriesWithProducts,
    addtocart,
    getAllProducts,
    favAction,
    getSingleCats,
    getFavorites,
    getcartData,
} from '~/redux/features/productSlice';
import { FaShoppingCart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Carousel as AntCarousel, Select, ConfigProvider } from 'antd';
import { IoIosArrowForward, IoIosArrowBack } from 'react-icons/io';

import { CiShoppingCart } from 'react-icons/ci';
import { motion } from 'framer-motion';
import { MdOutlineFavorite, MdFavorite } from 'react-icons/md';
import { MdFavoriteBorder } from 'react-icons/md';
import Image from 'next/image';

const CustomArrow = ({ type, onClick }) => (
    <div
        onClick={onClick}
        style={{
            background: 'rgba(0, 0, 0, 0.5)',
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '40px',
            height: '40px',
            position: 'absolute',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 2,
            cursor: 'pointer',
            [type === 'prev' ? 'left' : 'right']: '10px',
        }}>
        {type === 'prev' ? (
            <IoIosArrowBack style={{ color: 'white', fontSize: '20px' }} />
        ) : (
            <IoIosArrowForward style={{ color: 'white', fontSize: '20px' }} />
        )}
    </div>
);

const HomeDefaultTopCategories = () => {
    const dispatch = useDispatch();
    const { getcats, categoriesWithProducts, allproducts, getpages } =
        useSelector((state) => state.product);
    const [loadingFavorites, setLoadingFavorites] = useState({});
    const { token } = useSelector((state) => state.auth);
    const [isMobile, setIsMobile] = useState(false);
    const [showActions, setShowActions] = useState(false);
    const [activeItem, setActiveItem] = useState(null);

    const allp = allproducts?.results?.data?.data?.data;
    const pages = getpages?.results?.data?.data;
    const homePage = pages?.find((page) => page?.page_title === 'home page');
    const sectionpage = homePage?.page_sections?.find(
        (page) => page?.section_title === 'home page'
    );

    console.log(pages);
    console.log(homePage);
    console.log(sectionpage);
    useEffect(() => {
        dispatch(getcategories());
        dispatch(getAllProducts());
    }, []);
    useEffect(() => {
        dispatch(getCategoriesWithProducts());
    }, []);

    const handleFavoriteClick = async (id, isFavorite, catsid) => {
        if (!token) {
            toast.info('Login to add to favorite');
            router.push('/account/login');
            return;
        }
        setLoadingFavorites((prev) => ({ ...prev, [id]: true }));
        const action = isFavorite ? 'remove' : 'add';
        try {
            await dispatch(favAction({ id, action })).unwrap();
            toast.success(
                `Product ${action === 'add' ? 'added to' : 'removed from'} favorites`
            );
            dispatch(getFavorites()); // Refresh the favorites list

            dispatch(getSingleCats(catsid));
            dispatch(getAllProducts());
            dispatch(getCategoriesWithProducts());
        } catch (error) {
            toast.error(`Failed to ${action} favorite: ${error.message}`);
        } finally {
            setLoadingFavorites((prev) => ({ ...prev, [id]: false }));
        }
    };

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.matchMedia('(max-width: 768px)').matches);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleTouchStart = (id) => {
        if (isMobile) {
            setActiveItem(id);
        }
    };

    const handleTouchEnd = () => {
        if (isMobile) {
            // Keep the actions visible for a short time after touch
            setTimeout(() => setActiveItem(null), 3000);
        }
    };

    const addToCart = (id) => {
        const data = {
            product_id: id,
            quantity: 1,
        };
        dispatch(addtocart(data)).then(() => {
            dispatch(getcartData());
        });
        // toast.success('done');
    };
    const catsData = getcats?.results?.data;

    return (
        <div className="ps-top-categories">
            <div className="ps-container">
                <AntCarousel
                    arrows
                    autoplay
                    effect="fade"
                    speed={1500}
                 >
                    {sectionpage?.section_files?.map((img, index) => (
                        <div
                            key={index}
                            className="w-full md:h-screen h-[250px]">
                            <Image
                                objectFit="cover"
                                height={2500}
                                width={2500}
                                src={img?.url}
                                priority
                                alt=""
                                className="w-full h-full md:object-cover  object-center "
                            />
                        </div>
                    ))}
                </AntCarousel>

                <p className="mt-20 font-bold md:text-[22] text-[16px] text-black mb-3 ">
                    Top categories{' '}
                </p>
                {/* <h3>{homePage?.page_title} </h3> */}
                <div className="grid lg:grid-cols-6 md:grid-cols-3 grid-cols-2 gap-5">
                    {catsData?.slice(0, 6)?.map((items, index) => (
                        <div key={index} className="flex flex-col items-center">
                            <div className="">
                                <Link
                                    href={`/shop/${items?.id}`}
                                    // className="ps-block__overlay"
                                >
                                    <img
                                        src={
                                            items?.image_url
                                                ? items?.image_url
                                                : '/static/cats.png'
                                        }
                                        alt="martfury"
                                        className="md:h-[190px] h-[150px] rounded-2xl"
                                    />
                                    <div>
                                        <p className="text-center md:text-[14px] text-[13px] ">
                                            {items?.name}
                                        </p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-40">
                    <div>
                        <p className="mt-20 font-bold md:text-[22] text-[16px] text-black mb-4 ">
                            New Arrival
                        </p>
                    </div>
                    <div className=" grid md:grid-cols-4 grid-cols-2  gap-4 ">
                        {allp?.slice(0, 4)?.map((data, index) => (
                            <motion.div
                                key={data.id}
                                onTouchStart={() => handleTouchStart(data?.id)}
                                onTouchEnd={handleTouchEnd}
                                whileHover={isMobile ? {} : 'hover'}
                                initial="rest"
                                animate="rest"
                                className="  ">
                                <div className="relative  ">
                                    <div style={{background:'white'}} className="justify-center items-center flex rounded-3xl bg-white  md:p-8 p-3 hover:bg-gray-800 mb-2 md:mb-4 ">
                                        <Link href={`/product/${data?.id}`}>
                                            <Image
                                                src={
                                                    data?.image_url
                                                        ? data?.image_url
                                                        : '/static/toy.jpg'
                                                }
                                                width={500}
                                                height={500}
                                                alt=""
                                                className="md:h-[250px] w-full h-[150px] object-contain sm:object-cover rounded-lg cursor-pointer"
                                            />
                                        </Link>

                                        <motion.div
                                            className="flex absolute bottom-0 left-0 justify-center right-0  bg-opacity-80 p-2"
                                            initial={{
                                                opacity: 0,
                                                y: '10%',
                                            }}
                                            variants={{
                                                rest: {
                                                    opacity: 0,
                                                    y: '10%',
                                                },
                                                hover: {
                                                    y: -37,
                                                    opacity: 1,
                                                },
                                            }}
                                            animate={
                                                isMobile &&
                                                activeItem === data?.id
                                                    ? {
                                                          opacity: 1,
                                                          y: -37,
                                                      }
                                                    : {}
                                            }
                                            // animate='rest'
                                            // animate={showActions || !isMobile ? "hover" : "rest"}
                                            transition={{
                                                duration: 0.3,
                                            }}>
                                            <div
                                                onClick={() =>
                                                    addToCart(data?.id)
                                                }
                                                className="cursor-pointer mr-2 h-14 w-14 flex justify-center items-center rounded-full bg-gray-600 ">
                                                <img
                                                    src="/static/cartic.png"
                                                    alt=""
                                                />
                                                {/* <CiShoppingCart size={24} /> */}
                                            </div>
                                            <div
                                                className="cursor-pointer bg-gray-600 h-14 w-14 flex justify-center items-center  rounded-full"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleFavoriteClick(
                                                        data?.id,
                                                        data?.is_favorite,
                                                        data?.category?.id
                                                    );
                                                }}>
                                                {loadingFavorites[data?.id] ? (
                                                    // <ClipLoader size={20} color="#000000" />
                                                    <p></p>
                                                ) : data?.is_favorite ? (
                                                    <MdFavorite
                                                        size={24}
                                                        color="red"
                                                    />
                                                ) : (
                                                    <MdFavoriteBorder
                                                        size={24}
                                                        color="white"
                                                    />
                                                )}
                                            </div>
                                        </motion.div>
                                    </div>

                                    <Link href={`/product/${data?.id}`}>
                                        <div className="text-center">
                                            <p className="uppercase text-[14px] md:text-[18px]">
                                                {data?.name}
                                            </p>
                                        </div>
                                    </Link>
                                </div>
                                <Link href={`/product/${data?.id}`}>
                                    <hr className="my-2" />
                                    <div className="text-center">
                                        <p className="text-blue-600 truncate ...   text-[13px] md:text-[16px]">
                                            {data?.description}
                                        </p>
                                    </div>
                                    <div className="text-black font-[500]  flex justify-center items-center">
                                        <div>
                                            <img
                                                src="/static/Naira.png"
                                                alt=""
                                                className="mr-2"
                                            />
                                        </div>

                                        <>{Math.floor(data?.price)}</>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {categoriesWithProducts?.results
                    ?.slice(0, 2)
                    ?.map((items, index) => (
                        <div key={index} className="mb-16 mt-32">
                            <div className="flex justify-between items-center w-full">
                                <div className="">
                                    <div className=" font-bold md:text-[22] text-[16px] text-black ">
                                        {items?.name}
                                    </div>
                                </div>
                                <div>
                                    <Link href={`/shop/${items?.id}`}>
                                        View All
                                    </Link>
                                </div>
                            </div>
                            <div className=" grid md:grid-cols-4 grid-cols-2 gap-4 mt-4">
                                {items?.products?.slice(0, 4)?.map((data) => (
                                    <motion.div
                                        key={data.id}
                                        onTouchStart={() =>
                                            handleTouchStart(data?.id)
                                        }
                                        onTouchEnd={handleTouchEnd}
                                        whileHover={isMobile ? {} : 'hover'}
                                        initial="rest"
                                        animate="rest"
                                        className="  ">
                                        <div className="relative  ">
                                            <div style={{background:'white'}} className="justify-center items-center flex rounded-3xl bg-white  md:p-8 p-3 hover:bg-gray-800  mb-4 ">
                                                <Link
                                                    href={`/product/${data?.id}`}>
                                                    <Image
                                                        src={
                                                            data?.image_url
                                                                ? data?.image_url
                                                                : '/static/toy.jpg'
                                                        }
                                                        width={500}
                                                        height={500}
                                                        alt=""
                                                        className="sm:h-[250px] h-[150px] w-full object-contain sm:object-cover rounded-lg cursor-pointer"
                                                    />
                                                </Link>

                                                <motion.div
                                                    className="flex absolute bottom-0 left-0 justify-center right-0  bg-opacity-80 p-2"
                                                    initial={{
                                                        opacity: 0,
                                                        y: '10%',
                                                    }}
                                                    variants={{
                                                        rest: {
                                                            opacity: 0,
                                                            y: '10%',
                                                        },
                                                        hover: {
                                                            y: -37,
                                                            opacity: 1,
                                                        },
                                                    }}
                                                    animate={
                                                        isMobile &&
                                                        activeItem === data?.id
                                                            ? {
                                                                  opacity: 1,
                                                                  y: -37,
                                                              }
                                                            : {}
                                                    }
                                                    // animate='rest'
                                                    // animate={showActions || !isMobile ? "hover" : "rest"}
                                                    transition={{
                                                        duration: 0.3,
                                                    }}>
                                                    <div
                                                        onClick={() =>
                                                            addToCart(data?.id)
                                                        }
                                                        className="cursor-pointer mr-2 h-14 w-14 flex justify-center items-center rounded-full bg-gray-600 ">
                                                        <img
                                                            src="/static/cartic.png"
                                                            alt=""
                                                        />
                                                        {/* <CiShoppingCart size={24} /> */}
                                                    </div>
                                                    <div
                                                        className="cursor-pointer bg-gray-600 h-14 w-14 flex justify-center items-center  rounded-full"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleFavoriteClick(
                                                                data?.id,
                                                                data?.is_favorite,
                                                                data?.category
                                                                    ?.id
                                                            );
                                                        }}>
                                                        {loadingFavorites[
                                                            data?.id
                                                        ] ? (
                                                            // <ClipLoader size={20} color="#000000" />
                                                            <p></p>
                                                        ) : data?.is_favorite ? (
                                                            <MdFavorite
                                                                size={24}
                                                                color="red"
                                                            />
                                                        ) : (
                                                            <MdFavoriteBorder
                                                                size={24}
                                                                color="white"
                                                            />
                                                        )}
                                                    </div>
                                                </motion.div>
                                            </div>

                                            <Link href={`/product/${data?.id}`}>
                                                <div className="text-center">
                                                    <p className="uppercase text-[14px] md:text-[18px]">
                                                        {data?.name}
                                                    </p>
                                                </div>
                                            </Link>
                                        </div>
                                        <Link href={`/product/${data?.id}`}>
                                            <hr className="my-2" />
                                            <div className="text-center">
                                                <p className="text-blue-600 truncate ...   text-[13px] md:text-[16px]">
                                                    {data?.description}
                                                </p>
                                            </div>
                                            <div className="text-black font-[500]  flex justify-center items-center">
                                                <div>
                                                    <img
                                                        src="/static/Naira.png"
                                                        alt=""
                                                        className="mr-2"
                                                    />
                                                </div>

                                                <>{Math.floor(data?.price)}</>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}

                <div className="flex justify-between mt-32">
                    <div className="md:block hidden">
                        <Image
                            height={1000}
                            width={1000}
                            className="w-full"
                            src="/static/ads4.png"
                            alt=""
                        />
                    </div>
                    <div>
                        <Image
                            height={1000}
                            width={1000}
                            className="w-full"
                            src="/static/ads5.png"
                            alt=""
                        />
                    </div>
                </div>
                {categoriesWithProducts?.results
                    ?.slice(3, 5)
                    ?.map((items, index) => (
                        <div key={index} className="mb-16 mt-32">
                            <div className="flex justify-between items-center  w-full">
                                <div className=" ">
                                    <div className=" font-bold md:text-[22] text-[16px] text-black ">
                                        {items?.name}
                                    </div>
                                </div>
                                <div>
                                    <Link href={`/shop/${items?.id}`}>
                                        View All
                                    </Link>
                                </div>
                            </div>
                            <div className=" grid md:grid-cols-4 grid-cols-2 gap-4 mt-4">
                                {items?.products?.slice(0, 4)?.map((data) => (
                                    <motion.div
                                        key={data.id}
                                        onTouchStart={() =>
                                            handleTouchStart(data?.id)
                                        }
                                        onTouchEnd={handleTouchEnd}
                                        whileHover={isMobile ? {} : 'hover'}
                                        initial="rest"
                                        animate="rest"
                                        className="  ">
                                        <div className="relative  ">
                                            <div style={{background:'white'}} className="justify-center items-center flex rounded-3xl bg-white  md:p-8 p-3 hover:bg-gray-800  mb-4 ">
                                                <Link
                                                    href={`/product/${data?.id}`}>
                                                    <Image
                                                        src={
                                                            data?.image_url
                                                                ? data?.image_url
                                                                : '/static/toy.jpg'
                                                        }
                                                        width={500}
                                                        height={500}
                                                        alt=""
                                                        className="sm:h-[250px] h-[150px] w-full object-contain sm:object-cover rounded-lg cursor-pointer"
                                                    />
                                                </Link>

                                                <motion.div
                                                    className="flex absolute bottom-0 left-0 justify-center right-0  bg-opacity-80 p-2"
                                                    initial={{
                                                        opacity: 0,
                                                        y: '10%',
                                                    }}
                                                    variants={{
                                                        rest: {
                                                            opacity: 0,
                                                            y: '10%',
                                                        },
                                                        hover: {
                                                            y: -37,
                                                            opacity: 1,
                                                        },
                                                    }}
                                                    animate={
                                                        isMobile &&
                                                        activeItem === data?.id
                                                            ? {
                                                                  opacity: 1,
                                                                  y: -37,
                                                              }
                                                            : {}
                                                    }
                                                    // animate='rest'
                                                    // animate={showActions || !isMobile ? "hover" : "rest"}
                                                    transition={{
                                                        duration: 0.3,
                                                    }}>
                                                    <div
                                                        onClick={() =>
                                                            addToCart(data?.id)
                                                        }
                                                        className="cursor-pointer mr-2 h-14 w-14 flex justify-center items-center rounded-full bg-gray-600 ">
                                                        <img
                                                            src="/static/cartic.png"
                                                            alt=""
                                                        />
                                                        {/* <CiShoppingCart size={24} /> */}
                                                    </div>
                                                    <div
                                                        className="cursor-pointer bg-gray-600 h-14 w-14 flex justify-center items-center  rounded-full"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleFavoriteClick(
                                                                data?.id,
                                                                data?.is_favorite,
                                                                data?.category
                                                                    ?.id
                                                            );
                                                        }}>
                                                        {loadingFavorites[
                                                            data?.id
                                                        ] ? (
                                                            // <ClipLoader size={20} color="#000000" />
                                                            <p></p>
                                                        ) : data?.is_favorite ? (
                                                            <MdFavorite
                                                                size={24}
                                                                color="red"
                                                            />
                                                        ) : (
                                                            <MdFavoriteBorder
                                                                size={24}
                                                                color="white"
                                                            />
                                                        )}
                                                    </div>
                                                </motion.div>
                                            </div>

                                            <Link href={`/product/${data?.id}`}>
                                                <div className="text-center">
                                                    <p className="uppercase text-[14px] md:text-[18px]">
                                                        {data?.name}
                                                    </p>
                                                </div>
                                            </Link>
                                        </div>
                                        <Link href={`/product/${data?.id}`}>
                                            <hr className="my-2" />
                                            <div className="text-center">
                                                <p className="text-blue-600 truncate ...   text-[13px] md:text-[16px]">
                                                    {data?.description}
                                                </p>
                                            </div>
                                            <div className="text-black font-[500]  flex justify-center items-center">
                                                <div>
                                                    <img
                                                        src="/static/Naira.png"
                                                        alt=""
                                                        className="mr-2"
                                                    />
                                                </div>

                                                <>{Math.floor(data?.price)}</>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                <div className="w-full mt-32">
                    <Image
                        height={1500}
                        width={1500}
                        src="/static/ads1.png"
                        className="w-"
                    />
                </div>

                {categoriesWithProducts?.results
                    ?.slice(6, 8)
                    ?.map((items, index) => (
                        <div key={index} className="mb-16 mt-32">
                            <div className="flex justify-between items-center  w-full">
                                <div className="">
                                    <div className=" font-bold md:text-[22] text-[16px] text-black ">
                                        {items?.name}
                                    </div>
                                </div>
                                <div>
                                    <Link href={`/shop/${items?.id}`}>
                                        View All
                                    </Link>
                                </div>
                            </div>
                            <div className=" grid md:grid-cols-4 grid-cols-2 gap-4 mt-4">
                                {items?.products?.slice(0, 4)?.map((data) => (
                                    <motion.div
                                        key={data.id}
                                        onTouchStart={() =>
                                            handleTouchStart(data?.id)
                                        }
                                        onTouchEnd={handleTouchEnd}
                                        whileHover={isMobile ? {} : 'hover'}
                                        initial="rest"
                                        animate="rest"
                                        className="  ">
                                        <div className="relative  ">
                                            <div style={{background:'white'}} className="justify-center items-center flex rounded-3xl bg-white  md:p-8 p-3 hover:bg-gray-800  mb-4 ">
                                                <Link
                                                    href={`/product/${data?.id}`}>
                                                    <Image
                                                        src={
                                                            data?.image_url
                                                                ? data?.image_url
                                                                : '/static/toy.jpg'
                                                        }
                                                        width={500}
                                                        height={500}
                                                        alt=""
                                                        className="md:h-[250px] h-[150px] w-full object-contain  rounded-lg cursor-pointer"
                                                    />
                                                </Link>

                                                <motion.div
                                                    className="flex absolute bottom-0 left-0 justify-center right-0  bg-opacity-80 p-2"
                                                    initial={{
                                                        opacity: 0,
                                                        y: '10%',
                                                    }}
                                                    variants={{
                                                        rest: {
                                                            opacity: 0,
                                                            y: '10%',
                                                        },
                                                        hover: {
                                                            y: -37,
                                                            opacity: 1,
                                                        },
                                                    }}
                                                    animate={
                                                        isMobile &&
                                                        activeItem === data?.id
                                                            ? {
                                                                  opacity: 1,
                                                                  y: -37,
                                                              }
                                                            : {}
                                                    }
                                                    // animate='rest'
                                                    // animate={showActions || !isMobile ? "hover" : "rest"}
                                                    transition={{
                                                        duration: 0.3,
                                                    }}>
                                                    <div
                                                        onClick={() =>
                                                            addToCart(data?.id)
                                                        }
                                                        className="cursor-pointer mr-2 h-14 w-14 flex justify-center items-center rounded-full bg-gray-600 ">
                                                        <img
                                                            src="/static/cartic.png"
                                                            alt=""
                                                        />
                                                        {/* <CiShoppingCart size={24} /> */}
                                                    </div>
                                                    <div
                                                        className="cursor-pointer bg-gray-600 h-14 w-14 flex justify-center items-center  rounded-full"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleFavoriteClick(
                                                                data?.id,
                                                                data?.is_favorite,
                                                                data?.category
                                                                    ?.id
                                                            );
                                                        }}>
                                                        {loadingFavorites[
                                                            data?.id
                                                        ] ? (
                                                            // <ClipLoader size={20} color="#000000" />
                                                            <p></p>
                                                        ) : data?.is_favorite ? (
                                                            <MdFavorite
                                                                size={24}
                                                                color="red"
                                                            />
                                                        ) : (
                                                            <MdFavoriteBorder
                                                                size={24}
                                                                color="white"
                                                            />
                                                        )}
                                                    </div>
                                                </motion.div>
                                            </div>

                                            <Link href={`/product/${data?.id}`}>
                                                <div className="text-center">
                                                    <p className="uppercase text-[14px] md:text-[18px]">
                                                        {data?.name}
                                                    </p>
                                                </div>
                                            </Link>
                                        </div>
                                        <Link href={`/product/${data?.id}`}>
                                            <hr className="my-2" />
                                            <div className="text-center">
                                                <p className="text-blue-600 truncate ...   text-[13px] md:text-[16px]">
                                                    {data?.description}
                                                </p>
                                            </div>
                                            <div className="text-black font-[500]  flex justify-center items-center">
                                                <div>
                                                    <img
                                                        src="/static/Naira.png"
                                                        alt=""
                                                        className="mr-2"
                                                    />
                                                </div>

                                                <>{Math.floor(data?.price)}</>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default HomeDefaultTopCategories;
