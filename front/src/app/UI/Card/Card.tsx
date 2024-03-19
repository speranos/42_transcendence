import React, { ReactNode } from 'react';


interface CardProps {
  className?: string;
  children: ReactNode;
}

const Card: React.FC<CardProps> = (props) => {
  // className={`${classes.card} ${props.className}`}
  return <div className="flex h-screen w-full items-center justify-center border bg-gradient-to-t from-green-400 to-blue-200">
      {props.children}
  </div>;
};

export default Card;
