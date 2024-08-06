'use client';

import SearchResult from '~/components/SearchModule/SearchResult'
import { getAllProducts } from '~/redux/features/productSlice'
import { useParams } from 'next/navigation'
import React,{useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PageContainer from '~/components/layouts/PageContainer';
import FooterDefault from '~/components/shared/footers/FooterDefault';
import Newletters from '~/components/partials/commons/Newletters';

const Search = () => {
  const dispatch = useDispatch()
  const params = useParams()
  const {token} = useSelector(state => state.auth)

  const {id} = params
  console.log(id)
  useEffect(() => {
    if(id) {
      const data = {
        search: id
      }
      dispatch(getAllProducts(data))

    }
  }, [id])
  
  return (
    <PageContainer footer={<FooterDefault />} title="Shopping Cart">
        <SearchResult name={id} />
        </PageContainer>
  )
}

export default Search