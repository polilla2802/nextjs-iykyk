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