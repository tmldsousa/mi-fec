import { SVGProps, memo } from 'react';

export const Search = memo((props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000000" {...props}>
    <path
      d="M15.7955 15.8111L21 21M18 10.5C18 14.6421 14.6421 18 10.5 18C6.35786 18 3 14.6421 3 10.5C3 6.35786 6.35786 3 10.5 3C14.6421 3 18 6.35786 18 10.5Z"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
));

export const SortAscending = memo((props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000000" {...props}>
    <path d="M13 12H21M13 8H21M13 16H21M6 7V17M6 17L3 14M6 17L9 14" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
  </svg>
));

export const SortDescending = memo((props: SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000000" {...props}>
    <path d="M13 12H21M13 8H21M13 16H21M6 7V17M6 7L3 10M6 7L9 10" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
  </svg>
));

export const Close = memo((props: SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="#000000" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path id="Vector" d="M18 18L12 12M12 12L6 6M12 12L18 6M12 12L6 18" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path>
  </svg>
));
