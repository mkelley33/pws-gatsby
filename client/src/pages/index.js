import React from 'react';
import Layout from '@components/layout';

export default () => {
  document.title = 'About Me';
  return (
    <Layout>
      <section>
        <h1>About me</h1>
        <p>
          My name's Michaux Kelley. I’m a software developer, modern dude, natural-born-world-shaker, aspiring
          lepidopterist, philatelist, punk, writer, poet, and JavaScript hacker.
        </p>
        <p>
          I've been in software development for about fifteen years now and have coded everything from full stack to
          more recently as a full-on front-end engineer. What can I say? I love to code!
        </p>
      </section>
    </Layout>
  );
};
