import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Modal from 'react-modal';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import languageData from '@/data/language.json';
import historyData from '@/data/history.json';
import lawData from '@/data/law.json';

const shuffleArray = (array) => array.sort(() => Math.random() - 0.5);

Modal.setAppElement('#__next');

export default function Test() {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { mode } = router.query;

  const categoryData = useMemo(() => ({
    language: languageData,
    history: historyData,
    law: lawData,
  }), []);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [pass, setPass] = useState(null);
  const [timer, setTimer] = useState(0);
  const [numQuestions, setNumQuestions] = useState(200);
  const [questionSet, setQuestionSet] = useState('first');
  const [useNumQuestions, setUseNumQuestions] = useState(true);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [confirmMode, setConfirmMode] = useState('');
  const [showHints, setShowHints] = useState(true); // Default to true

  useEffect(() => {
    const cachedHints = localStorage.getItem('showHints');
    if (cachedHints !== null) {
      setShowHints(JSON.parse(cachedHints));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('showHints', JSON.stringify(showHints));
  }, [showHints]);

  const [showCorrectAnswers, setShowCorrectAnswers] = useState(false);
  const [showIncorrectAnswers, setShowIncorrectAnswers] = useState(false);
  const [showAllAnswers, setShowAllAnswers] = useState(false);

  const handleCategoryChange = (category) => {
    const updatedCategories = selectedCategories.includes(category)
      ? selectedCategories.filter(cat => cat !== category)
      : [...selectedCategories, category];
    
    setSelectedCategories(updatedCategories);

    setNumQuestions(updatedCategories.length * 200 || 200);
    setUseNumQuestions(updatedCategories.length !== 1);
  };

  const handleStart = () => {
    if (selectedCategories.length === 0) {
      setAlertMessage(t('please_select_category'));
      setConfirmMode('alert');
      setIsConfirmModalOpen(true);
      return;
    }

    let allQuestions = [];
    selectedCategories.forEach(category => {
      const data = categoryData[category] || [];
      allQuestions = [...allQuestions, ...data];
    });

    if (mode === 'study') {
      if (useNumQuestions) {
        allQuestions = shuffleArray(allQuestions).slice(0, numQuestions);
      } else {
        const categoryQuestions = categoryData[selectedCategories[0]];
        switch (questionSet) {
          case 'first':
            allQuestions = categoryQuestions.slice(0, 50);
            break;
          case 'second':
            allQuestions = categoryQuestions.slice(50, 100);
            break;
          case 'third':
            allQuestions = categoryQuestions.slice(100, 150);
            break;
          case 'fourth':
            allQuestions = categoryQuestions.slice(150, 200);
            break;
          default:
            allQuestions = categoryQuestions;
            break;
        }
      }
    } else {
      allQuestions = shuffleArray(allQuestions);
    }

    if (mode === 'exam') {
      setQuestions(allQuestions.slice(0, 10));
      setTimer(20 * 60); // 20 минут
    } else {
      setQuestions(allQuestions);
    }

    router.replace({
      pathname: router.pathname,
      query: { ...router.query, questions: true },
    });
  };

  useEffect(() => {
    if (mode === 'exam' && timer > 0) {
      const timerId = setInterval(() => setTimer(timer - 1), 1000);
      if (timer === 1) handleFinish();
      return () => clearInterval(timerId);
    }
  }, [timer, mode]);

  const handleAnswer = (questionId, answer) => {
    setSelectedAnswers({ ...selectedAnswers, [questionId]: answer });
  };

  const handleNext = () => {
    setCurrentQuestionIndex((prevIndex) => Math.min(prevIndex + 1, questions.length - 1));
  };

  const handlePrevious = () => {
    setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleFinish = () => {
    if (Object.keys(selectedAnswers).length < questions.length) {
      setAlertMessage(t('please_answer_all_questions'));
      setConfirmMode('alert');
      setIsConfirmModalOpen(true);
      return;
    }

    setConfirmMode('confirm');
    setConfirmAction(() => confirmFinish);
    setAlertMessage(t('confirm_finish_test'));
    setIsConfirmModalOpen(true);
  };

  const confirmFinish = () => {
    let correct = 0;
    let incorrect = 0;

    questions.forEach((question) => {
      if (selectedAnswers[question.id] === question.answer) {
        correct++;
      } else {
        incorrect++;
      }
    });

    setCorrectCount(correct);
    setIncorrectCount(incorrect);

    if (mode === 'exam') {
      const passPercentage = (correct / questions.length) * 100;
      setPass(passPercentage >= 70);
    }

    setShowResults(true);
    setIsConfirmModalOpen(false);
  };

  const handleRestart = () => {
    setSelectedCategories([]);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowResults(false);
    setCorrectCount(0);
    setIncorrectCount(0);
    setPass(null);
    setTimer(0);
    setNumQuestions(200);
    setUseNumQuestions(true);

    router.replace({
      pathname: router.pathname,
      query: { mode: router.query.mode },
    });
  };

  const openConfirmModal = (action) => {
    setConfirmAction(() => action);
    setConfirmMode('confirm');
    setIsConfirmModalOpen(true);
  };

  const closeConfirmModal = () => {
    setIsConfirmModalOpen(false);
    setConfirmAction(null);
  };

  const toggleHints = () => {
    setShowHints(!showHints);
  };

  const toggleShowCorrectAnswers = () => {
    setShowCorrectAnswers(true);
    setShowIncorrectAnswers(false);
    setShowAllAnswers(false);
  };

  const toggleShowIncorrectAnswers = () => {
    setShowCorrectAnswers(false);
    setShowIncorrectAnswers(true);
    setShowAllAnswers(false);
  };

  const toggleShowAllAnswers = () => {
    setShowCorrectAnswers(false);
    setShowIncorrectAnswers(false);
    setShowAllAnswers(true);
  };

  const Question = ({ question, questionIndex, totalQuestions, selectedAnswer, onAnswer, showHints }) => {
    const handleAnswerChange = (e) => {
      onAnswer(question.id, e.target.value);
    };

    return (
      <div className="mb-6">
        <h2 className="text-2xl mb-4">
          {t('question')} {questionIndex + 1} / {totalQuestions}
        </h2>
        <p className="text-xl mb-4">{question.question}</p>
        <div>
          {question.options.map((option, index) => (
            <label key={index} className="block mb-2">
              <input
                type="radio"
                name={`question-${question.id}`}
                value={option}
                checked={selectedAnswer === option}
                onChange={handleAnswerChange}
                className="mr-2"
              />
              {option}
              {showHints && selectedAnswer && (
                <span className="ml-2">
                  {option === question.answer ? '✔️' : (selectedAnswer === option ? '❌' : '')}
                </span>
              )}
            </label>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header openConfirmModal={openConfirmModal} />
      <main className="flex-grow p-10">
        {!showResults && questions.length > 0 && (
          <button onClick={toggleHints} className={`p-2 border border-red-500 mb-4`}>
            {showHints ? t('hide_hints') : t('show_hints')}
          </button>
        )}
        {!questions.length ? (
          <div>
            <h1 className="text-3xl mb-8">{t('choose_categories')}</h1>
            <div className="mb-4">
              {mode === 'exam' ? (
                <>
                  <label className="block text-3xl">
                    <input
                      type="radio"
                      name="category"
                      value="language"
                      onChange={() => setSelectedCategories(['language'])}
                      checked={selectedCategories.includes('language')}
                      className="mr-2 transform scale-150"
                    />{' '}
                    {t('language_test')}
                  </label>
                  <label className="block text-3xl">
                    <input
                      type="radio"
                      name="category"
                      value="history"
                      onChange={() => setSelectedCategories(['history'])}
                      checked={selectedCategories.includes('history')}
                      className="mr-2 transform scale-150"
                    />{' '}
                    {t('history_test')}
                  </label>
                  <label className="block text-3xl">
                    <input
                      type="radio"
                      name="category"
                      value="law"
                      onChange={() => setSelectedCategories(['law'])}
                      checked={selectedCategories.includes('law')}
                      className="mr-2 transform scale-150"
                    />{' '}
                    {t('law_test')}
                  </label>
                </>
              ) : (
                <>
                  <label className="block text-3xl">
                    <input
                      type="checkbox"
                      value="language"
                      onChange={() => handleCategoryChange('language')}
                      checked={selectedCategories.includes('language')}
                      className="mr-2 transform scale-150"
                    />{' '}
                    {t('language_test')}
                  </label>
                  <label className="block text-3xl">
                    <input
                      type="checkbox"
                      value="history"
                      onChange={() => handleCategoryChange('history')}
                      checked={selectedCategories.includes('history')}
                      className="mr-2 transform scale-150"
                    />{' '}
                    {t('history_test')}
                  </label>
                  <label className="block text-3xl">
                    <input
                      type="checkbox"
                      value="law"
                      onChange={() => handleCategoryChange('law')}
                      checked={selectedCategories.includes('law')}
                      className="mr-2 transform scale-150"
                    />{' '}
                    {t('law_test')}
                  </label>
                </>
              )}
            </div>
            {mode === 'study' && (
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <label className="flex items-center cursor-pointer text-3xl">
                    <input
                      type="radio"
                      name="questionMode"
                      value="number"
                      checked={useNumQuestions}
                      onChange={() => setUseNumQuestions(true)}
                      className="mr-2 transform scale-150"
                    />
                    {t('select_number_of_questions')}
                  </label>
                </div>
                <input
                  type="number"
                  value={numQuestions}
                  onChange={(e) => setNumQuestions(Number(e.target.value))}
                  className="block w-full p-2 border border-primary mb-4"
                  disabled={!useNumQuestions || selectedCategories.length !== 1}
                />
                <div className="flex items-center mb-2">
                  <label className="flex items-center cursor-pointer text-3xl">
                    <input
                      type="radio"
                      name="questionMode"
                      value="set"
                      checked={!useNumQuestions}
                      onChange={() => setUseNumQuestions(false)}
                      className="mr-2 transform scale-150"
                      disabled={selectedCategories.length !== 1}
                    />
                    {t('select_question_set')}
                  </label>
                </div>
                <select
                  value={questionSet}
                  onChange={(e) => setQuestionSet(e.target.value)}
                  className="block w-full p-2 border border-primary"
                  disabled={useNumQuestions || selectedCategories.length !== 1}
                >
                  <option value="first">{t('first_50')}</option>
                  <option value="second">{t('second_50')}</option>
                  <option value="third">{t('third_50')}</option>
                  <option value="fourth">{t('fourth_50')}</option>
                  <option value="all">{t('all_200')}</option>
                </select>
              </div>
            )}
            <button onClick={handleStart} className="p-2 border-2 border-primary">
              {mode === 'exam' ? t('start_exam') : t('start_study')}
            </button>
          </div>
        ) : showResults ? (
          <div>
            <div className="mb-4">
              <h1 className="text-4xl font-bold mb-4">{t('results')}</h1>
              <p className="text-2xl mb-2">{t('correct_count')}: {correctCount}</p>
              <p className="text-2xl mb-2">{t('incorrect_count')}: {incorrectCount}</p>
              {mode === 'exam' && (
                <p className="text-2xl mb-2">{t('verdict')}: {pass ? t('pass') : t('fail')}</p>
              )}
            </div>
            <div className="mb-4 space-y-4 space-x-2">
              <button onClick={toggleShowCorrectAnswers} className={`p-2 border-2 border-red-500 ${showCorrectAnswers ? 'bg-red-200' : ''}`}>
                {t('show_correct_answers')}
              </button>
              <button onClick={toggleShowIncorrectAnswers} className={`p-2 border-2 border-red-500 ${showIncorrectAnswers ? 'bg-red-200' : ''}`}>
                {t('show_incorrect_answers')}
              </button>
              <button onClick={toggleShowAllAnswers} className={`p-2 border-2 border-red-500 ${showAllAnswers ? 'bg-red-200' : ''}`}>
                {t('show_all_answers')}
              </button>
            </div>
            <ul>
              {showCorrectAnswers && questions
                .map((question, index) => ({ ...question, index: index + 1 }))
                .filter((question) => selectedAnswers[question.id] === question.answer)
                .map((question) => (
                  <li key={question.id} className="mb-4">
                    <p className="text-xl font-bold mb-2">{question.index}. {question.question}</p>
                    <p className="text-lg mb-2">{t('your_answer')}: {selectedAnswers[question.id]}</p>
                    <p className="text-lg mb-2">{t('correct_answer')}: {question.answer}</p>
                  </li>
                ))}
              {showIncorrectAnswers && questions
                .map((question, index) => ({ ...question, index: index + 1 }))
                .filter((question) => selectedAnswers[question.id] !== question.answer)
                .map((question) => (
                  <li key={question.id} className="mb-4">
                    <p className="text-xl font-bold mb-2">{question.index}. {question.question}</p>
                    <p className="text-lg mb-2">{t('your_answer')}: {selectedAnswers[question.id]}</p>
                    <p className="text-lg mb-2">{t('correct_answer')}: {question.answer}</p>
                  </li>
                ))}
              {showAllAnswers && questions.map((question, index) => (
                <li key={question.id} className="mb-4">
                  <p className="text-xl font-bold mb-2">{index + 1}. {question.question}</p>
                  <p className="text-lg mb-2">{t('your_answer')}: {selectedAnswers[question.id]}</p>
                  <p className="text-lg mb-2">{t('correct_answer')}: {question.answer}</p>
                </li>
              ))}
            </ul>
            <button onClick={handleRestart} className="p-2 border border-primary mt-4">
              {t('restart')}
            </button>
          </div>
        ) : (
          <>
            {mode === 'exam' && (
              <div className="text-right mb-4">
                <span>
                  {t('time_left')}: {Math.floor(timer / 60)}:{('0' + (timer % 60)).slice(-2)}
                </span>
              </div>
            )}
            {questions.length > 0 && (
              <Question
                question={questions[currentQuestionIndex]}
                questionIndex={currentQuestionIndex}
                totalQuestions={questions.length}
                selectedAnswer={selectedAnswers[questions[currentQuestionIndex]?.id]}
                onAnswer={handleAnswer}
                showHints={showHints}
              />
            )}
            <div className="flex justify-between mt-4">
              <button onClick={handlePrevious} disabled={currentQuestionIndex === 0} className="p-2 border border-red-500">
                {t('previous')}
              </button>
              {currentQuestionIndex < questions.length - 1 ? (
                <button onClick={handleNext} className="p-2 border border-red-500">
                  {t('next')}
                </button>
              ) : (
                <button onClick={handleFinish} className="p-2 border border-red-500">
                  {t('submit')}
                </button>
              )}
            </div>
          </>
        )}
      </main>

      <Modal
        isOpen={isConfirmModalOpen}
        onRequestClose={closeConfirmModal}
        className="flex items-center justify-center h-screen"
        overlayClassName="fixed inset-0 bg-gray-500 bg-opacity-75"
      >
        <div className="bg-white p-6 rounded shadow-lg">
          <h2 className="text-xl mb-4">{alertMessage || t('confirm_action')}</h2>
          <div className="flex justify-end space-x-4">
            <button onClick={closeConfirmModal} className="px-4 py-2 border border-primary text-primary">
              {confirmMode === 'alert' ? t('ok') : t('no')}
            </button>
            {confirmMode === 'confirm' && confirmAction && (
              <button
                onClick={() => {
                  confirmAction();
                  closeConfirmModal();
                }}
                className="px-4 py-2 bg-primary text-white"
              >
                {t('yes')}
              </button>
            )}
          </div>
        </div>
      </Modal>
      <Footer />
    </div>
  );
}

export async function getServerSideProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
