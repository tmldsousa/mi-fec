import { useState, useEffect, useCallback } from 'react';
import { ProcessedVideo } from '../../common/interfaces';
import { getVideos } from '../../services/videos';
import { VideosTable } from '../videos-table';
import { useLayoutContext } from '../contexts/layout.context';
import { Button } from '../common/button';
import { useNavigate } from 'react-router-dom';

export const ListVideosPage = () => {
  const navigateTo = useNavigate();
  const { setRenderActions } = useLayoutContext();
  const [videos, setVideos] = useState<ProcessedVideo[]>([]);

  // Add "Add video" button to header for this page
  useEffect(() => {
    setRenderActions(<ListVideosPageActions />);

    return () => setRenderActions(undefined);
  }, [setRenderActions]);

  // Load videos from service
  useEffect(() => {
    getVideos().then(setVideos);
  }, []);

  const onEditVideo = useCallback(
    (video: ProcessedVideo) => {
      navigateTo(`/videos/edit/${video.id}`);
    },
    [navigateTo]
  );
  const onDeleteVideo = useCallback((video: ProcessedVideo) => {
    window.confirm(`Are you sure you want to delete video "${video.name}"?`);
  }, []);

  return (
    <>
      <h1>VManager Demo v0.0.1</h1>
      <VideosTable videos={videos} onEditVideo={onEditVideo} onDeleteVideo={onDeleteVideo} />
    </>
  );
};

const ListVideosPageActions = () => {
  const navigateTo = useNavigate();

  return (
    <Button primary onClick={() => navigateTo('/videos/new')}>
      Add video
    </Button>
  );
};
