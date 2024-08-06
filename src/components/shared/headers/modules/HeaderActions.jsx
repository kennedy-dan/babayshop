import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Link from 'next/link';
import MiniCart from '~/components/shared/headers/modules/MiniCart';
import AccountQuickLinks from '~/components/shared/headers/modules/AccountQuickLinks';
import { logOutCustomer } from '~/redux/features/authSlice';

const HeaderActions = () => {
    const dispatch = useDispatch()
    // const compareItems = useSelector(({ ecomerce }) => ecomerce.compareItems);
    // const wishlistItems = useSelector(({ ecomerce }) => ecomerce.wishlistItems);
    // const isLoggedIn = useSelector(({ user }) => user.isLoggedIn);
    const {token} = useSelector(state => state.auth)
    const {getfav} = useSelector(state => state.product)

    const fav = getfav?.results?.data?.data

    const headerAuthContent = useMemo(() => {
        return <AccountQuickLinks isLoggedIn={true} />;
    }, []);
    const logOut = () => {
        dispatch(logOutCustomer())
    }

    console.log(token)

    return (
        <div className="header__actions">
          {token &&<>   <Link href="/account/wishlist" className="header__extra">
                <i className="icon-heart" />
                <span>
                    <i>{getfav ? fav?.length : 0}</i>
                </span>
            </Link>
            <MiniCart />
            <div>
                <button onClick={logOut} >Logout</button>
            </div></> }

            {!token &&   <div className="ps-block--user-header">
                <div className="ps-block__left">
                     <i className="icon-user" />
                 </div>
                 <div className="ps-block__right">
                     <Link href="/account/login">Login</Link>
                     <Link href="/account/register">Register</Link>
                 </div>
             </div>}
         
            {headerAuthContent}
        </div>
    );
};

export default HeaderActions;
