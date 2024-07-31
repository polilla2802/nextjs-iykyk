import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { bigIntToString } from "@/utils/bigIntToString";

export async function GET(request) {
  try {
    const membershipValue = await prisma.membership.findMany({
      include: {
        document: true
      },
    });

    console.log(membershipValue);

    // Serialize with the custom replacer to convert BigInt to Number
    const serializedData = JSON.stringify(membershipValue, bigIntToString);

    // Parse the serialized data back to an object (optional step)
    const membership = JSON.parse(serializedData);
    return NextResponse.json({ membership }, { status: 200 }, {
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
  const membershipIdValue = data.get('membershipId');
  const membershipUrlValue = data.get('membershipUrl');
  const documentIdValue = data.get('documentId');
  const typeValue = data.get('type');

  if (!membershipIdValue) {
    return NextResponse.json(
      { message: "membershipIdValue not provided" },
      { status: 500 }
    );
  }

  if (!membershipUrlValue) {
    return NextResponse.json(
      { message: "membershipUrlValue not provided" },
      { status: 500 }
    );
  }

  if (!typeValue) {
    return NextResponse.json(
      { message: "typeValue not provided" },
      { status: 500 }
    );
  }

  const membershipId = parseInt(membershipIdValue);
  const membershipUrl = membershipUrlValue;
  const documentId = BigInt(documentIdValue);
  const type = typeValue;

  console.log(membershipId);
  console.log(membershipUrl);
  console.log(documentId);
  console.log(type);
  try {

    // Check if email or username already exist
    const existingMembership = await prisma.membership.findFirst({
      where: {
        id: membershipId
      },
    });

    if (existingMembership) {
      return NextResponse.json(
        { message: "membership with the same membershipId already exists" },
        { status: 500 }
      );
    }

    const membershipValue = await prisma.membership.create({
      data: {
        id: membershipId,
        membershipUrl: membershipUrl,
        documentId: documentId != null ? documentId : null,
        type: type
      },
      include: {
        document: true
      },
    });

    // Serialize with the custom replacer to convert BigInt to Number
    const serializedData = JSON.stringify(membershipValue, bigIntToString);

    // Parse the serialized data back to an object (optional step)
    const membership = JSON.parse(serializedData);

    return NextResponse.json({ message: 'membership uploaded:', membership }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { message: err.message },
      { status: 500 }
    );
  }
}
