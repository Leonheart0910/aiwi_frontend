import { useState, useEffect } from "react";

export function TypingText({ text, onComplete }) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const words = text.split(" ");

  useEffect(() => {
    if (currentIndex < words.length) {
      const timer = setTimeout(() => {
        setDisplayedText(
          (prev) => prev + (prev ? " " : "") + words[currentIndex]
        );
        setCurrentIndex((prev) => prev + 1);
      }, 100); // 각 단어마다 100ms 딜레이

      return () => clearTimeout(timer);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, words, onComplete]);

  return <p>{displayedText}</p>;
}
