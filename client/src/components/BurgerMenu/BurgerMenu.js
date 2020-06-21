import React from 'react';
import { slide as Menu } from 'react-burger-menu';
import { Link } from 'gatsby';

const BurgerMenu = () => (
  <Menu right>
    <Link to="/">About</Link>
    <Link to="/blog">Blog</Link>
    <Link to="/contact">Contact</Link>
    {/* <Link to="/photos">Photos</Link> */}
  </Menu>
);

export default BurgerMenu;
