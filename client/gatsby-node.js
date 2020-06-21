const path = require('path');
const { createFilePath } = require('gatsby-source-filesystem');

const PostTemplate = path.resolve('./src/templates/post-template.js');
const BlogTemplate = path.resolve('./src/templates/blog-template.js');

exports.onCreateNode = ({ node, getNode, actions }) => {
  const { createNodeField } = actions;
  if (node.internal.type === 'MarkdownRemark') {
    const slug = createFilePath({ node, getNode, basePath: 'posts' });
    createNodeField({
      node,
      name: 'slug',
      value: slug,
    });
  }
};

// gatsby-node.js
// Implement the Gatsby API “onCreatePage”. This is
// called after every page is created.
exports.onCreatePage = async ({ page, actions }) => {
  const { createPage } = actions;

  // page.matchPath is a special key that's used for matching pages
  // only on the client.
  if (page.path.match(/^\/email-verification/)) {
    page.matchPath = `/email-verification/*`;
    // Update the page.
    createPage(page);
  }

  if (page.path.match(/^\/reset-password/)) {
    page.matchPath = `/reset-password/:token`;
    // Update the page.
    createPage(page);
  }
};

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const result = await graphql(`
    {
      allMarkdownRemark {
        edges {
          node {
            fields {
              slug
            }
          }
        }
      }
    }
  `);

  const posts = result.data.allMarkdownRemark.edges;
  posts.forEach(({ node: post }) => {
    createPage({
      path: `posts${post.fields.slug}`,
      component: PostTemplate,
      context: {
        slug: post.fields.slug,
      },
    });
  });

  const postsPerPage = 5;
  const totalPages = Math.ceil(posts.length / postsPerPage);

  Array.from({ length: totalPages }).forEach((_, index) => {
    const currentPage = index + 1;
    const isFirstPage = index === 0;
    const isLastPage = currentPage === totalPages;

    createPage({
      path: isFirstPage ? '/blog' : `/blog/${currentPage}`,
      component: BlogTemplate,
      context: {
        limit: postsPerPage,
        skip: index * postsPerPage,
        isFirstPage,
        isLastPage,
        currentPage,
        totalPages,
      },
    });
  });
};
