import { useState, useEffect, useCallback } from 'react';
import { ProcessedVideo } from '../../common/interfaces';
import { getVideos } from '../../services/videos';
import { VideosTable } from '../videos-table';
import { useLayoutContext } from '../contexts/layout.context';
import { Button } from '../common/button';
import { useNavigate } from 'react-router-dom';
import { deleteVideo } from '../../services/videos';
import { Modal } from '../common/modal';

export const ListVideosPage = () => {
  const navigateTo = useNavigate();
  const { setRenderActions } = useLayoutContext();
  const [videos, setVideos] = useState<ProcessedVideo[]>([]);
  const [loadVideos, setLoadVideos] = useState(true);
  const [deleteVideoDialogOpen, setDeleteVideoDialogOpen] = useState<ProcessedVideo | undefined>();

  // Load videos from service
  useEffect(() => {
    if (loadVideos) {
      getVideos().then((result) => {
        setVideos(result);
        setLoadVideos(false);
      });
    }
  }, [loadVideos]);

  // Add "Add video" button to header on this page layout
  useEffect(() => {
    setRenderActions(<ListVideosPageActions />);

    return () => setRenderActions(undefined);
  }, [setRenderActions]);

  const onEditVideo = useCallback(
    (video: ProcessedVideo) => {
      navigateTo(`/videos/edit/${video.id}`);
    },
    [navigateTo]
  );

  const onDeleteVideo = useCallback((video: ProcessedVideo) => {
    setDeleteVideoDialogOpen(video);
  }, []);

  const onDeleteVideoConfirm = useCallback(async () => {
    if (deleteVideoDialogOpen) {
      await deleteVideo(deleteVideoDialogOpen.id, deleteVideoDialogOpen.authorId);

      setDeleteVideoDialogOpen(undefined);
      setLoadVideos(true);
    }
  }, [deleteVideoDialogOpen]);

  return (
    <>
      <h1>VManager Demo v0.0.1</h1>
      <VideosTable videos={videos} onEditVideo={onEditVideo} onDeleteVideo={onDeleteVideo} />

      <Modal
        title="Confirm delete"
        isOpen={!!deleteVideoDialogOpen}
        onClose={() => setDeleteVideoDialogOpen(undefined)}
        onConfirm={onDeleteVideoConfirm}>
        Are you sure you want to delete video "{deleteVideoDialogOpen?.name}"?
      </Modal>
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
