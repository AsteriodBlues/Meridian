'use client';

import { useState, useRef, useEffect } from 'react';

interface TwoFactorInputProps {
  onComplete: (code: string) => void;
  isLoading?: boolean;
}

export default function TwoFactorInput({ onComplete, isLoading = false }: TwoFactorInputProps) {
  const [codes, setCodes] = useState<string[]>(new Array(6).fill(''));
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newCodes = [...codes];
    newCodes[index] = value;
    setCodes(newCodes);

    if (value && index < 5) {
      setActiveIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    }

    if (newCodes.every(code => code)) {
      onComplete(newCodes.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !codes[index] && index > 0) {
      setActiveIndex(index - 1);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const newCodes = [...codes];
    
    for (let i = 0; i < pastedData.length; i++) {
      if (i < 6) {
        newCodes[i] = pastedData[i];
      }
    }
    
    setCodes(newCodes);
    
    if (newCodes.every(code => code)) {
      onComplete(newCodes.join(''));
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Two-Factor Authentication
        </h3>
        <p className="text-gray-600 text-sm">
          Enter the 6-digit code from your authenticator app
        </p>
      </div>

      <div className="flex justify-center gap-3">
        {codes.map((code, index) => (
          <div
            key={index}
            className={`
              relative w-12 h-14 rounded-xl border-2 transition-all duration-300
              ${activeIndex === index 
                ? 'border-blue-500 ring-4 ring-blue-100 scale-105' 
                : code 
                  ? 'border-green-400 bg-green-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }
              ${isLoading ? 'animate-pulse' : ''}
            `}
          >
            <input
              ref={(el) => { inputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]"
              maxLength={1}
              value={code}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              onFocus={() => setActiveIndex(index)}
              disabled={isLoading}
              className={`
                w-full h-full text-center text-xl font-bold bg-transparent
                outline-none rounded-xl transition-all duration-200
                ${code ? 'text-green-600' : 'text-gray-900'}
                ${isLoading ? 'cursor-not-allowed' : 'cursor-text'}
              `}
            />
            
            {activeIndex === index && !isLoading && (
              <div className="absolute inset-0 rounded-xl bg-blue-500/10 animate-pulse" />
            )}
            
            {code && (
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping opacity-75" />
            )}
          </div>
        ))}
      </div>

      {codes.every(code => code) && !isLoading && (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-green-600 text-sm font-medium">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            Code complete
          </div>
        </div>
      )}

      {isLoading && (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-blue-600 text-sm">
            <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            Verifying code...
          </div>
        </div>
      )}
    </div>
  );
}