import { useEffect } from "react";
import { Advert } from "types/generated";

export const useCart = () => {
  useEffect(() => {
    if (!localStorage.getItem("cart")) {
      localStorage.setItem("cart", JSON.stringify([]));
    }
  }, []);

  const getCart = () => {
    return JSON.parse(localStorage.getItem("cart") || "[]");
  };

  const saveCart = (cart: Advert[]) => {
    localStorage.setItem("cart", JSON.stringify(cart));
  };

  const addItem = (advert: Advert, volume: number) => {
    const currCart = getCart();

    const updatedAdvert = { ...advert };

    if (updatedAdvert.qualitiesOfAdvert && updatedAdvert.qualitiesOfAdvert.length > 0) {
        updatedAdvert.qualitiesOfAdvert[0] = {
            ...updatedAdvert.qualitiesOfAdvert[0],
            volume: volume
        };
    }

    for (let i = 0; i < currCart.length; i++) {
      if (currCart[i].id === updatedAdvert.id) {
        currCart[i] = updatedAdvert;
        saveCart(currCart);
        return;
      }
    }

    currCart.push(updatedAdvert);
    saveCart(currCart);
  };

  const getVolume = (advertId: string) => {
    const adverts = getCart();
    const advert: Advert = adverts.find((ad: Advert) => ad.id === advertId);
    return advert ? String(advert.qualitiesOfAdvert[0].volume) : null;
  };

  const removeItem = (advert: string) => {
    const currCart = getCart();
    const newCart = currCart.filter((item: Advert) => item.id !== advert);
    saveCart(newCart);
  };

  return {
    cart: getCart(), 
    addItem,
    removeItem,
    getVolume
  };
};
