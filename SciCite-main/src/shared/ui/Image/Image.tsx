import { FC, memo, useEffect, useState } from "react";

const importImage = (fileName: string) => {
  return import(`assets/img/${fileName}.png`);
};

export const Image: FC<{ name: string }> = memo(({ name }) => {
  const [img, setImg] = useState();

  useEffect(() => {
    const parseName = name?.split("/").join("");
    importImage(parseName)
      .then((image) => {
        setImg(image.default);
      })
      .catch((error) => {
        console.error("Failed to import image", error);
      });
  }, []);

  return <img src={img} alt={img} />;
});
