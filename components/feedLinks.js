import React, { useState, useEffect, useRef } from 'react';
import parse, { domToReact } from 'html-react-parser';
import { useTranslation } from 'next-i18next';
import { FaHeart, FaShareAlt, FaYoutube, FaTwitch, FaVideo, FaArrowLeft, FaArrowRight, FaTimes } from 'react-icons/fa';
import YouTube from 'react-youtube';
import { TwitchEmbedVideo } from 'react-twitch-embed';
import FloatingPlayer from './FloatingPlayer';

const FeedLinks = ({ newsItems }) => {
  const { t } = useTranslation('common');
  const [selectedNews, setSelectedNews] = useState(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [likedPosts, setLikedPosts] = useState([]);
  const [enlargedImage, setEnlargedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentPostIndex, setCurrentPostIndex] = useState(null);
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });
  const [floatingVideoUrl, setFloatingVideoUrl] = useState(null);
  const [floatingVideoVisible, setFloatingVideoVisible] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);

  // Функция для удаления HTML-тегов из текста
  const stripHtml = (html) => {
    let doc = new DOMParser().parseFromString(html.replace(/<br\s*\/?>/gi, ' '), 'text/html');
    return doc.body.textContent || "";
  };

  // Фильтрация постов со словом "pinned" и без медиафайлов, а также коротких текстов
  const filteredNewsItems = newsItems.filter(news => {
    const hasMedia = news.images?.length > 0 || news.videos?.length > 0;
    const textLength = stripHtml(news.titleHtml).length;
    return !news.titleHtml.includes('pinned') && hasMedia && textLength >= 120;
  });

  useEffect(() => {
    const handleResize = () => {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.documentElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (selectedNews) {
      const body = document.body;
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      setScrollPosition(window.scrollY);
      body.style.position = 'fixed';
      body.style.top = `-${scrollPosition}px`;
      body.style.width = '100%';
      body.style.overflowY = 'hidden';
      body.style.paddingRight = `${scrollBarWidth}px`;
    } else {
      const body = document.body;
      body.style.position = '';
      body.style.top = '';
      body.style.width = '';
      body.style.overflowY = '';
      body.style.paddingRight = '';
      window.scrollTo(0, scrollPosition);
    }
  }, [selectedNews]);

  useEffect(() => {
    const handleScroll = () => {
      if (videoRef.current) {
        const bounding = videoRef.current.getBoundingClientRect();
        if (
          bounding.top >= 0 &&
          bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight)
        ) {
          setFloatingVideoVisible(false);
        } else {
          setFloatingVideoVisible(true);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleNewsClick = (index) => {
    setSelectedNews(filteredNewsItems[index]);
    setCurrentPostIndex(index);
  };

  const handleClose = () => {
    setSelectedNews(null);
    setCurrentPostIndex(null);
  };

  const handleImageClose = () => {
    setEnlargedImage(null);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleImageClose();
    }
  };

  const handlePostOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleImageClick = (image, index, event) => {
    const { width, height } = event.target.getBoundingClientRect();
    setEnlargedImage(image);
    setCurrentImageIndex(index);
    setImageSize({ width, height });
  };

  const handleShare = (news) => {
    const shareText = `${t('I am reading this material on tota.ge:')} ${news.link}`;
    navigator.clipboard.writeText(shareText).then(() => {
      alert(t('Link copied to clipboard'));
    });
  };

  const handleLike = (postId) => {
    setLikedPosts((prevLikedPosts) => {
      if (prevLikedPosts.includes(postId)) {
        return prevLikedPosts.filter(id => id !== postId);
      } else {
        return [...prevLikedPosts, postId];
      }
    });
  };

  const truncateText = (text, maxLength) => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  const parseWithLinkStyles = (html) => {
    return parse(html, {
      replace: domNode => {
        if (domNode.name === 'a') {
          domNode.attribs.class = 'text-blue-600 hover:underline break-words';
          domNode.attribs.style = 'word-break: break-word; overflow-wrap: anywhere;';
        }
      }
    });
  };

  const isYouTubeVideoUrl = (url) => {
    return url.includes('youtube.com/watch') || url.includes('youtu.be/');
  };

  const isTwitchVideoUrl = (url) => {
    return url.includes('twitch.tv/videos');
  };

  const renderYouTubePlayer = (url, onReady, onPlay, onPause) => {
    const videoId = extractYouTubeVideoId(url);
    return (
      <YouTube 
        videoId={videoId}
        opts={{
          width: '100%',
          height: '100%',
          playerVars: {
            autoplay: 0,
            controls: 1,
            rel: 0,
          },
        }}
        onReady={onReady}
        onPlay={onPlay}
        onPause={onPause}
        className="absolute top-0 left-0 w-full h-full"
      />
    );
  };

  const extractYouTubeVideoId = (url) => {
    let videoId = null;
    if (url.includes('v=')) {
      videoId = url.split('v=')[1];
      const ampersandPosition = videoId.indexOf('&');
      if (ampersandPosition !== -1) {
        videoId = videoId.substring(0, ampersandPosition);
      }
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1];
      const questionMarkPosition = videoId.indexOf('?');
      if (questionMarkPosition !== -1) {
        videoId = videoId.substring(0, questionMarkPosition);
      }
    }
    return videoId;
  };

  const renderTwitchPlayer = (url) => {
    try {
      const channelId = url.split('twitch.tv/')[1];
      return channelId;
    } catch (error) {
      console.error("Invalid Twitch URL:", url);
      return null;
    }
  };

  const parseContent = (content) => {
    let videoUrls = [];
    const contentWithVideo = parse(content, {
      replace: (domNode) => {
        if (domNode.name === 'a' && domNode.attribs.href) {
          const href = domNode.attribs.href;
          if (isYouTubeVideoUrl(href) || isTwitchVideoUrl(href)) {
            if (!videoUrls.includes(href)) {
              videoUrls.push(href);
            }
          }
        }
        return domToReact(domNode);
      }
    });

    return { contentWithVideo, videoUrls };
  };

  const handleMouseOver = (e, player) => {
    if (e.target.tagName === 'VIDEO') {
      e.target.muted = true;
      e.target.play();
    } else if (player) {
      player.playVideo();
    }
  };

  const handleMouseOut = (e, player) => {
    if (e.target.tagName === 'VIDEO') {
      e.target.pause();
    } else if (player) {
      player.pauseVideo();
    }
  };

  const handlePlayClick = (e) => {
    if (e.target.tagName === 'VIDEO') {
      e.target.muted = false;
      e.target.play();
      setIsMuted(false);
    }
  };

  const renderArrowButtons = () => {
    if (!selectedNews || !selectedNews.images || selectedNews.images.length <= 1) {
      return null;
    }

    return (
      <>
        <button
          onClick={() => {
            const newIndex = (currentImageIndex - 1 + selectedNews.images.length) % selectedNews.images.length;
            setCurrentImageIndex(newIndex);
            setEnlargedImage(selectedNews.images[newIndex]);
          }}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white text-3xl bg-black bg-opacity-50 p-2 rounded-full z-10"
        >
          <FaArrowLeft />
        </button>
        <button
          onClick={() => {
            const newIndex = (currentImageIndex + 1) % selectedNews.images.length;
            setCurrentImageIndex(newIndex);
            setEnlargedImage(selectedNews.images[newIndex]);
          }}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white text-3xl bg-black bg-opacity-50 p-2 rounded-full z-10"
        >
          <FaArrowRight />
        </button>
      </>
    );
  };

  const renderMediaPreview = (news) => {
    if (news.videos && news.videos.length > 0) {
      return (
        <div
          className="relative w-full h-[400px] max-h-[400px] overflow-hidden rounded-lg mb-4"
          onMouseOver={handleMouseOver}
          onMouseOut={handleMouseOut}
          onClick={handlePlayClick}
          ref={videoRef}
        >
          <video 
            className="object-cover w-full h-full"
            controls
            muted={isMuted}
          >
            <source src={news.videos[0]} type="video/mp4" />
          </video>
        </div>
      );
    } else if (isYouTubeVideoUrl(news.link)) {
      return (
        <div
          className="relative w-full h-[400px] max-h-[400px] overflow-hidden rounded-lg mb-4"
          onMouseOver={(e) => handleMouseOver(e, e.target.getPlayer())}
          onMouseOut={(e) => handleMouseOut(e, e.target.getPlayer())}
        >
          {renderYouTubePlayer(news.link)}
        </div>
      );
    } else if (news.images && news.images.length > 0) {
      return (
        <div className="w-full h-[400px] max-h-[400px] overflow-hidden rounded-lg mb-4">
          <img src={news.images[0]} alt="News" className="w-full h-full object-contain" />
        </div>
      );
    } else if (isTwitchVideoUrl(news.link)) {
      return (
        <div className="relative w-full h-[400px] max-h-[400px] overflow-hidden rounded-lg mb-4">
          <TwitchEmbedVideo
            video={renderTwitchPlayer(news.link)}
            width="100%"
            height="100%"
            className="absolute top-0 left-0"
          />
        </div>
      );
    }
    return null;
  };

  if (filteredNewsItems.length === 0) {
    return <div>{t('loading')}</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 px-2 pb-2 justify-center">
        {filteredNewsItems.map((news, index) => {
          const { contentWithVideo, videoUrls } = parseContent(news.titleHtml);
          const hasYouTube = videoUrls.some(url => isYouTubeVideoUrl(url));
          const hasTwitch = videoUrls.some(url => isTwitchVideoUrl(url));
          const hasOtherVideos = news.videos && news.videos.length > 0;

          return (
            <div
              key={index}
              className="feed-item p-6 border rounded-3xl shadow-md hover:shadow-lg transition-shadow relative cursor-pointer max-w-3xl mx-auto"
              onClick={() => handleNewsClick(index)}
            >
              <div className="flex items-center mb-2">
                <img src={news.logo} className="mr-2 w-10 h-10 rounded-full" alt="Channel Logo" />
                <a href={news.channelUrl} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-blue-800" onClick={e => e.stopPropagation()}>
                  {news.channelName}
                </a>
              </div>
              <div className="flex flex-col mb-8">
                {renderMediaPreview(news)}
                <div className="text-base mb-4">
                  {truncateText(stripHtml(news.titleHtml), 100)}
                </div>
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                <a href={news.link} target="_blank" rel="noopener noreferrer" className="text-blue-800 hover:underline text-sm break-words" onClick={e => e.stopPropagation()}>
                  {t('Read original')}
                </a>
                <div className="flex items-center space-x-2">
                  {hasYouTube && <FaYoutube className="text-red-600 text-lg" />}
                  {hasTwitch && <FaTwitch className="text-purple-600 text-lg" />}
                  {hasOtherVideos && <FaVideo className="text-blue-800" />}
                  <button
                    onClick={e => { e.stopPropagation(); handleLike(news.cacheKey); }}
                    className={`transition-colors ${likedPosts.includes(news.cacheKey) ? 'text-red-600' : 'text-blue-800 hover:text-red-600'}`}
                  >
                    <FaHeart />
                  </button>
                  <button onClick={e => { e.stopPropagation(); handleShare(news); }} className="text-blue-800 hover:text-blue-900 transition-colors">
                    <FaShareAlt />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedNews && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-start p-4 overflow-auto" onClick={handlePostOverlayClick}>
          <div className="bg-white p-6 rounded-3xl shadow-lg max-w-2xl w-full relative mt-16">
            <button onClick={handleClose} className="absolute top-6 right-6 text-3xl font-bold text-red-500">&times;</button>
            <div className="flex items-center mb-4">
              <img src={selectedNews.logo} className="mr-2 w-10 h-10 rounded-full" alt="Channel Logo" />
              <a href={selectedNews.channelUrl} target="_blank" rel="noopener noreferrer" className="text-lg font-semibold text-blue-800">
                {selectedNews.channelName}
              </a>
            </div>
            <div className="text-base mb-8 break-words">{parseWithLinkStyles(selectedNews.titleHtml)}</div>
            {selectedNews.images && selectedNews.images.length > 0 && (
              <div className="mb-8 justify-center">
                {selectedNews.images.map((image, idx) => (
                  <div key={idx} className="max-w-xl max-h-screen mb-8 overflow-hidden rounded-3xl shadow-md cursor-pointer relative" onClick={(event) => handleImageClick(image, idx, event)}>
                    <img src={image} alt="News" className="w-full h-full object-contain" />
                  </div>
                ))}
              </div>
            )}
            {enlargedImage && (
              <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex justify-center items-center" onClick={handleOverlayClick}>
                <button onClick={handleImageClose} className="absolute top-4 right-4 text-white text-3xl bg-black bg-opacity-50 p-2 rounded-full">
                  <FaTimes />
                </button>
                <img src={enlargedImage} alt="Enlarged" className="max-w-full max-h-full" />
                {renderArrowButtons()}
              </div>
            )}
            {selectedNews.videos && selectedNews.videos.length > 0 && (
              <div className="mb-8">
                {selectedNews.videos.map((video, idx) => (
                  <div key={idx} className="relative w-full overflow-hidden rounded-lg mb-8">
                    <video 
                      className="object-contain"
                      controls
                      muted={isMuted}
                    >
                      <source src={video} type="video/mp4" />
                    </video>
                  </div>
                ))}
              </div>
            )}

            {selectedNews.link.includes('youtube.com') && isYouTubeVideoUrl(selectedNews.link) && (
              <div className="relative w-full aspect-video max-h-[90vh] overflow-hidden rounded-3xl">
                <YouTube 
                  videoId={renderYouTubePlayer(selectedNews.link)} 
                  opts={{
                    width: '100%',
                    height: '100%',
                    playerVars: {
                      autoplay: 0,
                    },
                  }}
                  className="absolute top-0 left-0 w-full h-full"
                />
              </div>
            )}

            {selectedNews.link.includes('twitch.tv') && isTwitchVideoUrl(selectedNews.link) && (
              <div className="relative w-full aspect-video max-h-[90vh] overflow-hidden rounded-3xl">
                <TwitchEmbedVideo
                  video={renderTwitchPlayer(selectedNews.link)}
                  width="100%"
                  height="100%"
                  className="absolute top-0 left-0"
                />
              </div>
            )}

            {(selectedNews.titleHtml.includes('youtube.com') || selectedNews.titleHtml.includes('youtu.be')) && (
              <div className="mt-4">
                {[...new Set(selectedNews.titleHtml.match(/(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/g))].map((url, idx) => (
                  <div key={idx} className="relative w-full aspect-video max-h-[90vh] overflow-hidden rounded-3xl mb-8">
                    <YouTube 
                      videoId={renderYouTubePlayer(url)} 
                      opts={{
                        width: '100%',
                        height: '100%',
                        playerVars: {
                          autoplay: 0,
                        },
                      }}
                      className="absolute top-0 left-0 w-full h-full"
                    />
                  </div>
                ))}
              </div>
            )}
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-center">
              <a href={selectedNews.link} target="_blank" rel="noopener noreferrer" className="text-blue-800 hover:underline text-sm break-words">
                {t('Read original')}
              </a>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleLike(selectedNews.cacheKey)}
                  className={`transition-colors ${likedPosts.includes(selectedNews.cacheKey) ? 'text-red-600' : 'text-blue-800 hover:text-red-600'}`}
                >
                  <FaHeart />
                </button>
                <button onClick={() => handleShare(selectedNews)} className="text-blue-800 hover:text-blue-900 transition-colors">
                  <FaShareAlt />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {floatingVideoVisible && floatingVideoUrl && (
        <FloatingPlayer url={floatingVideoUrl} />
      )}
    </>
  );
};

export default FeedLinks;
