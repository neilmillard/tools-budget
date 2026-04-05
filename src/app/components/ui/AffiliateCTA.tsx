import React from 'react';

interface AffiliateCTAProps {
  title: string;
  description: string;
  buttonText: string;
  url: string;
  isInvestment?: boolean;
}

export const AffiliateCTA: React.FC<AffiliateCTAProps> = ({
  title,
  description,
  buttonText,
  url,
  isInvestment = false,
}) => {
  return (
    <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8 rounded-r-lg shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-blue-900 mb-2">{title}</h3>
          <p className="text-gray-700 mb-2">{description}</p>
          <p className="text-xs text-gray-500 italic">
            This is an affiliate link. We may earn a commission at no cost to you.
            {isInvestment && <span className="block font-semibold text-red-600 mt-1 uppercase tracking-tight">Capital at risk.</span>}
          </p>
        </div>
        <div className="flex-shrink-0">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors text-center shadow-md hover:shadow-lg"
          >
            {buttonText}
          </a>
        </div>
      </div>
    </div>
  );
};

export default AffiliateCTA;
