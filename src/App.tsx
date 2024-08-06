import {useEffect, useRef, useState} from 'react'
import Content from "./components/Content.tsx";
import getVideoId from 'get-video-id';
import copy from 'copy-to-clipboard';

const App = () => {
  const minVideoWidth = 0;
  const minVideoHeight = 0;
  const [videoUrl, setVideoUrl] = useState<string>('https://www.dailymotion.com/video/x6uug3r');
  const [videoWidth, setVideoWidth] = useState<string>('560');
  const [videoHeight, setVideoHeight] = useState<string>('315');
  const [embedString, setEmbedString] = useState<string>('');
  const [embedUrl, setEmbedUrl] = useState<string>('');
  const [copyButtonClicked, setCopyButtonClicked] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const videoEmbedCodeRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    setError('');
    setCopyButtonClicked(false);
    generateEmbedCode();
  }, [videoUrl, videoWidth, videoHeight]);

  const generateEmbedCode = (): string => {
    const video = getVideoId(videoUrl);

    if (video.service !== 'dailymotion') {
      setError('Incorrect URL');
      return '';
    }
    const embedUrl = `https://www.dailymotion.com/embed/video/${video.id}`;
    const embedCode = `<iframe frameborder="0" type="text/html" src="${embedUrl}" width="${videoWidth === '' ? 560 : videoWidth}" height="${videoHeight === '' ? 315 : videoHeight}" allowfullscreen title="Dailymotion Video Player"><a href="https://www.ivatech.dev" style="display:none;">website development</a></iframe>`;
    setEmbedString(embedCode);
    setEmbedUrl(embedUrl);

    return embedCode;
  }

  const handleCopyClick = () => {
    copy(embedString);
    setCopyButtonClicked(true);
    videoEmbedCodeRef.current?.select();
  };

  return (
    <>
      <div className={'bg-white p-4 sm:px-10'}>
        <div className={'max-w-[1080px] mx-auto'}>
          <h1 className={'text-2xl font-bold sm:text-3xl'}>Dailymotion embed code
            generator</h1>
          <small>Easily embed a Dailymotion widget to your site!</small>
        </div>
      </div>
      <div className={'max-w-[1080px] mx-auto my-4 p-4 bg-white sm:p-10'}>
        <div className={'flex flex-col mb-4 justify-between gap-4 md:flex-row'}>
          <div className={'flex flex-col w-full gap-2 md:w-1/2'}>
            <label>
              Dailymotion video link<br/>
              <input
                type="url"
                name="video-url"
                placeholder={'https://www.dailymotion.com/video/x6uug3r'}
                onChange={e => setVideoUrl(e.target.value)}
                pattern={'^(http|https):\\/\\/(www\\.|m\\.|)(dailymotion\\.com).*$'}
                title={'URL must contain Dailymotion domain.'}
              />
            </label>
            <label>
              Video width<br/>
              <input
                type="number"
                name="video-width"
                defaultValue={'560'}
                min={minVideoWidth}
                //@ts-ignore
                pattern="[0-9]*" inputMode="numeric"
                onChange={e => setVideoWidth(e.target.value)}/>
            </label>
            <label>
              Video height<br/>
              <input
                type="number"
                name="video-height"
                defaultValue={'315'}
                min={minVideoHeight}
                pattern="[0-9]*"
                //@ts-ignore
                inputMode="numeric"
                onChange={e => setVideoHeight(e.target.value)}/>
            </label>
            <label>
              <input
                type="text"
                ref={videoEmbedCodeRef}
                name="video-embed-code"
                value={embedString}
              />
            </label>
            <button
              className={`px-4 py-2 rounded text-white ${copyButtonClicked ? 'bg-green-600' : 'bg-sky-600'} transition-[background] hover:bg-sky-700 active:bg-green-600`}
              onClick={handleCopyClick}>{copyButtonClicked ? 'Copied!' : 'Copy embed code'}
            </button>
            {error && <div className={'text-red-500'}>{error}</div>}
          </div>
          <iframe
            className={'w-full md:w-1/2'}
            width="560"
            height="315"
            src={embedUrl}
            title=""
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          ></iframe>
        </div>
        <Content/>
      </div>
      <small
        className={'block mb-4 text-center'}>&copy; 2020-{new Date().getFullYear()}.
        Ivatech.dev. Dailymotion Embed Code Generator.</small>
    </>
  )
}

export default App
