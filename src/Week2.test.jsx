import {render, screen, fireEvent} from '@testing-library/react';
import App from './App';
test('original home, cart navigation, and existing nine-product catalog remain connected', () => {
 render(<App />);
 expect(screen.getByText('Come eat local.')).toBeTruthy();
 expect(screen.getByText('Know who grows your food.')).toBeTruthy();
 fireEvent.click(screen.getByRole('button', {name: 'Menu'}));
 fireEvent.click(screen.getByRole('menuitem', {name: /Shopping Cart/}));
 expect(screen.getByRole('heading', {name: 'Shopping Cart'})).toBeTruthy();
 fireEvent.click(screen.getByRole('button', {name: 'Continue Shopping'}));
 expect(screen.getByText('9 local items')).toBeTruthy();
 expect(screen.getByPlaceholderText('Search products or suppliers...')).toBeTruthy();
});
