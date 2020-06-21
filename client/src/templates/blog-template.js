import React from 'react';
import { graphql, Link } from 'gatsby';

import Layout from '@components/layout';
import styles from './blog.module.css';

export default ({ data, pageContext }) => {
  const { currentPage, isFirstPage, isLastPage, totalPages } = pageContext;
  const nextPage = `/blog/${String(currentPage + 1)}`;
  const prevPage = currentPage - 1 === 1 ? '/blog' : `/blog/${String(currentPage - 1)}`;
  document.title = 'Blog Posts';
  return (
    <Layout>
      <h1>Blog Posts</h1>
      {data.allMarkdownRemark.edges.map(({ node }) => (
        <div key={node.id}>
          <h2 className={styles.blogPostsHeading}>
            <Link to={`/posts${node.fields.slug}`}>{node.frontmatter.title}</Link> - {node.frontmatter.date}
          </h2>
          <p>{node.excerpt}</p>
        </div>
      ))}
      <div>
        {!isFirstPage && (
          <Link to={prevPage} rel="prev">
            Prev Page
          </Link>
        )}
        {totalPages !== 1 &&
          Array.from({ length: totalPages }, (_, index) => (
            <Link key={index} to={`/blog/${index === 0 ? '' : index + 1}`}>
              {index + 1}
            </Link>
          ))}
        {!isLastPage && (
          <Link to={nextPage} rel="next">
            Next page
          </Link>
        )}
      </div>
    </Layout>
  );
};

export const query = graphql`
  query($skip: Int!, $limit: Int!) {
    allMarkdownRemark(skip: $skip, limit: $limit, sort: { order: DESC, fields: [frontmatter___date] }) {
      totalCount
      edges {
        node {
          fields {
            slug
          }
          id
          frontmatter {
            title
            date(formatString: "dddd, MMMM Do YYYY")
          }
          excerpt
        }
      }
    }
  }
`;
