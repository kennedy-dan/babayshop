'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import SkeletonProductDetail from '~/components/elements/skeletons/SkeletonProductDetail';
import BreadCrumb from '~/components/elements/BreadCrumb';
import ProductDetailFullwidth from '~/components/elements/detail/ProductDetailFullwidth';
import RelatedProduct from '~/components/partials/product/RelatedProduct';
import HeaderProduct from '~/components/shared/headers/HeaderProduct';
import HeaderDefault from '~/components/shared/headers/HeaderDefault';
import PageContainer from '~/components/layouts/PageContainer';
import Newletters from '~/components/partials/commons/Newletters';
import HeaderMobileProduct from '~/components/shared/header-mobile/HeaderMobileProduct';
import useGetProducts from '~/hooks/useGetProducts';
import ProductWidgets from '~/components/partials/product/ProductWidgets';
import Rating from '~/components/elements/Rating';
import { MdOutlineFavorite, MdFavorite } from 'react-icons/md';
import { MdFavoriteBorder } from 'react-icons/md';
import { CiShoppingCart } from 'react-icons/ci';
import { toast } from 'react-toastify';
import { Select, ConfigProvider } from 'antd';

// import { MdFavoriteBorder } from 'react-icons/md';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';

import { useDispatch, useSelector } from 'react-redux';
import {
    getSingleProduct,
    addtocart,
    getcartData,
    getSingleCats,
    favAction,
    getFavorites,
    getsizes
} from '~/redux/features/productSlice';
import { ClipLoader } from 'react-spinners';
import WidgetProductFeatures from '~/components/shared/widgets/WidgetProductFeatures';

