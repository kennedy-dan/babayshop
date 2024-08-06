import React from 'react';
import Link from 'next/link';
import useProduct from '~/hooks/useProduct';

const CartProduct = ({ product }) => {
    const { thumbnailImage } = useProduct(product.attributes, product.id);
    return (
        <div className="ps-product--cart">
            <div className="ps-product__thumbnail">
                <Link href={`/product/${product?.product?.id}`}>
                    <img src={product?.product?.image_url} alt='product image' />
                </Link>
            </div>
            <div className="ps-product__content">{product.title}</div>
        </div>
    );
};

export default CartProduct;
