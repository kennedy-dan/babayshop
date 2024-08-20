import React, { useEffect, useMemo, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useEcomerce from '~/hooks/useEcomerce';
import CartProduct from '~/components/elements/products/CartProduct';
import useGetProducts from '~/hooks/useGetProducts';
import { ClipLoader } from 'react-spinners';
import {
    addtocart,
    favAction,
    getFavorites,
} from '~/redux/features/productSlice';
import { MdOutlineFavorite, MdFavorite } from 'react-icons/md';
import { MdFavoriteBorder } from 'react-icons/md';
import { CiShoppingCart } from 'react-icons/ci';
import { toast } from 'react-toastify';

// import { MdFavoriteBorder } from 'react-icons/md';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
export default function Wishlist() {
    const dispatch = useDispatch();
    const ecomerce = useSelector(({ ecomerce }) => ecomerce);
    const { addItem, removeItem } = useEcomerce();
    const { getfav } = useSelector((state) => state.product);

    // const wishlistItems = useSelector(({ ecomerce }) => ecomerce.wishlistItems);
    const { loading, getStrapiProducts, products } = useGetProducts();
    const fav = getfav?.results?.data?.data;
    const { token } = useSelector((state) => state.auth);
    const [loadingFavorites, setLoadingFavorites] = useState({});
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
            // dispatch(getSingleProduct(pid));

            // dispatch(getSingleCats(getSingleProductData?.category?.id));
        } catch (error) {
            toast.error(`Failed to ${action} favorite: ${error.message}`);
        } finally {
            setLoadingFavorites((prev) => ({ ...prev, [id]: false }));
        }
    };

    // function getProducts() {
    //     if (wishlistItems.length > 0) {
    //         const query = {
    //             filters: {
    //                 id: {
    //                     $in: wishlistItems.map((item) => item.id),
    //                 },
    //             },
    //         };
    //         getStrapiProducts(query);
    //     }
    // }

    // useEffect(() => {
    //     getProducts();
    // }, [wishlistItems]);

    const addToCart = (id) => {
        const data = {
            product_id: id,
            quantity: 1,
        };
        dispatch(addtocart(data));
    };

    return (
        <div className="">
            <div className="">
            
                <div className="ps-section__content">
                    {' '}
                    <>
                        {getfav?.isLoading && (
                            <div className="flex w-screen h-[70vh] items-center justify-center">
                                <ClipLoader size={20} />
                            </div>
                        )}
                        {!getfav?.isLoading && (
                            <div className="">
                                <div className="grid grid-cols-4 gap-6">
                                    {fav?.map((data, index) => (
                                        <motion.div
                                            key={data?.product?.id}
                                            whileHover="hover"
                                            initial="rest"
                                            animate="rest"
                                            className=" mb-6 ">
                                            <div className="relative">
                                                <div className="justify-cente flex rounded-3xl bg-white hover:bg-gray-800  p-8 ">
                                                    <Image
                                                        src={
                                                            data?.product
                                                                ?.image_url
                                                                ? data?.product
                                                                      ?.image_url
                                                                : '/static/toy.jpg'
                                                        }
                                                        width={500}
                                                        height={500}
                                                        alt=""
                                                        className="h-[230px] w-[250px] object-cover rounded-lg cursor-pointer"
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
                                                                    data
                                                                        ?.product
                                                                        ?.id
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
                                                                    data
                                                                        ?.product
                                                                        ?.id,
                                                                    data
                                                                        ?.product
                                                                        ?.is_favorite
                                                                );
                                                            }}>
                                                            {loadingFavorites[
                                                                data?.product
                                                                    ?.id
                                                            ] ? (
                                                                // <ClipLoader size={20} color="#000000" />
                                                                <p></p>
                                                            ) : data?.product
                                                                  ?.is_favorite ? (
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
                                                    href={`/product/${data?.product?.id}`}>
                                                    <div className="text-center">
                                                        <p className="uppercase text-[18px]">
                                                            {
                                                                data?.product
                                                                    ?.name
                                                            }
                                                        </p>
                                                    </div>
                                                </Link>
                                            </div>
                                            <Link
                                                href={`/product/${data?.product?.id}`}>
                                                <hr className="my-2" />
                                                <div className="text-center">
                                                    <p className="text-blue-600 text-[16px]">
                                                        {
                                                            data?.product
                                                                ?.description
                                                        }
                                                    </p>
                                                </div>
                                                <div className="text-black font-semibold text-[20px] flex justify-center items-center">
                                                    <img
                                                        src="/static/Naira.png"
                                                        alt=""
                                                    />
                                                    <p className="pl-1">
                                                        {Math.floor(
                                                            data?.product?.price
                                                        )}
                                                    </p>
                                                </div>
                                            </Link>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                </div>
            </div>
        </div>
    );
}
