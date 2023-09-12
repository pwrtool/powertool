import Feature from "./Feature";

export default function Features() {
  return (
    <section>
      <div className="flex flex-col justify-center align-middle lg:flex-row max-w-[80rem] mx-auto">
        <Feature
          title="🔥 Fast"
          description="No more waiting for templates to finish installing. Starting a new project is as simple as copying some files."
        />
        <Feature
          title="🌍 Multilingual"
          description="Powertool is built to be multilingual. Use whatever language or tool you want without compromising."
        />
        <Feature
          title="🧸 Friendly"
          description="Powertool has comprehensive documentation, an easy to use toolkit for you to start automating with."
        />
      </div>
    </section>
  );
}
