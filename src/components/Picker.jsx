import React, { useRef, useEffect, useState } from 'react';
import styled from 'styled-components';

const Picker = ({ data, selectedIndex, onSelect, onConfirmSelected }) => {
  const scrollRef = useRef(null);
  const itemHeightRef = useRef(0);        // 아이템 블록(간격 포함) 높이
  const [ready, setReady] = useState(false);
  // Wheel smoothing state (physics-based inertia)
  const wheelAnimRef = useRef(null);
  const wheelVelRef = useRef(0);          // current velocity (px/frame)
  const lastWheelTsRef = useRef(0);       // last user wheel input time

  // 타이머/상태 플래그들
  const idleTimerRef = useRef(null);
  const forceAlignTimerRef = useRef(null);
  const isUserScrollingRef = useRef(false);   // 사용자 제스처 스크롤 중?
  const progScrollRef = useRef(false);        // 키보드/코드에 의한 스크롤 중?

  // 스크롤 중 실시간 중앙 후보
  const [activeIndex, setActiveIndex] = useState(selectedIndex);
  // 상/하 spacer
  const [pad, setPad] = useState(0);

  // ===== 측정 =====
  const measure = () => {
    const el = scrollRef.current;
    if (!el) return;
    const firstItem = el.querySelector('[data-item]');
    if (!firstItem) return;

    // 아이템 블록 높이 = 실제 렌더 높이 + margin
    const rect = firstItem.getBoundingClientRect();
    const cs = window.getComputedStyle(firstItem);
    const mt = parseFloat(cs.marginTop) || 0;
    const mb = parseFloat(cs.marginBottom) || 0;
    const itemBlockH = rect.height + mt + mb;

    itemHeightRef.current = itemBlockH;

    // 첫/마지막도 중앙 가능하도록 spacer
    const p = Math.max(0, (el.clientHeight - itemBlockH) / 2);
    setPad(p);
    setReady(true);
  };

  useEffect(() => {
    measure();
    const onResize = () => measure();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ===== 유틸 =====
  const clampTop = (el, top) => Math.max(0, Math.min(top, el.scrollHeight - el.clientHeight));

  const exactCenterTopForIndex = (el, idx) => {
    const h = itemHeightRef.current;
    const target = pad + idx * h + h / 2 - el.clientHeight / 2;
    return Math.round(clampTop(el, target));
  };

  const computeNearestIndex = () => {
    const el = scrollRef.current;
    const h = itemHeightRef.current;
    if (!el || !h) return 0;
    const centerY = el.scrollTop + el.clientHeight / 2;
    const raw = (centerY - pad) / h - 0.5;
    const nearest = Math.round(raw);
    return Math.max(0, Math.min(data.length - 1, nearest));
  };

  const clearTimers = () => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (forceAlignTimerRef.current) clearTimeout(forceAlignTimerRef.current);
  };

  // ===== 스냅 확정 =====
  const snapToNearest = () => {
    const el = scrollRef.current;
    if (!el) return;

    const idx = computeNearestIndex();
    const target = exactCenterTopForIndex(el, idx);

    // 부드럽게 이동
    el.scrollTo({ top: target, behavior: 'smooth' });

    // 미세 오차 제거 강제 정렬 (너무 이른 강제정렬은 끊김을 유발하므로 지연 + 임계값 체크)
    clearTimeout(forceAlignTimerRef.current);
    forceAlignTimerRef.current = setTimeout(() => {
      if (Math.abs(el.scrollTop - target) > 1) {
        el.scrollTo({ top: target, behavior: 'auto' });
      }
    }, 280);

    // onSelect는 확정시에만
    if (idx !== selectedIndex) onSelect(idx);
    setActiveIndex(idx);
  };

  const queueSnap = (delay = 220) => {
    // 프로그램틱 스크롤 중에는 스냅 예약 금지
    if (progScrollRef.current) return;
    clearTimeout(idleTimerRef.current);
    idleTimerRef.current = setTimeout(() => {
      snapToNearest();
      setTimeout(() => { isUserScrollingRef.current = false; }, 40);
    }, delay);
  };

  // ===== 스크롤 핸들러 =====
  const handleScroll = () => {
    // 프로그램틱 스크롤 진행 중이면 이벤트 무시 (키보드 충돌 방지)
    if (progScrollRef.current) return;

    isUserScrollingRef.current = true;
    const near = computeNearestIndex();
    setActiveIndex(near);
    queueSnap(220);
  };

  // ===== 마우스 휠 부드럽게 처리 =====
  const stopWheelAnim = () => {
    if (wheelAnimRef.current) {
      cancelAnimationFrame(wheelAnimRef.current);
      wheelAnimRef.current = null;
    }
  };

  const startWheelAnim = () => {
    const el = scrollRef.current;
    if (!el) return;

    const step = () => {
      const friction = 0.86;           // 마찰 소폭 강화해 더 빨리 감속
      const minVel = 0.16;             // 정지 판단 임계값 약간 상향

      // 위치 업데이트
      let top = el.scrollTop + wheelVelRef.current;

      // 경계 처리: 바운스 없이 부드럽게 멈추기
      const minTop = 0;
      const maxTop = el.scrollHeight - el.clientHeight;
      if (top <= minTop) {
        top = minTop;
        wheelVelRef.current = 0;
      } else if (top >= maxTop) {
        top = maxTop;
        wheelVelRef.current = 0;
      }

      el.scrollTop = top;

      // 마찰 적용으로 서서히 감속
      wheelVelRef.current *= friction;

      const idleFor = performance.now() - lastWheelTsRef.current;
      if (Math.abs(wheelVelRef.current) < minVel && idleFor > 120) {
        // 완전히 멈춘 뒤에만 스냅 대기
        wheelVelRef.current = 0;
        wheelAnimRef.current = null;
        queueSnap(160);
        return;
      }

      wheelAnimRef.current = requestAnimationFrame(step);
    };

    if (!wheelAnimRef.current) {
      wheelAnimRef.current = requestAnimationFrame(step);
    }
  };

  const handleWheel = (e) => {
    const el = scrollRef.current;
    if (!el) return;
    if (e.ctrlKey) return; // 확대/축소 제스처는 통과

    // 기본 휠 스크롤 억제 후 관성 스크롤 적용
    e.preventDefault();
    lastWheelTsRef.current = performance.now();

    // deltaY를 속도로 누적 (가속 계수로 민감도 조절)
    const accel = 0.2; // 감도 낮춤: 한 스텝 당 이동량 축소
    const MAX_SPEED = 15; // px/frame 상한을 낮춰 과속 억제
    wheelVelRef.current += e.deltaY * accel;
    // 속도 상한/하한 캡
    if (wheelVelRef.current > MAX_SPEED) wheelVelRef.current = MAX_SPEED;
    if (wheelVelRef.current < -MAX_SPEED) wheelVelRef.current = -MAX_SPEED;

    // 사용자 스크롤 중 상태로 표시
    isUserScrollingRef.current = true;

    startWheelAnim();
  };

  // ===== 외부 selectedIndex 변경(키보드 포함) 시 동기화 =====
  useEffect(() => {
    if (!ready) return;
    const el = scrollRef.current;
    if (!el) return;

    const target = exactCenterTopForIndex(el, selectedIndex);

    // 키보드로 빠르게 이동할 때 이전 이동/스냅 타이머 취소
    clearTimers();

    progScrollRef.current = true;          // 프로그램틱 스크롤 시작
    setActiveIndex(selectedIndex);         // 오버레이 즉시 동기화

    el.scrollTo({ top: target, behavior: 'smooth' });
    // 강제 정렬(미세 오차 제거) — 너무 이르면 끊김이 느껴져 지연 및 임계값 체크
    forceAlignTimerRef.current = setTimeout(() => {
      if (Math.abs(el.scrollTop - target) > 1) {
        el.scrollTo({ top: target, behavior: 'auto' });
      }
      progScrollRef.current = false;       // 프로그램틱 스크롤 종료
      // 프로그램틱 종료 뒤 살짝 스냅 보정(거의 변화 없겠지만 안전용)
      queueSnap(140);
    }, 280);

  }, [selectedIndex, ready, pad]);

  // ===== 초기 위치 세팅 =====
  useEffect(() => {
    if (!ready) return;
    const el = scrollRef.current;
    if (!el) return;

    const target = exactCenterTopForIndex(el, selectedIndex);
    el.scrollTop = target; // 첫 위치는 즉시 고정
    setActiveIndex(selectedIndex);
  }, [ready, pad]);

  return (
    <Wrapper>
      <List ref={scrollRef} onScroll={handleScroll} onWheel={handleWheel}>
        <Spacer style={{ height: pad }} aria-hidden />
        {data.map((item, index) => {
          const isActive = index === activeIndex;
          return (
            <Item data-item key={index}>
              <ItemInner>
                {isActive ? (
                  <>
                    <Arrows src="/images/left.png" alt="left" />
                    <SelectedItemContainer
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onConfirmSelected) onConfirmSelected();
                      }}
                    >
                      <SelectedText>{item.name}</SelectedText>
                    </SelectedItemContainer>
                    <Arrows src="/images/right.png" alt="right" />
                  </>
                ) : (
                  <UnselectedText>{item.name}</UnselectedText>
                )}
              </ItemInner>
              <ClickableCover
                onClick={() => {
                  const el = scrollRef.current;
                  if (!el) return;
                  clearTimers();
                  const target = exactCenterTopForIndex(el, index);
                  isUserScrollingRef.current = true;
                  el.scrollTo({ top: target, behavior: 'smooth' });
                  forceAlignTimerRef.current = setTimeout(() => {
                    if (Math.abs(el.scrollTop - target) > 1) {
                      el.scrollTo({ top: target, behavior: 'auto' });
                    }
                    isUserScrollingRef.current = false;
                  }, 240);
                  queueSnap(180);
                }}
              />
            </Item>
          );
        })}
        <Spacer style={{ height: pad }} aria-hidden />
      </List>
    </Wrapper>
  );
};

