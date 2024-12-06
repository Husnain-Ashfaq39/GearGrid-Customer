"use client";
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaMicrophone, FaMicrophoneSlash } from 'react-icons/fa';

const VoiceSearch = ({ onSearch, onClose, isOpen }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState(null);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setError('Your browser does not support Speech Recognition.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onresult = (event) => {
      let interim = '';
      let final = '';
      
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const result = event.results[i];
        if (result.isFinal) {
          final += result[0].transcript;
          setTranscript(final);
          onSearch(final);
          stopListening();
          onClose();
        } else {
          interim += result[0].transcript;
          setInterimTranscript(interim);
        }
      }
    };

    recognition.onerror = (event) => {
      let message;
      switch (event.error) {
        case 'no-speech':
          message = 'No speech was detected. Please try again.';
          break;
        case 'audio-capture':
          message = 'No microphone was found.';
          break;
        case 'not-allowed':
          message = 'Microphone permission denied.';
          break;
        default:
          message = `Error: ${event.error}`;
      }
      setError(message);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [onSearch, onClose]);

  const startListening = () => {
    if (recognitionRef.current) {
      setError(null);
      setTranscript('');
      setInterimTranscript('');
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error('Recognition already started', e);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg p-8 max-w-md w-full mx-4 shadow-xl"
            onClick={e => e.stopPropagation()}
          >
            <div className="text-center">
              <motion.button
                onClick={isListening ? stopListening : startListening}
                className={`w-20 h-20 rounded-full flex items-center justify-center text-2xl mb-4 mx-auto
                  ${isListening 
                    ? 'bg-red-500 hover:bg-red-600' 
                    : 'bg-blue-500 hover:bg-blue-600'} 
                  text-white transition-colors`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isListening ? <FaMicrophone /> : <FaMicrophoneSlash />}
              </motion.button>
              
              <h2 className="text-xl font-semibold mb-2 dark:text-white">
                {isListening ? 'Listening...' : 'Click to Start Speaking'}
              </h2>
              
              {interimTranscript && (
                <p className="text-gray-600 dark:text-gray-300 mb-4 italic">
                  {interimTranscript}
                </p>
              )}
              
              {transcript && (
                <p className="text-gray-800 dark:text-gray-200 mb-4 font-medium">
                  {transcript}
                </p>
              )}
              
              {error && (
                <p className="text-red-500 mb-4">
                  {error}
                </p>
              )}
              
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {isListening 
                  ? 'Click the microphone to stop' 
                  : 'Click the microphone to start'}
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VoiceSearch;
