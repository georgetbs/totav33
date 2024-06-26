import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useState } from 'react';
import Modal from 'react-modal';
import LanguageSelector from '@/components/LanguageSelector';

Modal.setAppElement('#__next');

export default function Header() {
  const router = useRouter();
  const { t } = useTranslation('common');
  const { mode } = router.query;

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  const handleNavigation = (path) => {
    if (mode && router.query.questions) {
      openConfirmModal(() => {
        router.push(path);
      });
    } else {
      router.push(path);
    }
  };

  const openConfirmModal = (action) => {
    setConfirmAction(() => action);
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setConfirmAction(null);
  };

  return (
    <header className="p-4 border-b-2 border-primary flex justify-between items-center">
      <div className="flex-grow text-center md:text-left">
        <h1 className="text-2xl hidden md:block">{t('header_title')}</h1>
      </div>
      <nav>
        <ul className="flex space-x-4">
          <li>
            <button onClick={() => handleNavigation('/totatests')} className="text-primary p-4 hover:underline">
              {t('home')}
            </button>
          </li>
        </ul>
      </nav>
      {router.pathname === '/totatests' && <LanguageSelector />}
      <Modal
        isOpen={isConfirmModalOpen}
        onRequestClose={closeConfirmModal}
        className="flex items-center justify-center h-screen"
        overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75"
      >
        <div className="bg-white p-6 rounded shadow-lg">
          <h2 className="text-xl mb-4">{t('confirm_navigation')}</h2>
          <div className="flex justify-end space-x-4">
            <button onClick={closeConfirmModal} className="px-4 py-2 border border-primary text-primary">
              {t('no')}
            </button>
            <button
              onClick={() => {
                confirmAction();
                closeConfirmModal();
              }}
              className="px-4 py-2 bg-primary text-white"
            >
              {t('yes')}
            </button>
          </div>
        </div>
      </Modal>
    </header>
  );
}
