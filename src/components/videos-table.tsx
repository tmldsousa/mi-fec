import type { ProcessedVideo } from '../common/interfaces';
import { Button } from './common/button';
import { Table } from './common/table';

type VideosTableProps = {
  videos: ProcessedVideo[];
};

export const VideosTable = ({ videos }: VideosTableProps) => (
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
        cell: () => (
          <div>
            <Button>Edit</Button>
            <Button>Delete</Button>
          </div>
        ),
      },
    ]}
  />
);
