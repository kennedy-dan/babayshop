import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Pagination } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { Modal } from "antd/lib";
import { addtocart, getSingleProduct, getcartData,  favAction,
  getFavorites,
  getAllProducts, } from "~/redux/features/productSlice";
import { ClipLoader } from "react-spinners";
import Image from "next/image";
// import ProductDescription from "../UI/ProductDescription";
import { MdOutlineFavorite, MdFavorite } from "react-icons/md";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { CiShoppingCart } from 'react-icons/ci';
import { MdFavoriteBorder } from 'react-icons/md';
import { motion } from 'framer-motion';
const SearchResult = ({name}) => {

  const dispatch = useDispatch();
  const router = useRouter()
  const { allproducts, singleproducts, addcart } = useSelector((state) => state.product);
  const [openTrack, setOpenTrack] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [currentItems, setCurrentItems] = useState([]);
  const [loadingFavorites, setLoadingFavorites] = useState({});

  const metaData = allproducts?.results?.data?.metadata;
  const data = allproducts?.results?.data?.data?.data;
  const getSingleProductData = singleproducts?.results?.data?.data?.data;
  const { token } = useSelector((state) => state.auth);

  const itemsPerPage = 10;

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
      const data = {
        name: name
      }
    dispatch(getAllProducts(data))

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

  const handleTrackClose = () => {
    setOpenTrack(false);
  };

  const handleTrackOpen = (id) => {
    setOpenTrack(true);
    dispatch(getSingleProduct(id));
  };

  const handleSubtract = () => {
    if(quantity < 2){
      setQuantity(1)
    }else {
      setQuantity(quantity - 1)

    }
  }

  const handleAdd = () => {
    setQuantity(quantity + 1)
  }

  useEffect(() => {
    if(addcart.success){
      setOpenTrack(false);
      setQuantity(1)

    }
    
 
  }, [addcart.success])
  

 const addToCart = (id) => {

  const data = {
    product_id : id,
    quantity: quantity
  }
  dispatch(addtocart(data))
 }

 useEffect(() => {
  if(token){
    dispatch(getcartData());

  }
}, [ addcart, token]);
  return (
    <section>
    
        <div className="py-20 px-10 lg:px-[20px] lg:py-[20px] xl:px-[100px] xl:py-[100px]">
        <p className='text-[18px] font-bold text-black font-montserrat' >Search Result for: {name}</p>

          {!data?.length && <div className='mt-4' ><p className='font-[500] text-4xl' >No record found</p></div>}

      
          <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 gap-6 ">
                        {currentItems?.map((items, index) => (
                            <motion.div
                                key={index}
                                whileHover="hover"
                                initial="rest"
                                animate="rest"
                                className="mt-6 font-urbanist hover:border-2 hover:p-5">
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

                            

                                <p className="text-black font-semibold uppercase text-[13px]">
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
  )
}

export default SearchResult