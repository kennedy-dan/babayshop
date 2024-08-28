'use client';
import React, {useEffect} from 'react';
import Providers from '~/redux/provider';
import PageLoader from '~/components/elements/common/PageLoader';
import MobileNavigation from '~/components/shared/navigation/MobileNavigation';
import { BackTop } from 'antd';
import getHeadData, {
    generatePageMetadata,
} from '~/utilities/seo/RoutePathsSEO';
import './globals.css'
import { useDispatch, useSelector } from 'react-redux';
import { getcartData, getFavorites, getPages } from '~/redux/features/productSlice';


export const metadata = generatePageMetadata(getHeadData('/'));

export default function Template({ children }) {
    const dispatch = useDispatch()
    const { token } = useSelector((state) => state.auth);

    useEffect(() => {
      if(token){
        dispatch(getcartData())
        dispatch(getFavorites())
      }
    
     
    }, [])

    useEffect(() => {
      dispatch(getPages())
  
    }, [])
    
    
    return (
        <>
            {children}
            <PageLoader />
            {/* <MobileNavigation /> */}
            <BackTop>
                <button className="ps-btn--backtop">
                    <i className="icon-arrow-up" />
                </button>
            </BackTop>
        </>
    );
}
