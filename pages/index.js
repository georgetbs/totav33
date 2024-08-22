// pages/index.js

import React, { useState } from 'react';
import MenuContainer from '../components/mainmenucontainer';
import Header from '../components/layouts/header';
import ColumnsContainer from '../components/columnscontainer';
import Feed from '../components/feed';
import Footer from '../components/layouts/footer'; // Импортируем футер

import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';

export default function Home() {
  const [areMenusVisible, setAreMenusVisible] = useState(false);
  const { t } = useTranslation('common');

  const toggleMenuVisibility = () => {
    setAreMenusVisible(!areMenusVisible);
  };

  const closeMenu = () => {
    setAreMenusVisible(false);
  };

  return (
    <>
      <main>
        <MenuContainer 
          areMenusVisible={areMenusVisible}
          toggleMenuVisibility={toggleMenuVisibility}
          closeMenu={closeMenu}
        />
        <Header />
        <ColumnsContainer />
        <Feed />
      </main>
      <Footer /> {/* Используем футер */}
    </>
  );
}

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