const ProductDefaultPage = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const { pid } = params;
    const { loading, getStrapiProduct, product,  } = useGetProducts();
    const [quantity, setQuantity] = useState(1);
    const [selectedOptions, setSelectedOptions] = useState(null);


    const [desc, setDesc] = useState('description');

    const { singlecats, singleproducts, addcart, sizes } = useSelector(
        (state) => state.product
    );
    const { token } = useSelector((state) => state.auth);
    const [loadingFavorites, setLoadingFavorites] = useState({});

    const getSingleProductData = singleproducts?.results?.data?.data;
    const sizedata= singleproducts?.results?.data?.data?.product_sizes

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
            dispatch(getSingleProduct(pid));

            dispatch(getSingleCats(getSingleProductData?.category?.id));
        } catch (error) {
            toast.error(`Failed to ${action} favorite: ${error.message}`);
        } finally {
            setLoadingFavorites((prev) => ({ ...prev, [id]: false }));
        }
    };
    const handleChange = (value) => {
        setSelectedOptions(value);
    };

    const handleFavoriteClickProdd = async (id, isFavorite) => {
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
            dispatch(getSingleCats(getSingleProductData?.category?.id));

            dispatch(getSingleProduct(pid));
        } catch (error) {
            toast.error(`Failed to ${action} favorite: ${error.message}`);
        } finally {
            setLoadingFavorites((prev) => ({ ...prev, [id]: false }));
        }
    };

    const changeDesc = (name) => {
        setDesc(name);
    };

    useEffect(() => {
        dispatch(getSingleProduct(pid));
    }, [pid]);
    useEffect(() => {
      
    dispatch(getsizes())
    }, [])
    

    useEffect(() => {
        dispatch(getSingleCats(getSingleProductData?.category?.id));
    }, [getSingleProductData?.category?.id]);

    console.log(getSingleProductData?.category?.id);
    const data = singlecats?.results?.data?.data?.data;

    const handleSubtract = () => {
        if (quantity < 2) {
            setQuantity(1);
        } else {
            setQuantity(quantity - 1);
        }
    };

    const handleAdd = () => {
        setQuantity(quantity + 1);
    };

    const addToCart = (id) => {
        const data = {
            product_id: id,
            quantity: quantity,
            size_id: selectedOptions
        };
        dispatch(addtocart(data));
    };

    useEffect(() => {
        if (token) {
            dispatch(getcartData());
        }
    }, [addcart, token]);

    const breadCrumb = [
        {
            text: 'Home',
            url: '/',
        },
        {
            text: 'Shop',
            url: '/shop',
        },
        {
            text: product?.attributes.title || 'Untitled Product',
        },
    ];

    const productDetails = useMemo(() => {
        if (loading) {
            return <SkeletonProductDetail />;
        }
        if (product) {
            return <ProductDetailFullwidth product={product} />;
        }
    }, [loading, product]);

    const headerView = useMemo(() => {
        if (loading) {
            return (
                <>
                    <HeaderDefault />
                    {/* <HeaderMobileProduct /> */}
                </>
            );
        }
        if (product) {
            return (
                <>
                    <HeaderProduct product={product} />
                    {/* <HeaderMobileProduct /> */}
                </>
            );
        } else {
            return (
                <>
                    <HeaderDefault />
                </>
            );
        }
    }, [loading, product]);

    return (
        <PageContainer
            header={headerView}
            title={product?.attributes.title || 'Untitled Product'}>
            <BreadCrumb breacrumb={breadCrumb} layout="fullwidth" />
            <div className="ps-top bg ">
                <div className="ps-container">
                    <div className="">
                        {singleproducts?.isLoading && (
                            <div className="w-full h-[300px] items-center justify-center flex">
                                <ClipLoader className="w-9 h-9" />
                            </div>
                        )}
                        {!singleproducts?.isLoading && (
                            <div>
                                <div className="md:flex my-20 w-full md:space-x-12   font-montserrat">
                                    <div style={{background:'white'}} className="  rounded-lg h-fit  p-4">
                                        <img
                                            src={
                                                getSingleProductData?.image_url
                                                    ? getSingleProductData?.image_url
                                                    : '/static/toy.jpg'
                                            }
                                            alt=""
                                            className="w-[70px] h-[70px] object-contain  rounded-lg "
                                            // width={500}
                                            // height={500}
                                        />
                                    </div>
                                    <div style={{background:'white'}} className="  rounded-lg h-fit  p-4">
                                        <img
                                            src={
                                                getSingleProductData?.image_url
                                                    ? getSingleProductData?.image_url
                                                    : '/static/toy.jpg'
                                            }
                                            alt=""
                                            className="w-[430px] h-[400px] object-contain  rounded-lg "
                                            // width={500}
                                            // height={800}
                                        />
                                    </div>
                                    <div className="md:w-[31%]">
                                        <div className="flex space-x-4 items-center justify-between">
                                            <p className="md:text-[36px] text-[18px] font-[500] text-black  ">
                                                {getSingleProductData?.name}
                                            </p>
                                            <div onClick={() => handleFavoriteClickProdd(getSingleProductData?.id, getSingleProductData?.is_favorite)} >
                                                { getSingleProductData?.is_favorite?    (
                                                <MdFavorite
                                                    size={24}
                                                    color="red"
                                                />
                                                ) : (
                                                <MdFavoriteBorder
                                                    size={24}
                                                    color="black"
                                                />
                                                ) }
                                             
                                            </div>
                                        </div>

                                        <div className="">
                                            <p>Brand: | No brand</p>
                                            <Rating />

                                            {/* <span>1 Review</span> */}
                                        </div>

                                        {/* <hr /> */}
                                        <div className="h-[1px] bg-gray-400 w-full mt-5 "></div>

                                        <p className="pt-4">
                                            SKU: {getSingleProductData?.sku}
                                        </p>

                                        <div className="text-black  font-semibold  flex text-[24px] items-center">
                                                <div>
                                                    <img
                                                        src="/static/Naira.png"
                                                        alt=""
                                                        className="mr-2"
                                                    />
                                                </div>

                                                <>{Math.floor(getSingleProductData?.price)}</>
                                            </div>

                                        <p className="pt-2  text-black ">
                                            Quantity
                                        </p>
                                        <div className="flex space-x-4 items-center pt-2 w-full justify-between">
                                            <div className="w-full">
                                                <button className="flex w-full border-2 rounded-md  px-2 py-3 justify-between border-gray-400 items-center">
                                                    <button
                                                        onClick={
                                                            handleSubtract
                                                        }>
                                                        <img
                                                            src={
                                                                '/static/dec.png'
                                                            }
                                                            alt=""
                                                        />
                                                    </button>
                                                    <p className="text-black font-bold px-2 text-[13px]">
                                                        {quantity}
                                                    </p>
                                                    <button onClick={handleAdd}>
                                                        <img
                                                            src={
                                                                '/static/inc.png'
                                                            }
                                                            alt=""
                                                        />
                                                    </button>
                                                </button>
                                            </div>

                                            <button
                                                onClick={() =>
                                                    addToCart(
                                                        getSingleProductData?.id
                                                    )
                                                }
                                                className="bg-[#F5128F] w-full text-white  font-bold tet-[14px] py-4 rounded-md ">
                                                {addcart?.isLoading ? (
                                                    <ClipLoader
                                                        size={12}
                                                        color="white"
                                                    />
                                                ) : (
                                                    'Add to cart'
                                                )}
                                            </button>
                                            {/* <div>
                                                <MdFavoriteBorder size={23} />
                                            </div> */}
                                        </div>
                                        <div className="h-[1px] bg-gray-400 w-full my-5 "></div>
                                        <p className="font-[600]">
                                            Size
                                        </p>
                                        {sizedata?.length > 0 &&      <ConfigProvider
                                                theme={{
                                                    components: {
                                                        Select: {
                                                            optionSelectedFontWeight: 600,
                                                        },
                                                    },
                                                    // ...customTheme,
                                                    token: {
                                                        borderRadius: 0,
                                                        controlHeight: 60,
                                                        colorBgContainer:
                                                            '#f0f0f0',
                                                        fontSize: 16,
                                                        // optionSelectedFontWeight: 300
                                                    },
                                                }}>
                                            <Select
                                                // mode="multiple"
                                                placeholder="Select Size"
                                                style={{ width: '100%' }}
                                                onChange={handleChange}>
                                                {sizedata?.map(items => <Option value={items?.id}>
                                                    {items?.size_name}
                                                </Option>)}
                                           
                                            </Select>
                                            </ConfigProvider> }
                                   

                                        <p className="font-[600] mt-3">
                                            Product details
                                        </p>
                                        <p>
                                            {getSingleProductData?.description}
                                        </p>
                                        <p className="font-[600] mt-3">
                                            category
                                        </p>

                                        <p className=" text-[16px] ">
                                            {
                                                getSingleProductData?.category
                                                    ?.name
                                            }
                                        </p>
                                    </div>
                                    <div className='lg:block hidden'  >
                                        <WidgetProductFeatures />
                                    </div>
                                </div>

                                {/* <div className="flex space-x-4 mb-6 ">
                                    <div
                                        className={`font-bold text-4xl cursor-pointer ${desc === 'description' ? 'border-b-2 border-blue-700 pb-2' : 'text-black'}  `}
                                        onClick={() =>
                                            changeDesc('description')
                                        }>
                                        Description
                                    </div>
                                    <div
                                        className={`font-bold text-4xl cursor-pointer ${desc === 'review' ? 'border-b-2 border-blue-700 pb-2' : 'text-black'}  `}
                                        onClick={() => changeDesc('review')}>
                                        Reviews
                                    </div>
                                </div>
                                <div>
                                    {desc === 'description' && (
                                        <Description
                                            description={
                                                getSingleProductData?.description
                                            }
                                        />
                                    )}
                                    {desc === 'review' && <Review />}
                                </div> */}
                                <p className='mt-20 mb-4 text-[26px] ' >Related products</p>
                                <div className="md:flex md:justify-between grid grid-cols-2 ">
                                    {data?.slice(0, 4)?.map((data, index) => (
                                        <motion.div
                                            key={data.id}
                                            whileHover="hover"
                                            initial="rest"
                                            animate="rest"
                                            className=" mb-6 ">
                                            <div className="relative">
                                                <div style={{background:'white'}} className="justify-cente flex rounded-3xl bg-white hover:bg-gray-800  p-8 ">
                                                    <Image
                                                        src={
                                                            data?.image_url
                                                                ? data?.image_url
                                                                : '/static/toy.jpg'
                                                        }
                                                        width={500}
                                                        height={500}
                                                        alt=""
                                                        className="h-[230px] w-[250px] object-contain sm:object-cover rounded-lg cursor-pointer"
                                                    />

                                                    <motion.div
                                                        className="flex absolute bottom-0 left-0 justify-center right-0  bg-opacity-80 p-2"
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
                                                        transition={{
                                                            duration: 0.3,
                                                        }}>
                                                        <div
                                                            onClick={() =>
                                                                addToCart(
                                                                    data?.id
                                                                )
                                                            }
                                                            className="cursor-pointer mr-2 h-14 w-14 flex justify-center items-center rounded-full hover:bg-[#F5128F] bg-gray-600 ">
                                                            <img
                                                                src="/static/cartic.png"
                                                                alt=""
                                                            />
                                                            {/* <CiShoppingCart size={24} /> */}
                                                        </div>
                                                        <div
                                                            className="cursor-pointer bg-gray-600 hover:bg-[#F5128F] h-14 w-14 flex justify-center items-center  rounded-full"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleFavoriteClick(
                                                                    data?.id,
                                                                    data?.is_favorite
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

                                                <Link
                                                    href={`/product/${data?.id}`}>
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
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {/* <Newletters /> */}
        </PageContainer>
    );
};

export default ProductDefaultPage;

const Description = ({ description }) => {
    return <p>{description}</p>;
};

const Review = () => {};
