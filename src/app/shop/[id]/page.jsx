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
import { toast } from "react-toastify";

import ShopCategories from '~/components/partials/shop/ShopCategories';
import ProductGroupByCarousel from '~/components/partials/product/ProductGroupByCarousel';
import { useDispatch, useSelector } from 'react-redux';
import { getSingleCats, addtocart, favAction, getFavorites } from '~/redux/features/productSlice';
import { useParams } from 'next/navigation';
import { Pagination } from 'antd';
import { MdOutlineFavorite, MdFavorite } from 'react-icons/md';
import Link from 'next/link';
import { CiShoppingCart } from 'react-icons/ci';
import { MdFavoriteBorder } from 'react-icons/md';
import { motion } from 'framer-motion';

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

    const [currentPage, setCurrentPage] = useState(1);
    const [quantity, setQuantity] = useState(1);
    const [currentItems, setCurrentItems] = useState([]);
    const metaData = singlecats?.results?.data?.metadata;
    const data = singlecats?.results?.data?.data?.data;
    const getSingleProductData = singleproducts?.results?.data?.data?.data;
    const itemsPerPage = 10;

    const router = useParams();
    const { id } = router;

    const routerId = id

    useEffect(() => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        setCurrentItems(data?.slice(indexOfFirstItem, indexOfLastItem) || []);
    }, [currentPage, data]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleTrackClose = () => {
        setOpenTrack(false);
    };

    const handleTrackOpen = (id) => {
        setOpenTrack(true);
        dispatch(getSingleProduct(id));
    };

    useEffect(() => {
        if (id) {
            dispatch(getSingleCats(id));
        }
    }, []);
    const addToCart = (id) => {
        const data = {
            product_id: id,
            quantity: quantity,
        };
        dispatch(addtocart(data));
    };

    
const handleFavoriteClick = async (id, isFavorite) => {
  if(!token){
    toast.info('Login to add to favorite')
    router.push('/account/login')
    return
  }
  setLoadingFavorites((prev) => ({ ...prev, [id]: true }));
  const action = isFavorite ? "remove" : "add";
  try {
    await dispatch(favAction({ id, action })).unwrap();
    toast.success(
      `Product ${action === "add" ? "added to" : "removed from"} favorites`
    );
    dispatch(getFavorites()); // Refresh the favorites list
  
  dispatch(getSingleCats(routerId))

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
                    <ShopBanner />
                    <ShopBrands />

                    <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-6 ">
                        {currentItems?.map((items, index) => (
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
                                    className="flex absolute bottom-0 left-0 justify-center right-0 bg-white bg-opacity-80 p-2"
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
                        ))}
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
            <Newletters />
        </PageContainer>
    );
}
