import React from "react";
import Image from "next/image";
import ImageSlider from "./imageSlider";
import ProductDescription from "./description";
import CONST from "@/utils/apis";

const getData = async ({ productId }) => {
  let url = `${CONST.BASE_URL}/api/product/${productId}`;

  const res = await fetch(url, {
    cache: "no-store",
  });

  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  // Recommendation: handle errors
  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    console.log("error");
    throw new Error("Failed to fetch data");
  }

  return res.json();
};

export default async function SingleProduct({ params }) {
  // console.log(params.productId);
  const productId = params.productId;
  const { data } = await getData({ productId });

  console.log(data);
  return (
    <>
      <div className="bg-black w-full h-24"></div>
      <div className="">
        <div className=" max-w-7xl mx-5 md:mx-auto">
          <div className="flex flex-col md:flex-row gap-8 mb-8">
            <div className="w-full md:w-2/5">
              <ImageSlider images={data?.image} />
            </div>
            <div className="  w-full md:w-3/5 pt-5 md:pt-16">
              <h4 className="text-sm pb-4 text-blue-500">
                {data?.brandId?.brandName} | {data?.categoryId?.categoryName}
              </h4>
              <h2 className="text-3xl font-bold">{data?.title}</h2>
              <div
                className="product-short-description-wrap bg-gray-100 py-2 mt-4 px-4 max-h-96 overflow-auto rounded shadow-sm"
                dangerouslySetInnerHTML={{
                  __html: data?.shortDescription,
                }}
              ></div>
              <div className="">
                <Image
                  src={`${CONST.IMG_URL}/brands/${data?.brandId?.logo?.mdUrl}`}
                  alt=""
                  height={120}
                  width={120}
                />
              </div>
            </div>
          </div>
          <ProductDescription
            description={data.description}
            spec={data.specifications}
          />
        </div>
      </div>
    </>
  );
}
