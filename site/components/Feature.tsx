export interface FeatureProps {
  title: string;
  description: string;
}
export default function Feature({ title, description }: FeatureProps) {
  return (
    <div className="flex flex-col bg-neutral m-4 p-2 text-left rounded-lg min-h-[10rem] w-[24rem] mx-auto">
      <h2 className="text-2xl font-bold w-full">{title}</h2>
      <p className="indent-5 m-2">{description}</p>
    </div>
  );
}
