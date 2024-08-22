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
    <footer className="p-4 border-t-2 border-primary text-center mt-auto space-y-6">
      <div className="flex flex-col items-center space-y-4">
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
        <p>&copy; 2024 <a href="https://tota.ge" target="_blank" rel="noopener noreferrer" className="text-green-600 underline">Tota.ge</a> Citizenship Test App</p>
        <div className="" id="top-ge-counter-container" data-site-id="117540"></div>
      </div>
      <Script src="//counter.top.ge/counter.js" async />
    </footer>
  );
}
