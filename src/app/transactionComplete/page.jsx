"use client"
import { verifyPayment } from '~/redux/features/productSlice'
import Link from 'next/link'
import React, {useEffect} from 'react'
import { useDispatch } from 'react-redux'
import PageContainer from '~/components/layouts/PageContainer';
import { useSearchParams } from 'next/navigation';

const TranasactionComplete = () => {
  const dispatch = useDispatch()
  const searchParams = useSearchParams();
  const txRef = searchParams.get('tx_ref');


  useEffect(() => {

    if (txRef !== null) {
      const data = {
        reference: txRef
      }
      dispatch(verifyPayment( txRef ));
    }
  }, [txRef]);
  
  return (
    <PageContainer>
      <div className='h-screen w-screen  flex mt-10 justify-center items-center' >
        <img src='/static/img/success.svg' alt='' className='w-[50%]' />
      
      </div>
      <div className='flex justify-center my-10 ' >
          <Link href='/' >
          <button
                className=" bg-secondary w-[220px] text-white py-4 rounded-lg font-semibold text-[16px] "
              >
                      <p>Back Home</p>

              </button>
          </Link>
        </div>
    </PageContainer>
  )
}

export default TranasactionComplete