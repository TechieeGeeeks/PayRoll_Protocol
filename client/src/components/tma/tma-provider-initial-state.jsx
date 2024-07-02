import Image from "next/image";

export function TmaProviderInitialState() {
  return (
    <div>
      <Image src={"/logo.png"} width={100} height={100} />
    </div>
  );
}
