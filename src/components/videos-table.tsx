import type { ProcessedVideo } from '../common/interfaces';
import styles from './videos-table.module.css';

type VideosTableProps = {
  videos: ProcessedVideo[];
};

export const VideosTable = ({ videos }: VideosTableProps) => (
  <div className={styles.wrapper}>
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Video name</th>
          <th>Author</th>
          <th>Category name</th>
          <th>Highest quality format</th>
          <th>Release Date</th>
          <th>Options</th>
        </tr>
      </thead>

      <tbody>
        {videos.map((video) => (
          <tr key={video.id}>
            <td>{video.name}</td>
            <td>{video.author}</td>
            <td>{video.categories.join(', ')}</td>
            <td>{video.highestQualityFormat}</td>
            <td>{video.releaseDate}</td>
            <td>
              <button>Edit</button>
              <button>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
