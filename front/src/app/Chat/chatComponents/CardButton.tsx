"use client";
import React, { useState } from 'react';
// import Button from '@/components/ui/Buttons'
import { CardWithForm } from './CardWithForm';
import socket, { Socket } from "socket.io-client";
import { Props } from 'next/script';
import Button from './ui/Buttons';

interface CardButtonProps {
  Socket: Socket; 
}

const CardButton: React.FC<CardButtonProps> = ({ Socket }) => {
  const [showCard, setShowCard] = useState(false);

  const handleButtonClick = () => {
    //('alo yoo');
    setShowCard(!showCard);
  };

  return [
    <Button key="button" onClick={handleButtonClick}>
      {showCard ? 'Hide ' : 'Create Group'}
    </Button>,
    showCard && <CardWithForm  key="card" socket={Socket} />
  ];
};

export default CardButton;