export default Picker;

const CENTER_BAND_VW = '4.6vw';

const Wrapper = styled.div`
  position: relative;
  width: 40vw;
  height: 81vh;
`;

const List = styled.div`
  position: absolute;
  inset: 0;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* snap은 JS로 제어하므로 CSS 스냅 비활성화 (충돌/미세 떨림 방지) */
  /* scroll-snap-type: y proximity; */
  /* Ensure smooth/natural scroll on iOS/iPadOS */
  -webkit-overflow-scrolling: touch;
  touch-action: pan-y;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar { display: none; }
`;

const Spacer = styled.div`
  flex: 0 0 auto;
  width: 100%;
`;

const Item = styled.div`
  position: relative;
  width: 100%;
  height: ${CENTER_BAND_VW};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 8px 0;                 /* 간격 */
  scroll-snap-align: center;
`;

const ItemInner = styled.div`
  height: 4.1vw;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ClickableCover = styled.div`
  position: absolute;
  inset: 0;
  cursor: pointer;
`;

const SelectedItemContainer = styled.div`
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ff62d3;  
  width: 26.5vw;
  height: 100%;
  z-index: 2;
`;

const Arrows = styled.img`
  width: 24px;
  height: 42px;
  margin: 0 18px;
  z-index: 2;
`;

const SelectedText = styled.p`
  font-family: 'DungGeunMo', sans-serif;
  font-size: 3.75vw;
  font-weight: 400;
  color: white;
  margin: 0;
  white-space: nowrap;
`;

const UnselectedText = styled.p`
  font-family: 'DungGeunMo', sans-serif;
  font-size: 3vw;
  font-weight: 400;
  color: rgba(255,255,255,0.2);  /* 더 연하게 */
  margin: 0;
  white-space: nowrap;
  z-index: 2;
`;
