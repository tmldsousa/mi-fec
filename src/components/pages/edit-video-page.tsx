import { useState, useEffect, useMemo, useCallback } from 'react';
import { Author, Category, SubmitVideo } from '../../common/interfaces';
import { VideoForm } from '../video-form';
import { useNavigate, useParams } from 'react-router-dom';
import { getAuthors } from '../../services/authors';
import { getCategories } from '../../services/categories';
import { createOrUpdateVideo } from '../../services/videos';

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

  // Get video data to edit
  const formData = useMemo(() => {
    const videoWithAuthor = authors
      ?.flatMap((author) => author.videos.map((video) => ({ author, video })))
      .find(({ video }) => video.id === videoId);

    return videoWithAuthor
      ? ({
          authorId: videoWithAuthor.author.id,
          catIds: videoWithAuthor.video.catIds,
          name: videoWithAuthor.video.name,
          id: videoWithAuthor.video.id,
        } as SubmitVideo)
      : undefined;
  }, [authors, videoId]);

  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // On form submit, update video and navigate back (if successful)
  const onSubmit = useCallback(
    async (values: SubmitVideo) => {
      const success = await createOrUpdateVideo(values);

      if (success) {
        goBack();
      } else {
        alert('Error creating video');
      }
    },
    [goBack]
  );

  return !categories || !authors || !formData ? (
    <>Loading...</>
  ) : (
    <>
      <h1>Edit video: {formData.name}</h1>

      <VideoForm video={formData} categories={categories} authors={authors} onSubmit={onSubmit} onCancel={goBack} />
    </>
  );
};
