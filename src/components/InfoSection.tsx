import React from 'react';

interface InfoItem {
  label: string;
  value: string | number | React.ReactNode;
}

interface InfoSectionProps {
  title: string;
  icon: React.ReactNode;
  items: InfoItem[];
}

const InfoSection: React.FC<InfoSectionProps> = ({ title, icon, items }) => {
  return (
    <div className="border-b border-gray-200 pb-4 rounded shadow-sm p-4">
      <h2 className="text-xl sm:text-2xl font-semibold mb-3 text-white">
        {icon} {title}
      </h2>
      {items.map((item, index) => (
        <p key={index} className="text-sm sm:text-base flex justify-between">
          <strong className="font-medium">{item.label}:</strong> <span>{item.value}</span>
        </p>
      ))}
    </div>
  );
};

export default InfoSection;
