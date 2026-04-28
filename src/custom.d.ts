// src/custom.d.ts
declare module '*.css';
declare module '*.scss';
declare module '*.sass';
declare module '*.less';

declare module '*.module.css';
declare module '*.module.scss';
declare module '*.module.sass';
declare module '*.module.less';

// images
declare module '*.svg' {
  const content: string;
  export default content;
}
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.webp';
declare module '*.avif';