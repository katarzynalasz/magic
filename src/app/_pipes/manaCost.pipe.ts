import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "manaCost" })
export class ManaCostPipe implements PipeTransform {
  transform(value: any, isUserMana: boolean) {
    return this.formatManaCost(value, isUserMana);
  }

  formatManaCost(arrayOfCards, isUserMana) {
    if (isUserMana) {
      const arrayOfColorsWithoutEmptySorted = this.transformToArrayOfColors(
        arrayOfCards
      ).sort();
      return this.countManyFrequency(arrayOfColorsWithoutEmptySorted);
    }
    if (!isUserMana) {
      const CARDS = arrayOfCards.map(a => Object.assign({}, a));
      CARDS.forEach(card => {
        if (card.manaCost) {
          const arrayOfColorsWithoutEmptySorted = this.transformToArrayOfColors(
            card.manaCost
          ).sort();
          const transformedManaCost = this.countManyFrequency(
            arrayOfColorsWithoutEmptySorted
          );
          card.manaCost = transformedManaCost;
        }
      });
      return CARDS;
    }
  }

  transformToArrayOfColors(input) {
    const arrayOfColors = input
      .split("{")
      .join(",")
      .split("}")
      .join(",")
      .split(",");

    return arrayOfColors.filter(Boolean);
  }

  countManyFrequency(array) {
    let userMany = [];
    let currentColor, obj;
    for (let i = 0; i < array.length; i++) {
      let color = array[i];
      if (!isNaN(color)) {
        obj = {};
        obj.color = "A";
        obj.amount = Number(color);
        userMany.push(obj);
      } else {
        if (color !== currentColor) {
          obj = {};
          currentColor = color;
          obj.color = currentColor;
          obj.amount = 1;
          userMany.push(obj);
        } else {
          obj.amount += 1;
        }
      }
    }

    return userMany;
  }
}
