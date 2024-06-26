import '@/styles/globals.css'; // Импортируем стили сначала
import React, { useEffect } from 'react';
import Head from 'next/head';
import { appWithTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    // Проверяем, есть ли сохраненный язык в localStorage
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && savedLanguage !== router.locale) {
      // Переключаемся на сохраненный язык, если он отличается от текущего
      router.push(router.pathname, router.asPath, { locale: savedLanguage });
    }
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col">
      <Head>
        <title>TOTA.GE - მთელი საქართველო ერთ სივრცეში</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Tota.ge - სრული ინფორმაციული პორტალი საქართველოში, სანდო წყაროებიდან: პოლიტიკა, სპორტი, საზოგადოება, ეკონომიკა, მოდა..." />
        <meta charSet="UTF-8" />
        <link rel="icon" href="/favicon.ico" />
        {/* Другие теги meta и link */}
      </Head>
      <Component {...pageProps} />
    </div>
  );
}

export default appWithTranslation(MyApp);
