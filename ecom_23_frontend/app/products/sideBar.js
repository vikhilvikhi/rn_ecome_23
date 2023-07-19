import React from "react";
import FilterSection from "@/app/products/filterSection";
import CONST from "@/utils/apis";

async function getBrands() {
  const res = await fetch(`${CONST.BASE_URL}/api/brand`, {
    cache: "no-store",
  });

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    console.log("error");
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

async function getCategories(brands) {
  let res;
  if (brands) {
    res = await fetch(
      `${CONST.BASE_URL}/api/category/getbybrand?brandId=${brands}`,
      {
        cache: "no-store",
      }
    );
  } else {
    res = await fetch(`${CONST.BASE_URL}/api/category`, {
      cache: "no-store",
    });
  }

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    console.log("error");
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

async function getTags(categories) {
  let res;
  if (categories) {
    res = await fetch(
      `${CONST.BASE_URL}/api/tag/getbystruct?category=${categories}`,
      {
        cache: "no-store",
      }
    );
  } else {
    res = await fetch(`${CONST.BASE_URL}/api/tag/getbystruct`, {
      cache: "no-store",
    });
  }

  if (!res.ok) {
    // This will activate the closest `error.js` Error Boundary
    console.log("error");
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function SideBar({ searchParams }) {
  // console.log("searchParams from side bar -->", searchParams);
  const { data } = await getBrands();
  const { data: categories } = await getCategories(searchParams.brand);

  const { data: tags } = await getTags(searchParams.catId);

  // console.log("tags-->", tags);

  return (
    <>
      <div className="bg-white border  p-2">
        <FilterSection title="Brands" items={data} type="brand" />
        <FilterSection title="Category" items={categories} type="catId" />
        <div>
          {tags?.map((tag, key) => (
            <div key={key}>
              <FilterSection title={tag._id} items={tag.value} type="tag" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}