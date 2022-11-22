/* @jsx h */
import { h, render } from 'preact';
import { useState, useReducer, useEffect } from 'preact/hooks';
import MainContainer from './components/MainContainer';
import { createAppState } from 'model/app-state';
import { appReducer, setUiInterface, UIInterface } from 'controller/ui-actions';

const App = () => {
  return <MainContainer />;
};

export const mountUi = () => {
  const dom = document.getElementById('ui');
  if (dom) {
    render(<App />, dom);
  }
};
