
import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';

const Picker = ({ data, selectedIndex, onSelect, onConfirmSelected }) => {
  const scrollRef = useRef(null);
  const itemHeightRef = useRef(0);
  const wheelLockRef = useRef(false);
  const touchStartYRef = useRef(null);
  const [ready, setReady] = useState(false);

  // Measure item height once mounted for centering math
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || el.children.length === 0) return;
    // Find the first item element height
    const firstItem = el.children[0];
    const rect = firstItem.getBoundingClientRect();
    itemHeightRef.current = rect.height;
    setReady(true);
  }, []);

  // Center the selected item like CupertinoPicker
  useEffect(() => {
    const el = scrollRef.current;
    const itemH = itemHeightRef.current;
    if (!el || !itemH || !ready) return;
    const targetCenter = selectedIndex * itemH + itemH / 2;
    const newScrollTop = Math.max(
      0,
      Math.min(targetCenter - el.clientHeight / 2, el.scrollHeight - el.clientHeight)
    );
    el.scrollTo({ top: newScrollTop, behavior: 'smooth' });
  }, [selectedIndex, ready]);

  // Wheel handler to move exactly one step per gesture
  const handleWheel = (e) => {
    e.preventDefault();
    if (wheelLockRef.current) return;
    wheelLockRef.current = true;
    const delta = e.deltaY;
    if (delta > 0 && selectedIndex < data.length - 1) onSelect(selectedIndex + 1);
    else if (delta < 0 && selectedIndex > 0) onSelect(selectedIndex - 1);
    // unlock after animation duration (~250ms)
    setTimeout(() => {
      wheelLockRef.current = false;
    }, 250);
  };

  // Touch swipe (mobile) to move one step
  const handleTouchStart = (e) => {
    if (e.touches && e.touches.length > 0) {
      touchStartYRef.current = e.touches[0].clientY;
    }
  };
  const handleTouchMove = (e) => {
    if (touchStartYRef.current == null) return;
    const currentY = e.touches[0].clientY;
    const diff = touchStartYRef.current - currentY;
    // Threshold: half an item height
    const threshold = (itemHeightRef.current || 40) / 2;
    if (Math.abs(diff) > threshold) {
      if (diff > 0 && selectedIndex < data.length - 1) onSelect(selectedIndex + 1);
      else if (diff < 0 && selectedIndex > 0) onSelect(selectedIndex - 1);
      touchStartYRef.current = currentY; // reset anchor for next step
    }
  };
  const handleTouchEnd = () => {
    touchStartYRef.current = null;
  };

  return (
    <Container
      ref={scrollRef}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {data.map((item, index) => (
        <Item
          key={index}
          $isSelected={index === selectedIndex}
          onClick={() => onSelect(index)}
        >
          {index === selectedIndex ? (
            <SelectedItemContainer onClick={(e) => {
              e.stopPropagation();
              if (onConfirmSelected) onConfirmSelected();
            }}>
              <img src="/images/left.png" alt="left" />
              <SelectedText>{item.name}</SelectedText>
              <img src="/images/right.png" alt="right" />
            </SelectedItemContainer>
          ) : (
            <UnselectedText>{item.name}</UnselectedText>
          )}
        </Item>
      ))}
    </Container>
  );
};

export default Picker;

const Container = styled.div`
  width: 40vw;
  height: 81vh;
  overflow-y: auto; /* programmatic scrolling only */
  display: flex;
  flex-direction: column;
  align-items: center;
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, and Opera */
  }
`;

const Item = styled.div`
  width: 100%;
  height: 4.1vw;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const SelectedItemContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ff62d3;
  width: 26.5vw;
  img {
    width: 24px;
    height: 42px;
    margin: 0 18px;
  }
`;

const SelectedText = styled.p`
  font-family: 'DungGeunMo', sans-serif;
  font-size: 3.75vw;
  font-weight: 400;
  color: white;
  margin: 0;
`;

const UnselectedText = styled.p`
  font-family: 'DungGeunMo', sans-serif;
  font-size: 3vw;
  font-weight: 400;
  color: white;
  opacity: 0.5;
  margin: 0;
`;
