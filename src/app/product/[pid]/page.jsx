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
import { MdFavoriteBorder } from 'react-icons/md';

import { useDispatch, useSelector } from 'react-redux';
import {
    getSingleProduct,
    addtocart,
    getcartData,
} from '~/redux/features/productSlice';
import { ClipLoader } from 'react-spinners';
import WidgetProductFeatures from '~/components/shared/widgets/WidgetProductFeatures';

const ProductDefaultPage = () => {
    const params = useParams();
    const dispatch = useDispatch();
    const { pid } = params;
    const { loading, getStrapiProduct, product } = useGetProducts();
    const [quantity, setQuantity] = useState(1);

    const [desc, setDesc] = useState('description')

    const { singlecats, singleproducts, addcart } = useSelector(
        (state) => state.product
    );
    const { token } = useSelector((state) => state.auth);
    const getSingleProductData = singleproducts?.results?.data?.data;

    const changeDesc = (name) => {
        setDesc(name)
    }


    useEffect(() => {
        dispatch(getSingleProduct(pid));
    }, [pid]);

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
                    <HeaderMobileProduct />
                </>
            );
        }
        if (product) {
            return (
                <>
                    <HeaderProduct product={product} />
                    <HeaderMobileProduct />
                </>
            );
        } else {
            return (
                <>
                    <HeaderDefault />
                    <HeaderMobileProduct />
                </>
            );
        }
    }, [loading, product]);

    return (
        <PageContainer
            header={headerView}
            title={product?.attributes.title || 'Untitled Product'}>
            <BreadCrumb breacrumb={breadCrumb} layout="fullwidth" />
            <div className="ps-top-categories">
                <div className="ps-container">
                    <div className="">
                        {singleproducts?.isLoading && (
                            <div className="w-full h-[300px] items-center justify-center flex">
                                <ClipLoader className="w-9 h-9" />
                            </div>
                        )}
                        {!singleproducts?.isLoading && (
                            <div>
    <div className="flex my-20 w-full justify-between  space-x-4 font-montserrat">
                                <div className=" border-2 h-fit border-yellow-700 p-4">
                                    <img
                                        src={
                                            getSingleProductData?.image_url
                                                ? getSingleProductData?.image_url
                                                : '/static/toy.jpg'
                                        }
                                        alt=""
                                        className="w-[70px] h-[70px] object-cover rounded-lg "
                                        // width={500}
                                        // height={500}
                                    />
                                </div>
                                <div>
                                    <img
                                        src={
                                            getSingleProductData?.image_url
                                                ? getSingleProductData?.image_url
                                                : '/static/toy.jpg'
                                        }
                                        alt=""
                                        className="w-[300px] h-[260px] object-cover rounded-lg "
                                        // width={500}
                                        // height={500}
                                    />
                                </div>
                                <div className="w-[40%]">
                                    <p className="text-[36px] font-semibold text-black  ">
                                        {getSingleProductData?.name}
                                    </p>
                                    <div className="flex space-x-6">
                                        <p>Brand: | No brand</p>
                                        <Rating />

                                        <span>1 Review</span>
                                    </div>

                                    {/* <hr /> */}
                                    <div className='h-[1px] bg-gray-400 w-full mt-5 ' >
                                        
                                    </div>

                                    <p className="pt-4">
                                        SKU: {getSingleProductData?.sku}
                                    </p>

                                    <div className="text-black font-semibold text-[24px] py-3 space-x-1 font-urbanist flex items-center ">
                                        <div>
                                            <img
                                                src="/static/Naira.png"
                                                alt=""
                                            />
                                        </div>
                                        <p className="font-bold text-black text-[24px]">
                                            {Math.floor(
                                                getSingleProductData?.price
                                            )}
                                        </p>
                                    </div>
                                    <p className="pt-4 text-[16px]">
                                        category:{' '}
                                        {getSingleProductData?.category?.name}{' '}
                                        {/* <span>
                                    {' '}
                                    | similar product from{' '}
                                    {getSingleProductData?.category?.name}{' '}
                                </span>{' '} */}
                                    </p>
                                    <div className='h-[1px] bg-gray-400 w-full mt-5 ' >
                                        
                                        </div>
                                    <div className="flex items-center pt-7 space-x-8">
                                        <div className='w-[20%]'>
                                            <p className="pt-2  text-black font-semibold">Quantity</p>
                                            <div className="flex  border-2  px-2 py-2 justify-between border-gray-400 items-center">
                                                <button
                                                    onClick={handleSubtract}>
                                                    <img
                                                        src={'/static/sub.png'}
                                                        alt=""
                                                    />
                                                </button>
                                                <p className="text-black font-bold px-2 text-[13px]">
                                                    {quantity}
                                                </p>
                                                <button onClick={handleAdd}>
                                                    <img
                                                        src={'/static/add.png'}
                                                        alt=""
                                                    />
                                                </button>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() =>
                                                addToCart(
                                                    getSingleProductData?.id
                                                )
                                            }
                                            className="bg-black w-[40%] text-white mt-6 font-bold tet-[14px] py-4 rounded-md ">
                                            {addcart?.isLoading ? (
                                                <ClipLoader
                                                    size={12}
                                                    color="white"
                                                />
                                            ) : (
                                                'Add to cart'
                                            )}
                                        </button>
                                        <div>
                                            <MdFavoriteBorder size={23} />
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <WidgetProductFeatures />
                                </div>
                            </div>
                            <div className='flex space-x-4 mb-6 ' >
                            <div className={`font-bold text-4xl cursor-pointer ${desc === 'description' ? 'border-b-2 border-blue-700 pb-2' : 'text-black' }  `}  onClick={() => changeDesc('description') }>Description</div>
                            <div className={`font-bold text-4xl cursor-pointer ${desc === 'review' ? 'border-b-2 border-blue-700 pb-2' : 'text-black' }  `} onClick={() => changeDesc('review') }  >Reviews</div>
                            {/* <div className='font-bold text-2xl' >Description</div> */}
                        </div>
                        <div>
                            {desc === "description" && <Description description={getSingleProductData?.description} /> }
                            {desc === "review" && <Review /> }
                        </div>
                            </div>
                        
                        )}

                     
                    </div>
                </div>
            </div>
            <Newletters />
        </PageContainer>
    );
};

export default ProductDefaultPage;

const Description = ({description}) => {
return (
    <p>{description}</p>
)
}

const Review = () => {

}
