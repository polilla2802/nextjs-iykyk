"use client";
import styles from "./ContentForm.module.css"; // Import the CSS module
import toast from "react-hot-toast";
import { useState, useRef, useEffect } from "react";
import { storage } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function ContentForm({ documentId }) {
  const membershipType = { 1: "ANUAL", 2: "IYKYK", 3: "MENSUAL" };
  const data = {
    membership: membershipType[1],
  };
  const [formData, setFormData] = useState({
    NAME: "",
    MEMBERSHIPTYPE: "",
    BIRTHDAY: "",
    DOCUMENTID: "",
    SOCIOCODE: "",
  });
  const [downloadURL, setDownloadURL] = useState("");
  const [socioCode, setSocioCode] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const tableRef = useRef();
  const form = useRef(null);

  const generateSocioCode = () => {
    const code = Math.floor(Math.random() * 10 ** 13).toString().padStart(13, '0');
    setSocioCode(code);
    setFormData({
      ...formData,
      SOCIOCODE: code,
    });
  };

  const handleCapture = async () => {
    const table = tableRef.current;
    try {
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(table);
      const dataUrl = canvas.toDataURL("image/png");
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 18);
      data.imgName = `${timestamp}_${randomString}.png`;
      data.imgContent = dataUrl;
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const createMembership = async (membershipUrl) => {
    try {
      const formData = new FormData();
      formData.append("membershipId", socioCode);
      formData.append("membershipUrl", membershipUrl);
      formData.append("documentId", documentId != null ? documentId : null);
      formData.append("type", "MEMBRESIA");

      console.log(membershipUrl);
      console.log(socioCode);
      console.log(documentId);
      console.log(formData.MEMBERSHIPTYPE);
      
      const response = await fetch("/api/membership", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to create membership");
      }

      const membership = await response.json();
      console.log("Membership created:", membership);
      setUploadSuccess(true);
    } catch (error) {
      console.log("Error creating membership:", error);
    }
  };

  const handleSaveAsPNG = async () => {
    const html2canvas = (await import("html2canvas")).default;

    const element = document.getElementById("tarjeta");
    const randomString = Math.random().toString(36).substring(2, 18);
    const timestamp = Date.now();
    const filename = `${timestamp}_${randomString}_IYKYK.png`;

    try {
      const canvas = await html2canvas(element, { scale: 3, quality: 1 });

      canvas.toBlob(async (blob) => {
        if (blob) {
          const link = document.createElement('a');
          link.href = URL.createObjectURL(blob);
          link.download = filename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          const storageRef = ref(storage, `membership/${filename}`);
          const snapshot = await uploadBytes(storageRef, blob);
          console.log('Uploaded a blob or file!');

          const downloadURL = await getDownloadURL(snapshot.ref);
          console.log('File available at', downloadURL);
          await createMembership(downloadURL);
        }
      }, 'image/png', 0.98);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleOpenPDF = async () => {
    const element = document.getElementById("tarjeta");
    const randomString = Math.random().toString(36).substring(2, 18);
    const timestamp = Date.now();
    const options = {
      margin: 10,
      filename: `${timestamp}_${randomString}_IYKYK.png`,
      image: { type: "png", quality: .98 },
      html2canvas: { scale: 3 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    try {
      const html2pdf = (await import("html2pdf.js")).default;
      element.classList.add(styles.tableHeight); 
      const pdfBlob = await html2pdf().set(options).from(element).save();
      element.classList.remove(styles.tableHeight); 

      const storageRef = ref(storage, `pdfs/${options.filename}`);
      const snapshot = await uploadBytes(storageRef, pdfBlob);
      console.log('Uploaded a blob or file!');

      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('File available at', downloadURL);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.NAME ||
      !formData.MEMBERSHIPTYPE ||
      !formData.BIRTHDAY ||
      !formData.DOCUMENTID
    ) {
      const camposVacios = [];

      if (!formData.NAME) {
        camposVacios.push("Nombre");
      }

      if (!formData.MEMBERSHIPTYPE) {
        camposVacios.push("Tipo de Membresia");
      }

      if (!formData.BIRTHDAY) {
        camposVacios.push("Cumpleaños");
      }

      if (!formData.DOCUMENTID) {
        camposVacios.push("Número de Documento");
      }

      const mensaje = `Por favor, completa los siguientes campos obligatorios: ${camposVacios.join(
        ", "
      )}.`;

      toast.error(mensaje);
      return;
    } else {
      data.formData = formData;
      await handleSaveAsPNG();
    }
  };

  useEffect(() => {
    setIsMounted(true);
    generateSocioCode();
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} ref={form}>
      <div className="grid-cols-2 mt-10 lg:grid justify-items-center">
        <div className="w-full p-2 mx-auto mb-10 bg-white rounded-lg shadow-2xl lg:w-4/5">
          <div className="w-full bg-white">
            <div className="px-8 pt-6 pb-8 mb-4 bg-white">
              <>
                <label htmlFor="NAME" className="block mb-2 text-sm font-bold text-primaryBlue">
                  NOMBRE:
                  <i className="font-light">
                    <span className="text-red-700"> *</span>
                  </i>
                </label>
                <input
                  name="NAME"
                  type="text"
                  onChange={handleChange}
                  maxLength={18}
                  className="w-full px-3 py-2 border shadow appearance-none"
                  required
                  autoFocus
                />
              </>

              <>
                <label htmlFor="MEMBERSHIPTYPE" className="block my-2 text-sm font-bold text-primaryBlue">
                  MEMBRESIA:
                  <i className="font-light">
                    <span className="text-red-700"> *</span>
                  </i>
                </label>
                <select
                  name="MEMBERSHIPTYPE"
                  onChange={handleChange}
                  className="w-full px-3 py-2 border shadow"
                  required
                >
                  <option value="">Seleccionar</option>
                  <option value="ANUAL">ANUAL</option>
                  <option value="IYKYK">IYKYK</option>
                  <option value="MENSUAL">MENSUAL</option>
                </select>
              </>

              <>
                <label htmlFor="BIRTHDAY" className="block my-2 text-sm font-bold text-primaryBlue">
                  CUMPLEAÑOS:
                  <i className="font-light">
                    <span className="text-red-700"> *</span>
                  </i>
                </label>
                <input
                  name="BIRTHDAY"
                  type="date"
                  onChange={handleChange}
                  className="w-full px-3 py-2 border shadow appearance-none"
                  required
                />
              </>

              <>
                <label htmlFor="DOCUMENTID" className="block my-2 text-sm font-bold text-primaryBlue">
                  NÚMERO DE DOCUMENTO:
                  <i className="font-light">
                    <span className="text-red-700"> *</span>
                  </i>
                </label>
                <input
                  name="DOCUMENTID"
                  type="text"
                  maxLength={20}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border shadow appearance-none"
                  required
                />
              </>
            </div>
          </div>
        </div>
        <div className="w-full">
          <div className={`${styles.membership}`} ref={tableRef} id="tarjeta">
            <>
              <table background={"/images/membership-final.png"} className="bg-center bg-no-repeat bg-cover rounded-2xl">
                <tbody height="100%">
                  <tr height="100%">
                    <td width="60%" className="pb-8 pl-5 align-bottom md:pl-10">
                      <div>
                        <p className="py-0 my-0 leading-4 text-left capitalize">
                          {formData.NAME !== "" ? formData.NAME : "NOMBRE"}
                        </p>
                        <p className="py-0 my-0 leading-4 text-left capitalize">
                          {formData.MEMBERSHIPTYPE !== "" ? formData.MEMBERSHIPTYPE : "MEMBRESIA"}
                        </p>
                        <p className="py-0 my-0 leading-4 text-left capitalize">
                          {formData.BIRTHDAY !== "" ? formData.BIRTHDAY : "CUMPLEAÑOS"}
                        </p>
                        <p className="py-0 my-0 leading-4 text-left capitalize">
                          NÚMERO DE DOCUMENTO
                        </p>
                        <p className="py-0 my-0 leading-4 text-left capitalize">
                          {formData.DOCUMENTID !== "" ? formData.DOCUMENTID : "XXXXXXXXXXX"}
                        </p>
                      </div>
                    </td>
                    <td width="40%" className={`${styles.socio} align-bottom pb-8 pr-5`}>
                      <div>
                        <p className="py-0 text-left capitalize whitespace-nowrap">
                          CÓDIGO DE SOCIO
                        </p>
                        <p className="py-0 text-left capitalize">
                          {socioCode}
                        </p>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </>
          </div>
          <p className="pt-5 text-center">
            Esta representación es lo mas cercano posible a la tarjeta final
          </p>
          <div className="flex flex-col items-center mt-6">
            <div className="w-full mb-4">
              <button
                type="submit"
                className="block px-4 py-2 m-auto text-xs tracking-widest text-center text-white uppercase shadow whitespace-nowrap font-formaBold w-min bg-primaryBlue md:text-sm"
              >
                Generar PDF
              </button>
              {uploadSuccess && <p>Membership created successfully!</p>}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
