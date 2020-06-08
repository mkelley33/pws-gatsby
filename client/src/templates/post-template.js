import React from 'react';

import Layout from '@components/layout';
import { graphql } from 'gatsby';

export default ({ data: post }) => (
  <Layout>
    <h2>{post.markdownRemark.frontmatter.title}</h2>
    <div dangerouslySetInnerHTML={{ __html: post.markdownRemark.html }} />
  </Layout>
);

export const query = graphql`
  query($slug: String!) {
    markdownRemark(fields: { slug: { eq: $slug } }) {
      html
      frontmatter {
        title
      }
    }
  }
`;
