import React, { useRef } from "react";
import styled from "styled-components";

const FourLetterInput = ({ inputs, setInputs }) => {
  const inputRefs = useRef({});
  // Track IME composition state per field so we only auto-advance
  // after a full syllable/character is committed (important for Korean input).
  const composingRef = useRef({});

  const setComposing = (id, field, value) => {
    composingRef.current[id] = composingRef.current[id] || {};
    composingRef.current[id][field] = value;
  };

  const isComposing = (id, field) => {
    return !!(composingRef.current[id] && composingRef.current[id][field]);
  };

  // No timer-based advance; rely on composition end and length checks.
  const handleAddInput = () => {
    setInputs((prev) => [
      ...prev,
      { id: prev.length + 1, value: "", part1: "", part2: "", part3: "" },
    ]);
  };

  const handlePartChange = (id, field, rawValue) => {
    const composing = isComposing(id, field);
    // While composing with IME (e.g., Korean), do not hard-trim.
    // Let the IME manage intermediate jamo; trim only after composition ends.
    const limited = composing
      ? rawValue || ""
      : field === "part1"
      ? (rawValue || "").slice(0, 2)
      : (rawValue || "").slice(0, 1);

    setInputs((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;

        const p1 =
          field === "part1"
            ? limited
            : item.part1 ?? item.value?.slice(0, 2) ?? "";
        const p2 =
          field === "part2"
            ? limited
            : item.part2 ?? item.value?.slice(2, 3) ?? "";
        const p3 =
          field === "part3"
            ? limited
            : item.part3 ?? item.value?.slice(3, 4) ?? "";

        return {
          ...item,
          part1: p1,
          part2: p2,
          part3: p3,
          value: `${p1}${p2}${p3}`,
        };
      })
    );

    // Autofocus next input when max length reached (but not during IME composition)
    if (!isComposing(id, field)) {
      if (field === "part1" && limited.length === 2) {
        inputRefs.current?.[id]?.part2?.focus?.();
      } else if (field === "part2" && limited.length === 1) {
        inputRefs.current?.[id]?.part3?.focus?.();
      }
    }
  };

  // After composition ends, re-check auto-advance conditions using the committed value
  const handleCompositionEndAutoAdvance = (id, field, currentValue) => {
    // Immediately re-check after composition commits.
    const limited =
      field === "part1"
        ? (currentValue || "").slice(0, 2)
        : (currentValue || "").slice(0, 1);
    if (field === "part1" && limited.length === 2) {
      inputRefs.current?.[id]?.part2?.focus?.();
    } else if (field === "part2" && limited.length === 1) {
      inputRefs.current?.[id]?.part3?.focus?.();
    }
  };

  const handleKeyDown = (id, field, e) => {
    if (e.key !== "Backspace") return;
    const item = inputs.find((x) => x.id === id);
    if (!item) return;

    const p1 = item.part1 ?? item.value?.slice(0, 2) ?? "";
    const p2 = item.part2 ?? item.value?.slice(2, 3) ?? "";
    const p3 = item.part3 ?? item.value?.slice(3, 4) ?? "";

    if (field === "part3" && (p3 ?? "").length === 0) {
      e.preventDefault();
      inputRefs.current?.[id]?.part2?.focus?.();
      return;
    }
    if (field === "part2" && (p2 ?? "").length === 0) {
      e.preventDefault();
      inputRefs.current?.[id]?.part1?.focus?.();
      return;
    }
    // part1 at empty: do nothing special
  };
  return (
    <InputContainer>
      <InputTopRow>
        <GameTypeBadge>네글자퀴즈</GameTypeBadge>
        <InfoIcon>i</InfoIcon>
        <EditBtn>편집</EditBtn>
      </InputTopRow>

      <InputBoxesScrollArea>
        <InputBoxesContainer>
          {inputs.map((item) => (
            <InputBox key={item.id}>
              <InputIndex>{item.id}</InputIndex>
              <Input
                // Avoid enforcing maxLength during IME composition to prevent truncation of jamo
                maxLength={isComposing(item.id, "part1") ? undefined : 2}
                value={item.part1 ?? item.value?.slice(0, 2) ?? ""}
                onChange={(e) =>
                  handlePartChange(item.id, "part1", e.target.value)
                }
                onKeyDown={(e) => handleKeyDown(item.id, "part1", e)}
                onCompositionStart={() => {
                  setComposing(item.id, "part1", true);
                }}
                onCompositionEnd={(e) => {
                  setComposing(item.id, "part1", false);
                  // Ensure trimming and state update post-composition
                  handlePartChange(item.id, "part1", e.target.value);
                  handleCompositionEndAutoAdvance(
                    item.id,
                    "part1",
                    e.target.value
                  );
                }}
                ref={(el) => {
                  inputRefs.current[item.id] = inputRefs.current[item.id] || {};
                  inputRefs.current[item.id].part1 = el;
                }}
              />
              <Input2
                // Avoid enforcing maxLength during IME composition to allow full syllable commit
                maxLength={isComposing(item.id, "part2") ? undefined : 1}
                value={item.part2 ?? item.value?.slice(2, 3) ?? ""}
                onChange={(e) =>
                  handlePartChange(item.id, "part2", e.target.value)
                }
                onKeyDown={(e) => handleKeyDown(item.id, "part2", e)}
                onCompositionStart={() => {
                  setComposing(item.id, "part2", true);
                }}
                onCompositionEnd={(e) => {
                  setComposing(item.id, "part2", false);
                  // Ensure trimming and state update post-composition
                  handlePartChange(item.id, "part2", e.target.value);
                  handleCompositionEndAutoAdvance(
                    item.id,
                    "part2",
                    e.target.value
                  );
                }}
                ref={(el) => {
                  inputRefs.current[item.id] = inputRefs.current[item.id] || {};
                  inputRefs.current[item.id].part2 = el;
                }}
              />
              <Input2
                // Avoid enforcing maxLength during IME composition to allow full syllable commit
                maxLength={isComposing(item.id, "part3") ? undefined : 1}
                value={item.part3 ?? item.value?.slice(3, 4) ?? ""}
                onChange={(e) =>
                  handlePartChange(item.id, "part3", e.target.value)
                }
                onKeyDown={(e) => handleKeyDown(item.id, "part3", e)}
                onCompositionStart={() => {
                  setComposing(item.id, "part3", true);
                }}
                onCompositionEnd={(e) => {
                  setComposing(item.id, "part3", false);
                  // Ensure trimming and state update post-composition
                  handlePartChange(item.id, "part3", e.target.value);
                }}
                ref={(el) => {
                  inputRefs.current[item.id] = inputRefs.current[item.id] || {};
                  inputRefs.current[item.id].part3 = el;
                }}
              />
            </InputBox>
          ))}
        </InputBoxesContainer>
        <AddInputBoxBtn onClick={handleAddInput}>+</AddInputBoxBtn>
      </InputBoxesScrollArea>
      <SaveBtn>저장</SaveBtn>
    </InputContainer>
  );
};

