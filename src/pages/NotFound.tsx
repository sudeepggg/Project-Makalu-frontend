import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => (
  <div className="text-center py-20">
    <h1 className="text-4xl font-bold">404</h1>
    <p className="mt-4">Page not found</p>
    <Link to="/" className="mt-4 inline-block px-4 py-2 bg-primary text-white rounded">Go home</Link>
  </div>
);

export default NotFound;