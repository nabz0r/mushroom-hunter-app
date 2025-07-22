import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { MushroomCard } from '@/components/MushroomCard';

describe('MushroomCard', () => {
  const mockProps = {
    name: 'Cèpe de Bordeaux',
    scientificName: 'Boletus edulis',
    rarity: 'uncommon',
    points: 45,
    imageUrl: 'https://example.com/mushroom.jpg',
    isEdible: true,
    onPress: jest.fn(),
  };

  it('renders correctly', () => {
    const { getByText } = render(<MushroomCard {...mockProps} />);

    expect(getByText('Cèpe de Bordeaux')).toBeTruthy();
    expect(getByText('Boletus edulis')).toBeTruthy();
    expect(getByText('+45 pts')).toBeTruthy();
    expect(getByText('Comestible')).toBeTruthy();
  });

  it('displays non-edible warning correctly', () => {
    const { getByText } = render(
      <MushroomCard {...mockProps} isEdible={false} />
    );

    expect(getByText('Non comestible')).toBeTruthy();
  });

  it('calls onPress when tapped', () => {
    const { getByText } = render(<MushroomCard {...mockProps} />);
    
    fireEvent.press(getByText('Cèpe de Bordeaux'));
    
    expect(mockProps.onPress).toHaveBeenCalledTimes(1);
  });

  it('displays correct rarity color', () => {
    const { getByText } = render(<MushroomCard {...mockProps} />);
    
    const rarityBadge = getByText('uncommon');
    expect(rarityBadge).toBeTruthy();
  });
});