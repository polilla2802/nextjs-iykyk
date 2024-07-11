"use client";
import { useState, useRef, useEffect } from "react";
import dynamic from 'next/dynamic';
import styles from "./ContentForm.module.css"; // Import the CSS module

// Dynamically import html2canvas and html2pdf
const html2canvas = dynamic(() => import("html2canvas"), { ssr: false });
const html2pdf = dynamic(() => import("html2pdf.js"), { ssr: false });

export default function ContentForm() {
	const [isMounted, setIsMounted] = useState(false);
	const membershipType = { 1: "ANUAL", 2: "IYKYK", 3: "MENSUAL" };
	const data = {
		membership: membershipType[1],
	};
	const [formData, setFormData] = useState({
		NAME: "",
		MEMBERSHIPTYPE: "",
		BIRTHDAY: "",
		DOCUMENTID: "",
	});

	const tableRef = useRef();

	const handleCapture = async () => {
		const table = tableRef.current;

		try {
			const canvas = await html2canvas(table);
			const dataUrl = canvas.toDataURL("image/png");
			const timestamp = Date.now();
			const randomString = Math.random().toString(36).substring(2, 18);
			data.imgName = `${timestamp}_${randomString}.png`;
			data.imgContent = dataUrl;
		} catch (error) {
			console.error("Error:", error);
		}
	};

	const handleOpenPDF = async () => {
		const element = document.getElementById("tarjeta");

		const options = {
			margin: 10,
			filename: "documento.pdf",
			image: { type: "jpeg", quality: 0.98 },
			html2canvas: { scale: 3 },
			jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
		};

		const pdf = await html2pdf().set(options).from(element).save();
	};

	const form = useRef(null);

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
				", ",
			)}.`;

			console.log(mensaje)
			return;
		}
		await handleCapture();
		data.formData = formData;
	};

	useEffect(() => {
		setIsMounted(true);
	}, []);

	if (!isMounted) {
		return null;
	}

	return (
		<div className="grid-cols-2 gap-10 lg:grid justify-items-center mt-10">
			<div className="w-full p-2 my-3 bg-white rounded-lg shadow-2xl md:w-2/3">
				<div className="w-full p-2 my-3 bg-white">
					<form
						className="px-8 pt-6 pb-8 mb-4 bg-white"
						onSubmit={handleSubmit}
						ref={form}
					>
						<>
							<label
								htmlFor="NAME"
								className="block mb-2 text-sm font-bold text-primaryBlue"
							>
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
							<label
								htmlFor="MEMBERSHIPTYPE"
								className="block my-2 text-sm font-bold text-primaryBlue"
							>
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
							<label
								htmlFor="BIRTHDAY"
								className="block my-2 text-sm font-bold text-primaryBlue"
							>
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
							<label
								htmlFor="DOCUMENTID"
								className="block my-2 text-sm font-bold text-primaryBlue"
							>
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
					</form>
				</div>
			</div>
			<div>
				<div className={`${styles.membership}`} ref={tableRef} id="tarjeta">
					<>
						<table
							background={"/images/membership-final.png"}
							className="bg-no-repeat bg-cover bg-center rounded-2xl"
						>
							<tbody height="100%">
								<tr height="100%">
									<td width="60%" className="align-bottom pb-5 pl-5 md:pl-10">
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
												{formData.DOCUMENTID !== "" ? formData.DOCUMENTID : "NÚMERO DE DOCUMENTO"}
											</p>
										</div>
									</td>
									<td width="40%" className={`${styles.socio} align-bottom pb-5 pr-5 md:pr-10`}>
										<div>
											<p className="py-0 text-left capitalize whitespace-nowrap">
												CÓDIGO DE SOCIO
											</p>
											<p className="py-0 text-left capitalize">
												0000000000000
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
							onClick={handleOpenPDF}
							className="block uppercase whitespace-nowrap font-formaBold tracking-widest w-min m-auto px-4 py-2 text-xs text-center text-white shadow bg-primaryBlue md:text-sm"
						>
							Generar PDF
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
