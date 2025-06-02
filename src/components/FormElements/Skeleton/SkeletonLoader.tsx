import React from "react";

const SkeletonLoader = ({ type = "list", count = 4 }) => {
  const skeletonClass =
    "animate-pulse bg-gray-200 rounded-md";

  if (type === "form") {
    return (
      <div className="space-y-6">
        {[...Array(count)].map((_, i) => (
          <div key={i} className="space-y-3">
            <div className={`h-8 w-1/3 ${skeletonClass}`} />
            <div className={`h-10 w-full ${skeletonClass}`} />                        
            <div className={`h-10 w-full ${skeletonClass}`} />                        
          </div>
          
        ))}
      </div>
    );
  }

  return <div>Loading...</div>;
};

export default SkeletonLoader;
