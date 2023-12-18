import { useState, useEffect, useMemo, useCallback } from 'react';
import { Author, Category, SubmitVideo, VideoWithAuthor } from '../../common/interfaces';
import { VideoForm } from '../video-form';
import { useNavigate, useParams } from 'react-router-dom';
import { getAuthors } from '../../services/authors';
import { getCategories } from '../../services/categories';
import { getVideoByIdWithAuthor, updateVideo } from '../../services/videos';

export const EditVideoPage = () => {
  const { videoId: paramVideoId } = useParams();
  const navigate = useNavigate();

  // Parse video id. If it is not a valid number, go back
  useEffect(() => {
    if (!paramVideoId || !/^\d+$/.test(paramVideoId)) {
      navigate(-1);
    }
  }, [paramVideoId, navigate]);
  const videoId = useMemo(() => parseInt(paramVideoId || '', 10), [paramVideoId]);

  // Load categories
  const [categories, setCategories] = useState<Category[] | undefined>();
  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  // Load authors
  const [authors, setAuthors] = useState<Author[] | undefined>();
  useEffect(() => {
    getAuthors().then(setAuthors);
  }, []);

  // Load event data
  const [videoWithAuthor, setVideoWithAuthor] = useState<VideoWithAuthor>();
  useEffect(() => {
    getVideoByIdWithAuthor(videoId).then(setVideoWithAuthor);
  }, [videoId]);

  // Get video data to edit
  const formData = useMemo(() => {
    return videoWithAuthor
      ? ({
          authorId: videoWithAuthor.author.id,
          catIds: videoWithAuthor.video.catIds,
          name: videoWithAuthor.video.name,
          id: videoWithAuthor.video.id,
        } as SubmitVideo)
      : undefined;
  }, [videoWithAuthor]);

  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // On form submit, update video and navigate back (if successful)
  const onSubmit = useCallback(
    async (values: SubmitVideo) => {
      const success = await updateVideo(values);

      if (success) {
        goBack();
      } else {
        alert('Error creating video');
      }
    },
    [goBack]
  );

  const isLoading = !categories || !authors || !formData;

  return isLoading ? (
    <>Loading...</>
  ) : (
    <>
      <h1>Edit video: {formData.name}</h1>

      <VideoForm video={formData} categories={categories} authors={authors} onSubmit={onSubmit} onCancel={goBack} />
    </>
  );
};
