import { RouteObject } from 'react-router-dom';
import { Layout } from './components/layout';
import { ListVideosPage } from './components/pages/list-videos.page';
import { NewVideoPage } from './components/pages/new-video-page';
import { EditVideoPage } from './components/pages/edit-video-page';
import { AboutPage } from './components/pages/about.page';
import { FaqPage } from './components/pages/faq.page';

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        index: true,
        element: <ListVideosPage />,
      },
      {
        path: 'videos',
        element: <ListVideosPage />,
      },
      {
        path: 'videos/new',
        element: <NewVideoPage />,
      },
      {
        path: 'videos/edit/:videoId',
        element: <EditVideoPage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'faq',
        element: <FaqPage />,
      },
    ],
  },
];
