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
} from '~/redux/features/productSlice';
import { FaShoppingCart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { CiShoppingCart } from 'react-icons/ci';
import { motion } from 'framer-motion';
import { MdOutlineFavorite, MdFavorite } from 'react-icons/md';
import { MdFavoriteBorder } from 'react-icons/md';
import Image from 'next/image';

const HomeDefaultTopCategories = () => {
    const dispatch = useDispatch();
    const { getcats, categoriesWithProducts, allproducts } = useSelector(
        (state) => state.product
    );
    const [loadingFavorites, setLoadingFavorites] = useState({});
    const { token } = useSelector((state) => state.auth);

    const allp = allproducts?.results?.data?.data?.data;
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

    const addToCart = (id) => {
        const data = {
            product_id: id,
            quantity: 1,
        };
        dispatch(addtocart(data));
        toast.success('done');
    };
    const catsData = getcats?.results?.data;

    return (
        <div className="ps-top-categories">
            <div className="ps-container">
                <h3>Top categories </h3>
                <div className="grid grid-cols-6 gap-5">
                    {catsData?.slice(0, 6)?.map((items, index) => (
                        <div key={index} className=" ">
                            <div className="">
                                <Link
                                    href={`/shop/${items?.id}`}
                                    // className="ps-block__overlay"
                                >
                                    <img
                                        src="/static/cats.png"
                                        alt="martfury"
                                        className="h-[190px] rounded-2xl"
                                    />
                                    <p className="text-center">{items?.name}</p>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-40">
                    <div>
                        <h3>New Arrival</h3>
                    </div>
                    <div className="flex justify-between">
                        {allp?.slice(0, 4)?.map((data, index) => (
                            <motion.div
                                key={data.id}
                                whileHover="hover"
                                initial="rest"
                                animate="rest"
                                className="  ">
                                <div className="relative">
                                    <div className="justify-cente flex rounded-3xl bg-white hover:bg-gray-800  p-9 mb-4 ">
                                        <Image
                                            src={
                                                data?.image_url
                                                    ? data?.image_url
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
                                                rest: { opacity: 0, y: '10%' },
                                                hover: { y: -37, opacity: 1 },
                                            }}
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
                                                className='mr-2'
                                            />
                                        </div>
                                        

                                            < >
                                                {Math.floor(data?.price)}
                                            </>
                                        
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
                            <div className="flex justify-between  w-full">
                                <div className="">
                                    <h3 className="text-black ">
                                        {items?.name}
                                    </h3>
                                </div>
                                <div>
                                    <Link href={`/shop/${items?.id}`}>
                                        View All
                                    </Link>
                                </div>
                            </div>
                            <div className="flex space-x-12 mt-4">
                                {items?.products?.slice(0, 6)?.map((data) => (
                                    <motion.div
                                        key={data.id}
                                        whileHover="hover"
                                        initial="rest"
                                        animate="rest"
                                        className="  ">
                                        <div className="relative">
                                            <div className="justify-cente flex rounded-3xl bg-white hover:bg-gray-800  p-9 mb-4 ">
                                                <Image
                                                    src={
                                                        data?.image_url
                                                            ? data?.image_url
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
                                                className='mr-2'
                                            />
                                        </div>
                                        

                                            < >
                                                {Math.floor(data?.price)}
                                            </>
                                        
                                    </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}

                <div className="flex justify-between mt-32">
                    <div>
                        <img src="/static/ads4.png" alt="" />
                    </div>
                    <div>
                        <img src="/static/ads5.png" alt="" />
                    </div>
                </div>
                {categoriesWithProducts?.results
                    ?.slice(3, 5)
                    ?.map((items, index) => (
                        <div key={index} className="mb-16 mt-32">
                            <div className="flex justify-between  w-full">
                                <div className="">
                                    <h3 className="text-black ">
                                        {items?.name}
                                    </h3>
                                </div>
                                <div>
                                    <Link href={`/shop/${items?.id}`}>
                                        View All
                                    </Link>
                                </div>
                            </div>
                            <div className="flex space-x-12 mt-4">
                                {items?.products?.slice(0, 6)?.map((data) => (
                                    <motion.div
                                        key={data.id}
                                        whileHover="hover"
                                        initial="rest"
                                        animate="rest"
                                        className="  ">
                                        <div className="relative">
                                            <div className="justify-cente flex rounded-3xl bg-white hover:bg-gray-800  p-9 mb-4 ">
                                                <Image
                                                    src={
                                                        data?.image_url
                                                            ? data?.image_url
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
                                                className='mr-2'
                                            />
                                        </div>
                                        

                                            < >
                                                {Math.floor(data?.price)}
                                            </>
                                        
                                    </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    ))}
                <div className="w-full mt-32">
                    <img src="/static/ads1.png" className="w-full" />
                </div>

                {categoriesWithProducts?.results
                    ?.slice(6, 8)
                    ?.map((items, index) => (
                        <div key={index} className="mb-16 mt-32">
                            <div className="flex justify-between  w-full">
                                <div className="">
                                    <h3 className="text-black ">
                                        {items?.name}
                                    </h3>
                                </div>
                                <div>
                                    <Link href={`/shop/${items?.id}`}>
                                        View All
                                    </Link>
                                </div>
                            </div>
                            <div className="flex space-x-6 mt-4">
                                {items?.products?.slice(0, 6)?.map((data) => (
                                    <motion.div
                                        key={data.id}
                                        whileHover="hover"
                                        initial="rest"
                                        animate="rest"
                                        className="  ">
                                        <div className="relative">
                                            <div className="justify-cente flex rounded-3xl bg-white hover:bg-gray-800  p-9 mb-4 ">
                                                <Image
                                                    src={
                                                        data?.image_url
                                                            ? data?.image_url
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
                                                className='mr-2'
                                            />
                                        </div>
                                        

                                            < >
                                                {Math.floor(data?.price)}
                                            </>
                                        
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
