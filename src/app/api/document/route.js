import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { bigIntToString } from "@/utils/bigIntToString";

export async function GET(request) {
  try {
    const documentValue = await prisma.document.findMany({

    });

    console.log(documentValue);

    // Serialize with the custom replacer to convert BigInt to Number
    const serializedData = JSON.stringify(documentValue, bigIntToString);

    // Parse the serialized data back to an object (optional step)
    const document = JSON.parse(serializedData);
    return NextResponse.json({ document }, { status: 200 }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { message: "Internal Error", error },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  const data = await request.formData();
  const documentIdValue = data.get('documentId');
  const documentUrlValue = data.get('documentUrl');

  if (!documentIdValue) {
    return NextResponse.json(
      { message: "DocumentId Error" },
      { status: 500 }
    );
  }

  if (!documentUrlValue) {
    return NextResponse.json(
      { message: "DocumentUrl Error" },
      { status: 500 }
    );
  }

  const documentId = parseInt(documentIdValue);
  const documentUrl = documentUrlValue;
  try {

    // Check if email or username already exist
    const existingDocument = await prisma.document.findFirst({
      where: {
        id: documentId
      },
    });

    if (existingDocument) {
      return NextResponse.json(
        { message: "Existing Document Error" },
        { status: 500 }
      );
    }

    const documentValue = await prisma.document.create({
      data: {
        id: documentId,
        documentUrl: documentUrl
      },
    });

    // Serialize with the custom replacer to convert BigInt to Number
    const serializedData = JSON.stringify(documentValue, bigIntToString);

    // Parse the serialized data back to an object (optional step)
    const document = JSON.parse(serializedData);

    return NextResponse.json({ message: 'document uploaded:', document }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: err.message},
      { status: 500 }
    );
  }
}
