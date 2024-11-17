'use client';
import React, { useEffect, useState } from 'react';
import BreadCrumb from '~/components/elements/BreadCrumb';
import ShopItems from '~/components/partials/shop/ShopItems';
import WidgetShopCategories from '~/components/shared/widgets/WidgetShopCategories';
import WidgetShopBrands from '~/components/shared/widgets/WidgetShopBrands';
import WidgetShopFilterByPriceRange from '~/components/shared/widgets/WidgetShopFilterByPriceRange';
import PageContainer from '~/components/layouts/PageContainer';
import Newletters from '~/components/partials/commons/Newletters';
import ShopBanner from '~/components/partials/shop/ShopBanner';
import ShopBrands from '~/components/partials/shop/ShopBrands';
import { toast } from 'react-toastify';

import ShopCategories from '~/components/partials/shop/ShopCategories';
import ProductGroupByCarousel from '~/components/partials/product/ProductGroupByCarousel';
import { useDispatch, useSelector } from 'react-redux';
import {
    getSingleCats,
    addtocart,
    favAction,
    getFavorites,
} from '~/redux/features/productSlice';
import { useParams } from 'next/navigation';
import { Pagination } from 'antd';
import { MdOutlineFavorite, MdFavorite } from 'react-icons/md';
import Link from 'next/link';
import { CiShoppingCart } from 'react-icons/ci';
import { MdFavoriteBorder } from 'react-icons/md';
import { motion } from 'framer-motion';
import Image from 'next/image';

const breadCrumb = [
    {
        text: 'Home',
        url: '/',
    },
    {
        text: 'Shop Default',
    },
];

