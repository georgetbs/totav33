import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Header from '@/components/Header';

import Footer from '@/components/Footer';

export default function Home() {
  const { t } = useTranslation('common');

  return (
    <>
    <div className="container mx-auto">
      <Header />
      <main className="text-center p-10">
        <h1 className="text-3xl mb-8">{t('welcome')}!</h1>
        <div className="space-y-4 text-3xl">
          <Link href="totatests/test?mode=exam" passHref>
            <span className="block p-4 border-0 border-primary text-primary cursor-pointer">
              {t('start_exam')}
            </span>
          </Link>
          <Link href="totatests/test?mode=study" passHref>
            <span className="block p-4 border-0 border-primary text-primary cursor-pointer">
              {t('start_study')}
            </span>
          </Link>
        </div>
        <div className="mt-8">
        </div>
      </main>
     
    </div>
    <Footer />
     </>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
