
import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';

const Picker = ({ data, selectedIndex, onSelect }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      const selectedElement = scrollRef.current.children[selectedIndex];
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  }, [selectedIndex]);

  return (
    <Container ref={scrollRef}>
      {data.map((item, index) => (
        <Item
          key={index}
          $isSelected={index === selectedIndex}
          onClick={() => onSelect(index)}
        >
          {index === selectedIndex ? (
            <SelectedItemContainer>
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
  overflow-y: scroll;
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
