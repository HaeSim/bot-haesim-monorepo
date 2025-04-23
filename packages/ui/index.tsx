import React from 'react';

// 버튼 컴포넌트
export interface ButtonProps {
  primary?: boolean;
  size?: 'small' | 'medium' | 'large';
  label: string;
  onClick?: () => void;
}

export const Button = ({
  primary = false,
  size = 'medium',
  label,
  onClick,
}: ButtonProps) => {
  const baseStyles = 'rounded font-bold';
  const sizeStyles = {
    small: 'py-1 px-2 text-sm',
    medium: 'py-2 px-4 text-base',
    large: 'py-3 px-6 text-lg',
  };
  const colorStyles = primary
    ? 'bg-blue-500 text-white hover:bg-blue-600'
    : 'bg-gray-200 text-gray-800 hover:bg-gray-300';

  return (
    <button
      type='button'
      className={`${baseStyles} ${sizeStyles[size]} ${colorStyles}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

// 카드 컴포넌트
export interface CardProps {
  title: string;
  description: string;
  imgSrc?: string;
}

export const Card = ({ title, description, imgSrc }: CardProps) => {
  return (
    <div className='max-w-sm rounded overflow-hidden shadow-lg'>
      {imgSrc && <img className='w-full' src={imgSrc} alt={title} />}
      <div className='px-6 py-4'>
        <div className='font-bold text-xl mb-2'>{title}</div>
        <p className='text-gray-700 text-base'>{description}</p>
      </div>
    </div>
  );
};

// Input 컴포넌트
export interface InputProps {
  placeholder?: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
}

export const Input = ({
  placeholder,
  type = 'text',
  value,
  onChange,
  label,
}: InputProps) => {
  return (
    <div className='mb-4'>
      {label && (
        <label className='block text-gray-700 text-sm font-bold mb-2'>
          {label}
        </label>
      )}
      <input
        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  );
};
