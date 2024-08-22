// components/layouts/Footer.js

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { FaTelegramPlane, FaEnvelope } from 'react-icons/fa';
import Script from 'next/script';

export default function Footer() {
  const router = useRouter();
  const { locale } = router;

  const [copyMessage, setCopyMessage] = useState('');

  const handleCopyEmail = () => {
    const email = 'founder.tota.ge@gmail.com';
    navigator.clipboard.writeText(email);
    const message =
      locale === 'ka'
        ? 'ელ. ფოსტის მისამართი დაკოპირდა.'
        : locale === 'ru'
        ? 'Адрес почты скопирован.'
        : 'Email address copied.';
    setCopyMessage(message);

    setTimeout(() => {
      setCopyMessage('');
    }, 3000);
  };

  return (
    <footer className="p-4 flex flex-col items-center justify-center border-t-2 border-green-800 text-center mt-auto space-y-6">
      <div className="flex space-x-4">
        <button
          onClick={handleCopyEmail}
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center space-x-2 hover:bg-blue-600 transition"
        >
          <FaEnvelope className="text-white" />
          <span>
            {locale === 'ka'
              ? 'დაგვიკავშირდით ელ. ფოსტაზე'
              : locale === 'ru'
              ? 'Написать на почту'
              : 'Email Us'}
          </span>
        </button>
        <a
          href="https://t.me/george_tbs"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-500 text-white px-4 py-2 rounded flex items-center space-x-2 hover:bg-blue-600 transition"
        >
          <FaTelegramPlane className="text-white" />
          <span>
            {locale === 'ka'
              ? 'დაგვიკავშირდით Telegram-ში'
              : locale === 'ru'
              ? 'Связаться в Telegram'
              : 'Contact on Telegram'}
          </span>
        </a>
      </div>
      {copyMessage && <p className="text-green-600">{copyMessage}</p>}
      <div className="flex flex-col items-center text-center mt-4">
        {locale === 'ka' ? (
          <>
            <p>&copy; 2024 <a href="https://tota.ge" target="_blank" rel="noopener noreferrer" className="text-green-600 underline">Tota.ge</a> გთავაზობთ ინფორმაციას და სიახლეებს შემდეგი წყაროებიდან:</p>
            <div className="flex flex-wrap justify-center space-x-4">
              <h3><a href="https://mtavari.tv" target="_blank" rel="noopener noreferrer" className="underline text-blue-600">მთავარი არხი (Mtavari Arkhi)</a></h3>
              <h3><a href="https://imedinews.ge" target="_blank" rel="noopener noreferrer" className="underline text-blue-600">იმედი (Imedi)</a></h3>
              <h3><a href="https://1tv.ge" target="_blank" rel="noopener noreferrer" className="underline text-blue-600">1tv.ge</a></h3>
              <h3><a href="https://tvpirveli.ge" target="_blank" rel="noopener noreferrer" className="underline text-blue-600">TV პირველი (TV Pirveli)</a></h3>
              <h3><a href="https://alia.ge" target="_blank" rel="noopener noreferrer" className="underline text-blue-600">ალია (Alia)</a></h3>
              <h3><a href="https://tia.ge" target="_blank" rel="noopener noreferrer" className="underline text-blue-600">TIA.ge</a></h3>
              <h3><a href="https://publika.ge" target="_blank" rel="noopener noreferrer" className="underline text-blue-600">publika.ge</a></h3>
              <h3><a href="https://croco.ge" target="_blank" rel="noopener noreferrer" className="underline text-blue-600">croco.ge</a></h3>
              <h3><a href="https://europop.ge" target="_blank" rel="noopener noreferrer" className="underline text-blue-600">europop.ge</a></h3>
              <h3><a href="https://bm.ge" target="_blank" rel="noopener noreferrer" className="underline text-blue-600">bm.ge</a></h3>
            </div>
          </>
        ) : locale === 'ru' ? (
          <>
            <p>&copy; 2024 <a href="https://tota.ge" target="_blank" rel="noopener noreferrer" className="text-green-600 underline">Tota.ge</a> предлагает информацию и новости из следующих источников:</p>
            <div className="flex flex-wrap justify-center space-x-4">
              <h3><a href="https://1tv.ge" target="_blank" rel="noopener noreferrer" className="underline text-blue-600">1tv.ge</a></h3>
              <h3><a href="https://bm.ge" target="_blank" rel="noopener noreferrer" className="underline text-blue-600">bm.ge</a></h3>
            </div>
          </>
        ) : (
          <>
            <p>&copy; 2024 <a href="https://tota.ge" target="_blank" rel="noopener noreferrer" className="text-green-600 underline">Tota.ge</a> provides information and updates from the following sources:</p>
            <div className="flex flex-wrap justify-center space-x-4">
              <h3><a href="https://georgiatoday.ge" target="_blank" rel="noopener noreferrer" className="underline text-blue-600">Georgia Today</a></h3>
              <h3><a href="https://imedinews.ge" target="_blank" rel="noopener noreferrer" className="underline text-blue-600">Imedi.ge</a></h3>
              <h3><a href="https://1tv.ge" target="_blank" rel="noopener noreferrer" className="underline text-blue-600">1tv.ge</a></h3>
              <h3><a href="https://bm.ge" target="_blank" rel="noopener noreferrer" className="underline text-blue-600">bm.ge</a></h3>
            </div>
          </>
        )}
      </div>
      <div className="" id="top-ge-counter-container" data-site-id="117540"></div>
      <Script src="//counter.top.ge/counter.js" async />
    </footer>
  );
}
