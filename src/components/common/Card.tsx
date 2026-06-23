const Card = ({ icon, title, subtitle, count }) => {
  return (
    <div className="bg-white border-1 border-solid border-black rounded-2 px-3.5 py-3">
      <div className="text-[11px] text-black mt-0 mx-0 mb-[5px] flex items-center gap-[5px]">
        <div className={icon}></div>
        <p>{title}</p>
      </div>
      <p className="text-[20px] font-medium text-black m-0">{count}</p>
      <p className="text-[11px] text-black mt-[3px] mx-0 mb-0">{subtitle}</p>
    </div>
  );
};

export default Card;
