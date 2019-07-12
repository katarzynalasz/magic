import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "formatCards" })
export class CardsFormatterPipe implements PipeTransform {
  transform(value: any) {
    let CARDS = value.map(({ convertedManaCost, manaCost, name }) => ({
      convertedManaCost,
      manaCost,
      name
    }));

    return CARDS;
  }
}
