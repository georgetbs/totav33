// pages/_app.js
import '@/styles/globals.css';
import '../public/fonts/fonts.css'; // Подключение глобальных шрифтов
import React, { useEffect } from 'react';
import Head from 'next/head';
import { appWithTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import i18n from 'i18next';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const savedLanguage = localStorage.getItem('i18nextLng');
    if (savedLanguage && savedLanguage !== router.locale) {
      i18n.changeLanguage(savedLanguage);
      router.push(router.pathname, router.asPath, { locale: savedLanguage });
    }
  }, [router]);

  const metaInfo = {
    ka: {
      title: 'TOTA.GE - მთელი საქართველო ერთ სივრცეში',
      description: 'Tota.ge - სრული ინფორმაციული პორტალი საქართველოში: პოლიტიკა, სპორტი, საზოგადოება, ეკონომიკა და სხვა.',
    },
    ru: {
      title: 'TOTA.GE - Информационный портал Грузии',
      description: 'Tota.ge - информационный портал в Грузии: политика, спорт, общество, экономика, мода и многое другое.',
    },
    en: {
      title: 'TOTA.GE - The Information Portal of Georgia',
      description: 'Tota.ge - an information portal in Georgia: politics, sports, society, economy, fashion, and more.',
    },
  };

  const { locale } = router;
  const { title, description } = metaInfo[locale] || metaInfo['ka'];

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>{title}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={description} />
        <meta charSet="UTF-8" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <Component {...pageProps} />
      </main>
    </div>
  );
}

export default appWithTranslation(MyApp);