export default FourLetterInput;

const InputContainer = styled.div`
  flex: 1;
  width: 100%;
  padding: 0 40px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

const InputBoxesContainer = styled.div`
  padding-right: 40px;
`;

const InputBox = styled.div`
  background-color: red;
  width: 100%;
  padding: 5px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-radius: 3px;
  background: rgba(238, 238, 238, 0.2);
  margin-top: 15px;
  gap: 10px;
`;

const InputIndex = styled.div`
  color: #fff;
  margin-left: 13px;
  color: #dadadb;
  font-family: DungGeunMo;
  font-size: 24px;
`;

const Input = styled.input`
  width: 60px;
  height: 3.33vh;
  min-height: 30px;
  margin-left: 30px;
  text-align: center;

  font-family: DungGeunMo;
  font-size: 18px;
  color: #fff;

  background: transparent;
  border: none;
  border-bottom: 1px solid #fff;
  border-radius: 0;
  padding: 2px 0;

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
    font-family: DungGeunMo;
    font-size: 18px;
    text-align: center;
  }

  &:focus {
    outline: none;
    border-bottom: 2px solid #fff;
  }
`;

const Input2 = styled.input`
  height: 3.33vh;
  min-height: 30px;
  width: 3.33vh;
  min-width: 30px;
  text-align: center;

  border-radius: 3px;
  border: 1px solid rgba(160, 160, 160, 0.7);
  background: rgba(160, 160, 160, 0.7);

  font-family: DungGeunMo;
  font-size: 18px;
  color: #25262d;

  &::placeholder {
    color: #25262d;
    font-family: DungGeunMo;
    font-size: 18px;
    text-align: center;
  }

  &:focus {
    border: 3px solid gray;
    outline: none;
  }
`;

const AddInputBoxBtn = styled.div`
  border-radius: 4px;
  background: #d3d3d3;
  display: flex;
  width: 26px;
  height: 26px;
  padding: 6.106px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 6.106px;
  flex-shrink: 0;
  color: #000;
  font-family: DungGeunMo;
  font-size: 25px;
  cursor: pointer;
  margin: 40px auto 0 auto;
`;

const SaveBtn = styled.div`
  align-self: center;
  border-radius: 6px;
  background: rgba(255, 98, 211, 0.3);
  width: 95%;
  height: 40px;
  color: #ff62d3;
  font-family: DungGeunMo;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  margin-top: 12px;
  margin-bottom: 8px;
  margin-right: 35px;

  &:hover {
    background: rgba(255, 98, 211, 0.45);
  }
`;

const InputBoxesScrollArea = styled.div`
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  overflow-x: hidden;
  padding-bottom: 8px; /* small breathing room above SaveBtn */
`;

const InputTopRow = styled.div`
  margin-top: 20px;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
`;

const GameTypeBadge = styled.span`
  color: #ff62d3;
  font-size: 22px;
  border-radius: 6px;
  background: rgba(255, 98, 211, 0.2);
  display: flex;
  width: 14vw;
  height: 7vh;
  padding: 12px;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  box-sizing: border-box;
`;

const InfoIcon = styled.span`
  color: #dadadb;
  font-family: DungGeunMo;
  font-size: 15.961px;
  border-radius: 19.153px;
  background: #858587;
  display: flex;
  width: 13px;
  height: 13px;
  padding: 4.873px;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
  margin-left: 20px;
`;

const EditBtn = styled.span`
  color: #858587;
  font-family: DungGeunMo;
  font-size: 20px;
  cursor: pointer;
  position: absolute;
  right: 150px;

  &:hover {
    text-decoration: underline;
  }
`;
