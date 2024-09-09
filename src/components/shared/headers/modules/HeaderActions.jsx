import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import MiniCart from '~/components/shared/headers/modules/MiniCart';
import AccountQuickLinks from '~/components/shared/headers/modules/AccountQuickLinks';
import { logOutCustomer } from '~/redux/features/authSlice';
import { FaRegUser } from 'react-icons/fa';
import { CiUser } from 'react-icons/ci';
import { IoIosMenu } from 'react-icons/io';
import { MdOutlineFavorite } from "react-icons/md";

const HeaderActions = ({ showDrawerAdv }) => {
    const dispatch = useDispatch();
    // const compareItems = useSelector(({ ecomerce }) => ecomerce.compareItems);
    // const wishlistItems = useSelector(({ ecomerce }) => ecomerce.wishlistItems);
    // const isLoggedIn = useSelector(({ user }) => user.isLoggedIn);
    const { token } = useSelector((state) => state.auth);
    const { getfav } = useSelector((state) => state.product);

    const fav = getfav?.results?.data?.data;

    const headerAuthContent = useMemo(() => {
        return <AccountQuickLinks isLoggedIn={true} />;
    }, []);
    const logOut = () => {
        dispatch(logOutCustomer());
    };

    console.log(token);

    return (
        <div className="header__actions">
              <div className="block">
                        <Link
                            href="/account/wishlist"
                            className="relative ">
                            {/* <i className="icon-heart" /> */}
                            <img src="/static/fav.png" alt="" className='md:w-fit  w-8' />
                            <div className=' w-7 h-7 md:w-9 md:h-9 md:text-base text-[12px] absolute left-4 md:left-7 md:top-7 flex justify-center items-center text-white text-center   bg-[#F5128F] rounded-full' >
                                <div>{getfav ? fav?.length : 0}</div>
                            </div>
                        </Link>
                    </div>
                    <div>
                        <MiniCart />
                    </div>
            {token && (
                <>
                    {' '}
                  
                    <div className="md:block hidden">
                        <Link
                            href="/account"
                            className=" md:block hidden">
                            <img src="/static/acc.png" alt="" />
                        </Link>
                    </div>
                    <div className="mt-[0px] md:block hidden">
                        <button className="text-white" onClick={logOut}>
                            Logout
                        </button>
                    </div>
                </>
            )}

            <buton className='md:hidden block' onClick={showDrawerAdv}>
                <IoIosMenu color="white" size={26} />
            </buton>

            {!token && (
                <div className=" md:block hidden">
                    {/* <div className="ps-block__left">
                        <i className="icon-user" />
                    </div> */}
                    <div className=" text-white">
                        <div>
                        <Link href="/account/login">Login</Link>

                        </div>
                        <div>
                        <Link href="/account/register">Register</Link>

                        </div>
                    </div>
                </div>
            )}

            {headerAuthContent}
        </div>
    );
};

export default HeaderActions;
