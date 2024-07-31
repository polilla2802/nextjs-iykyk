// src/app/page.js
import ContentForm from "./components/ContentForm";
import UpoloadDocument from "./components/UploadDocument";

export default function Home() {

  return (
    <>
      <section className="container px-4 py-4 m-auto">
        <h1 className="text-8xl">IYKYK</h1>
        <UpoloadDocument />
        <ContentForm documentId={"990824805647122433"} />
      </section>
    </>
  );
}
