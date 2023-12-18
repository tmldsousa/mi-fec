import { useState, useEffect, useCallback } from 'react';
import { Category, Author, SubmitVideo } from '../../common/interfaces';
import { getAuthors } from '../../services/authors';
import { getCategories } from '../../services/categories';
import { VideoForm } from '../video-form';
import { useNavigate } from 'react-router-dom';
import { createVideo } from '../../services/videos';

export const NewVideoPage = () => {
  const navigate = useNavigate();

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

  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);

  // On form submit, update video and navigate back (if successful)
  const onSubmit = useCallback(
    async (values: SubmitVideo) => {
      const success = await createVideo(values);

      if (success) {
        navigate(-1);
      } else {
        alert('Error creating video');
      }
    },
    [navigate]
  );

  const isLoading = !categories || !authors;

  return isLoading ? (
    <>Loading...</>
  ) : (
    <>
      <h1>Add video</h1>

      <VideoForm categories={categories} authors={authors} onSubmit={onSubmit} onCancel={goBack} />
    </>
  );
};
