export const ZapLayout = ({ name, index }: { name: string; index: number }) => {
  return (
    <div className="py-6">
      <div className="flex border cursor-pointer border-black py-8 px-8 w-[300px] justify-center ">
        <div className="flex text-xl">
          <div className="font-bold">{index}.</div>
          <div>{name}</div>
        </div>
      </div>
    </div>
  );
};
