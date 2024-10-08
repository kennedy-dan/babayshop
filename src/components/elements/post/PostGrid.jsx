import React, { useMemo } from 'react';
import Link from 'next/link';
import moment from 'moment';
import Image from 'next/image';
// import { getStrapiImageURL } from '~/services/strapiServices/image/getStrapiImageService';

const PostGrid = ({ post }) => {
    const thumbnailImage = post.attributes?.thumbnail ? (
        <></>
    ) : (
        <img src="https://placehold.co/600x400" alt="" />
    );

    return (
        <article className="ps-post">
            <div className="ps-post__thumbnail">
                <Link
                    href={'/post/[pid]'}
                    as={`/post/${post.id}`}
                    className="ps-post__overlay"
                />
                {thumbnailImage}
            </div>
            <div className="ps-post__content">
                <div className="ps-post__meta">Others</div>
                <Link
                    href={'/post/[pid]'}
                    as={`/post/${post.id}`}
                    className="ps-post__title">
                    {post.attributes.name}
                </Link>
                <p>
                    {moment(post.attributes.created_at).format('ll')} by
                    <Link href={'/blog'}> Martfury</Link>
                </p>
            </div>
        </article>
    );
};

export default PostGrid;
