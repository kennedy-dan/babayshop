import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import MiniCart from '~/components/shared/headers/modules/MiniCart';
import AccountQuickLinks from '~/components/shared/headers/modules/AccountQuickLinks';
import { logOutCustomer } from '~/redux/features/authSlice';
import { FaRegUser } from 'react-icons/fa';
import { CiUser } from 'react-icons/ci';
import { IoIosMenu } from 'react-icons/io';

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
                            className="header__extra ">
                            {/* <i className="icon-heart" /> */}
                            <img src="/static/fav.png" alt="" />
                            <span>
                                <i>{getfav ? fav?.length : 0}</i>
                            </span>
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
                            className="header__extra md:block hidden">
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
                <div className="ps-block--user-header md:block hidden">
                    {/* <div className="ps-block__left">
                        <i className="icon-user" />
                    </div> */}
                    <div className="ps-block__right text-white">
                        <Link href="/account/login">Login</Link>
                        <Link href="/account/register">Register</Link>
                    </div>
                </div>
            )}

            {headerAuthContent}
        </div>
    );
};

export default HeaderActions;