export default function Page() {
    const dispatch = useDispatch();
    const { singlecats, singleproducts, addcart } = useSelector(
        (state) => state.product
    );
    const { token } = useSelector((state) => state.auth);
    const [openTrack, setOpenTrack] = useState(false);
    const [loadingFavorites, setLoadingFavorites] = useState({});
    const [isMobile, setIsMobile] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [quantity, setQuantity] = useState(1);
    const [showActions, setShowActions] = useState(false);
    const [currentItems, setCurrentItems] = useState([]);
    // const metaData = singlecats?.results?.data?.metadata;
    const data = singlecats?.results?.data?.data?.data;
    const getSingleProductData = singleproducts?.results?.data?.data?.data;
  const metaData = singlecats?.results?.data?.data?.pagination_meta?.total;

    const itemsPerPage = singlecats?.results?.data?.data?.pagination_meta?.per_page;
    const [activeItem, setActiveItem] = useState(null);
    const router = useParams();
    const { id } = router;

    const routerId = id;

    // useEffect(() => {
    //     const indexOfLastItem = currentPage * itemsPerPage;
    //     const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    //     setCurrentItems(data?.slice(indexOfFirstItem, indexOfLastItem) || []);
    // }, [currentPage, data]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        dispatch(getSingleCats({id:id, page:page}));

    };

    const handleTrackClose = () => {
        setOpenTrack(false);
    };

    const handleTrackOpen = (id) => {
        setOpenTrack(true);
    };

    useEffect(() => {
        if (id) {
            dispatch(getSingleCats({id:id}));
        }
    }, []);
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
            quantity: quantity,
        };
        dispatch(addtocart(data));
    };

    const handleFavoriteClick = async (id, isFavorite) => {
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

            dispatch(getSingleCats({id:routerId}));
        } catch (error) {
            toast.error(`Failed to ${action} favorite: ${error.message}`);
        } finally {
            setLoadingFavorites((prev) => ({ ...prev, [id]: false }));
        }
    };

    return (
        <PageContainer title="Shop">
            <div className="ps-page--shop">
                <BreadCrumb breacrumb={breadCrumb} layout="fullwidth" />
                <div className="ps-container">
                    {/* <ShopBanner />
                    <ShopBrands /> */}

                    <div className="grid lg:grid-cols-5 md:grid-cols-3 grid-cols-2 gap-4">
                        {data?.map((data, index) => (
                            <motion.div
                                key={data.id}
                                onTouchStart={() => handleTouchStart(data?.id)}
                                onTouchEnd={handleTouchEnd}
                                whileHover={isMobile ? {} : "hover"}
                                    initial="rest"
                                    animate="rest"
                                className=" mb-6 "
                             >
                                <div
                                    className="relative"
                                   

                                    onTouchStart={handleTouchStart}
                                    onTouchEnd={handleTouchEnd}>
                                    <div style={{background:'white'}} className="justify-cente flex rounded-3xl bg-white hover:bg-gray-800  md:p-8 p-3 ">
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
                                            className="md:h-[230px] h-[150px] w-[250px] object-contain md:object-cover rounded-lg cursor-pointer"
                                        />
                                        </Link>

                                        <motion.div
                                            className="flex absolute bottom-0 left-0 justify-center right-0  bg-opacity-80 p-2"
                                            initial={{ opacity: 0, y: '10%' }}
                                            variants={{
                                                rest: { opacity: 0, y: '10%' },
                                                hover: { y: -55, opacity: 1 },
                                            }}
                                            animate={isMobile && activeItem === data?.id ? { opacity: 1, y: -55 } : {}}
                                            // animate='rest'
                                            // animate={showActions || !isMobile ? "hover" : "rest"}
                                            transition={{ duration: 0.3 }}>
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
                                                        data?.is_favorite
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
                                            <p className="uppercase text-[18px]">
                                                {data?.name}
                                            </p>
                                        </div>
                                    </Link>
                                </div>
                                <Link href={`/product/${data?.id}`}>
                                    <hr className="my-2" />
                                    <div className="text-center">
                                        <p className="text-blue-600 text-[16px]">
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
                        {/* {currentItems?.map((items, index) => (
                            <motion.div
                                key={index}
                                whileHover="hover"
                                initial="rest"
                                animate="rest"
                                className="mt-6 font-urbanist">
                                <div className="relative">
                                    <Link href={`/product/${items?.id}`}>
                                        <div
                                            className="flex"
                                            // onClick={() => handleTrackOpen(items?.id)}
                                        >
                                            <img
                                                src={
                                                    items?.image_url
                                                        ? items?.image_url
                                                        : '/static/toy.jpg'
                                                }
                                                alt=""
                                                className=" h-[300px] object-contain rounded-lg cursor-pointer"
                                                width={500}
                                                height={500}
                                            />
                                        </div>
                                    </Link>
                                    <motion.div
                                    className="flex absolute bottom-0 left-0 justify-center right-0 bg-opacity-80 p-2"
                                    variants={{
                                        rest: { opacity: 0, y: '100%' },
                                        hover: { y: 0, opacity: 1 },
                                    }}
                                    transition={{ duration: 0.3 }}>
                                    <div
                                        onClick={() => addToCart(items?.id)}
                                        className="cursor-pointer mr-2">
                                        <CiShoppingCart size={24} />
                                    </div>
                                    <div
                                        className="cursor-pointer"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleFavoriteClick(
                                                items?.id,
                                                items?.is_favorite
                                            );
                                        }}>
                                        {loadingFavorites[items?.id] ? (
                                            // <ClipLoader size={20} color="#000000" />
                                            <p></p>
                                        ) : items?.is_favorite ? (
                                            <MdFavorite size={24} color="red" />
                                        ) : (
                                            <MdFavoriteBorder size={24} color="" />
                                        )}
                                    </div>
                                </motion.div>
                                </div>

                            

                                <p className="text-black uppercase text-[13px]">
                                    {items.name}
                                </p>
                                <hr />
                                <div className="">
                                    <p className="text-blue-600 font-semibold mt-2 text-[15px]">
                                        {items.description}
                                    </p>
                                    <div className="text-black font-semibold text-[20px] flex items-center">
                                        <img
                                            src="/static/Naira.png"
                                            alt=""
                                            className="w-4 h-4"
                                        />
                                        <p className="pl-1">
                                            {Math.floor(items?.price)}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))} */}
                    </div>

                    <div className="flex py-20 justify-center">
            <div className="flex justify-center">
              <Pagination
                current={currentPage}
                total={metaData || 0}
                pageSize={itemsPerPage}
                onChange={handlePageChange}
              />
            </div>
          </div>
                    {/* <div className="ps-layout--shop">
                        <div className="ps-layout__left">
                            <WidgetShopCategories />
                            <WidgetShopBrands />
                            <WidgetShopFilterByPriceRange />
                        </div>
                        <div className="ps-layout__right">
                            <ProductGroupByCarousel
                                collectionSlug="hot-new-arrivals"
                                title="Best Sale Items"
                            />
                            <ProductGroupByCarousel
                                collectionSlug="hot-new-arrivals"
                                title="Recommended Items"
                            />
                            <ShopItems columns={6} pageSize={18} />
                        </div>
                    </div> */}
                </div>
            </div>
            {/* <Newletters /> */}
        </PageContainer>
    );
}
