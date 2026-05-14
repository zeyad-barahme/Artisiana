import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ProductCard from '../ProductCard1w'; 

const mockProduct = {
  title: 'Handmade Vase',
  price: 45.00,
  image: 'ce1',
  desc: 'A beautiful handmade ceramic vase.',
};

describe('ProductCard Component Testing', () => {
  
  it('renders product details correctly', () => {
    const { getByText } = render(
      <ProductCard {...mockProduct} />
    );

    expect(getByText('Handmade Vase')).toBeTruthy();
    expect(getByText('$45.00')).toBeTruthy();
  });

  it('triggers onAdd function when button is pressed', () => {
    const onAddMock = jest.fn();
    const { getByText } = render(
      <ProductCard {...mockProduct} onAdd={onAddMock} />
    );

    const addButton = getByText('Add to Cart');
    fireEvent.press(addButton);

    expect(onAddMock).toHaveBeenCalledTimes(1);
  });

  it('renders correctly with specific rating', () => {
    const { getByText } = render(
      <ProductCard {...mockProduct} rating={4} />
    );
    
    expect(getByText('⭐⭐⭐⭐')).toBeTruthy();
  });
});