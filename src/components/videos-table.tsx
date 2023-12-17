import type { ProcessedVideo } from '../common/interfaces';
import { Button } from './common/button';
import { Table } from './common/table';

type VideosTableProps = {
  videos: ProcessedVideo[];
  onEditVideo?: (videoId: ProcessedVideo) => void;
  onDeleteVideo?: (videoId: ProcessedVideo) => void;
};

export const VideosTable = ({ videos, onEditVideo, onDeleteVideo }: VideosTableProps) => (
  <Table
    data={videos}
    columns={[
      { header: 'Video name', accessorKey: 'name' },
      { header: 'Author', accessorKey: 'author' },
      { header: 'Category name', accessorFn: (value) => value.categories.join(', ') },
      { header: 'Highest quality format', accessorKey: 'highestQualityFormat' },
      { header: 'Release Date', accessorKey: 'releaseDate' },
      {
        header: 'Options',
        cell: (context) => (
          <div>
            <Button onClick={onEditVideo ? () => onEditVideo(context.row.original) : undefined}>Edit</Button>
            <Button onClick={onDeleteVideo ? () => onDeleteVideo(context.row.original) : undefined}>Delete</Button>
          </div>
        ),
      },
    ]}
  />
);
