import React, { useState, useEffect } from 'react';

export default function RenderText({ url }) {
  const [text, setText] = useState('');

  useEffect(() => {
    async function fetchText() {
      const response = await fetch(url);
      const text = await response.text();
      setText(text);
    }
    fetchText();
  }, []);

  return (
    <div>
      <p>{text}</p>
    </div>
  );
}
