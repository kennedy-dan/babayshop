'use client';

import SearchResult from '~/components/SearchModule/SearchResult'
import { getAllProducts } from '~/redux/features/productSlice'
import { useParams } from 'next/navigation'
import React,{useEffect, useState} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PageContainer from '~/components/layouts/PageContainer';
import FooterDefault from '~/components/shared/footers/FooterDefault';
import Newletters from '~/components/partials/commons/Newletters';

const Search = () => {
  const dispatch = useDispatch()
  const params = useParams()
  const {token} = useSelector(state => state.auth)

  const {id} = params
  const [searchTerm, setSearchTerm] = useState('');
  console.log(id)
  useEffect(() => {
    if(id) {
      setSearchTerm(decodeURIComponent(id));
      console.log(searchTerm)
      const data = {
        search: searchTerm
      }
      if(searchTerm){
        dispatch(getAllProducts(data))

      }

    }
  }, [id, searchTerm])
  
  return (
    <PageContainer footer={<FooterDefault />} title="Shopping Cart">
        <SearchResult name={searchTerm} />
        </PageContainer>
  )
}

export default Search