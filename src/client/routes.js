import React from 'react';
import Container from './components/Container';

export default [
  {
    path: '/',
    component: Container,
  },
  {
    path: '/404',
    component: () => (<div>404 Notfound</div>),
  },
  {
    path: '/:date',
    component: Container,
  },
];
