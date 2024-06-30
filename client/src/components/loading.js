import React from "react";
import { Skeleton } from "./ui/skeleton";

const Loading = () => {
  return (
    <div className="mt-10">
      <div className="mt-10 flex justify-between scroll-m-20 pb-4 text-3xl font-semibold tracking-tight transition-colors first:mt-0 my-4">
        <Skeleton className={"h-10 w-28"} />
      </div>
      <div className="grid h-[75vh] w-full gap-5">
        <Skeleton className={"h-full w-full"} />
        <Skeleton className={"h-full w-full"} />
        <Skeleton className={"h-full w-full"} />
        <Skeleton className={"h-full w-full"} />
        <Skeleton className={"h-full w-full"} />
        <Skeleton className={"h-full w-full"} />
      </div>
      {/* <Skeleton className={"h-2"} /> */}
    </div>
  );
};

export default Loading;
