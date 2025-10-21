import '@testing-library/jest-dom';

import { configure } from '@testing-library/react';

configure({
  testIdAttribute: 'data-testid',
});

// Mock para import.meta.url que usan algunos componentes con Vite
global.URL.createObjectURL = jest.fn();

// Mock básico para new URL con import.meta.url
beforeAll(() => {
  const originalURL = global.URL;
  global.URL = class extends originalURL {
    constructor(url, base) {
      if (base && typeof base === 'object' && base.url) {
        // Caso de import.meta.url
        super(url, 'file:///');
      } else {
        super(url, base);
      }
    }
  };
});