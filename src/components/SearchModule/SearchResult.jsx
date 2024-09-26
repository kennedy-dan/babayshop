import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { Pagination } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { Modal } from 'antd/lib';
import {
    addtocart,
    getSingleProduct,
    getcartData,
    favAction,
    getFavorites,
    getAllProducts,
} from '~/redux/features/productSlice';
import { ClipLoader } from 'react-spinners';
import Image from 'next/image';
// import ProductDescription from "../UI/ProductDescription";
import { MdOutlineFavorite, MdFavorite } from 'react-icons/md';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';
import { CiShoppingCart } from 'react-icons/ci';
import { MdFavoriteBorder } from 'react-icons/md';
import { motion } from 'framer-motion';
const SearchResult = ({ name }) => {
    const dispatch = useDispatch();
    const router = useRouter();
    const { allproducts, singleproducts, addcart } = useSelector(
        (state) => state.product
    );
    const [openTrack, setOpenTrack] = useState(false);

    const [currentPage, setCurrentPage] = useState(1);
    const [quantity, setQuantity] = useState(1);
    const [currentItems, setCurrentItems] = useState([]);
    const [loadingFavorites, setLoadingFavorites] = useState({});

    const metaData = allproducts?.results?.data?.metadata;
    const data = allproducts?.results?.data?.data?.data;
    const getSingleProductData = singleproducts?.results?.data?.data?.data;
    const { token } = useSelector((state) => state.auth);
    const [isMobile, setIsMobile] = useState(false);
    const [activeItem, setActiveItem] = useState(null);

    const itemsPerPage = 10;

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
            const data = {
                search: name,
            };
            dispatch(getAllProducts(data));
        } catch (error) {
            toast.error(`Failed to ${action} favorite: ${error.message}`);
        } finally {
            setLoadingFavorites((prev) => ({ ...prev, [id]: false }));
        }
    };

    useEffect(() => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        setCurrentItems(data?.slice(indexOfFirstItem, indexOfLastItem) || []);
    }, [currentPage, data]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
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

    const handleTrackClose = () => {
        setOpenTrack(false);
    };

    const handleTrackOpen = (id) => {
        setOpenTrack(true);
        dispatch(getSingleProduct(id));
    };

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

    useEffect(() => {
        if (addcart.success) {
            setOpenTrack(false);
            setQuantity(1);
        }
    }, [addcart.success]);

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
    return (
        <section>
            <div className="py-20 px-10 lg:px-[20px] lg:py-[20px] xl:px-[100px] xl:py-[100px]">
                <p className="text-[18px] font-bold text-black font-montserrat">
                    Search Result for: {name}
                </p>

                {!data?.length && (
                    <div className="mt-4">
                        <p className="font-[500] text-4xl">No record found</p>
                    </div>
                )}

                <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-2 gap-6 ">
                    {currentItems?.map((data, index) => (
                        <motion.div
                            key={index}
                            onTouchStart={() => handleTouchStart(data?.id)}
                            onTouchEnd={handleTouchEnd}
                            whileHover={isMobile ? {} : 'hover'}
                            initial="rest"
                            animate="rest"
                            className=" mb-6 ">
                            <div className="relative">
                                <div style={{background:'white'}} className="justify-cente flex rounded-3xl bg-white hover:bg-gray-800  p-3 md:p-8 ">
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
                                            className="md:h-[230px] md:w-[250px] w-[190px] h-[150px] object-contain sm:object-cover rounded-lg cursor-pointer"
                                        />
                                    </Link>
                                    <motion.div
                                        className="flex absolute bottom-0 left-0 justify-center right-0  bg-opacity-80 p-2"
                                        initial={{ opacity: 0, y: '10%' }}
                                        variants={{
                                            rest: { opacity: 0, y: '10%' },
                                            hover: { y: -55, opacity: 1 },
                                        }}
                                        animate={
                                            isMobile && activeItem === data?.id
                                                ? { opacity: 1, y: -55 }
                                                : {}
                                        }
                                        // animate='rest'
                                        // animate={showActions || !isMobile ? "hover" : "rest"}
                                        transition={{ duration: 0.3 }}>
                                        <div
                                            onClick={() => addToCart(data?.id)}
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
                                        <p className="uppercase text-[14px] md:text-[18px]">
                                            {data?.name}
                                        </p>
                                    </div>
                                </Link>
                            </div>
                            <Link href={`/product/${data?.id}`}>
                                <hr className="my-2" />
                                <div className="text-center">
                                    <p className="text-blue-600 text-[13px] md:text-[16px]">
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
            <div className="flex py-20 justify-center">
                <div className="flex justify-center">
                    <Pagination
                        current={currentPage}
                        total={data?.length || 0}
                        pageSize={itemsPerPage}
                        onChange={handlePageChange}
                    />
                </div>
            </div>
            {/* <Modal
        width={800}
        style={{ height: "", width: "600px" }}
        open={openTrack}
        onCancel={handleTrackClose}
        footer={false}
      >
           <ProductDescription singleproducts={singleproducts} getSingleProductData={getSingleProductData} handleSubtract={handleSubtract} handleAdd={handleAdd } addToCart={addToCart} quantity={quantity} addcart={addcart} />

       
      
      </Modal> */}
        </section>
    );
};

export default SearchResult;
