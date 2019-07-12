import { ManaCostPipe } from "./_pipes/manaCost.pipe";
import { CardsFormatterPipe } from "./_pipes/cards-formatter.pipe";
import { Component, OnInit } from "@angular/core";
import { DATA } from "./WAR";
import { Card } from "./_models/card.model";
import { Mana } from "./_models/Mana.model";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  title = "app";
  searchValue: string;
  ALL_MANA = "A";
  COLORLESS_MANA = "C";
  CARDS: Card[];

  constructor(
    private cardsPipe: CardsFormatterPipe,
    private manaPipe: ManaCostPipe
  ) {}

  ngOnInit(): void {
    let formattedCards = this.cardsPipe.transform(DATA.cards);
    this.CARDS = this.manaPipe.transform(formattedCards, false);
  }

  countUserMana(userMana: Mana[]): number {
    var total = 0;
    userMana.forEach(many => {
      total = total + many.amount;
    });
    return total;
  }

  transformUserInput(value: string): Mana[] {
    return this.manaPipe.transform(value, true);
  }

  filterCardsByCost(userTotalMana: number): Card[] {
    let filteredCards = [];
    for (let card of this.CARDS) {
      if (card.convertedManaCost <= userTotalMana && card.manaCost) {
        filteredCards.push(card);
      }
    }
    return filteredCards;
  }

  search() {
    let userMana = this.transformUserInput(this.searchValue);
    let userTotalMana = this.countUserMana(userMana);
    let filteredCards = this.filterCardsByCost(userTotalMana);
    const copyFilteredCards = JSON.parse(JSON.stringify(filteredCards));
    for (let card of copyFilteredCards) {
      userMana.forEach(userMana => {
        for (let i = 0; i < card.manaCost.length; i++) {
          //switch
          let mana = card.manaCost[i];

          if (
            userMana.color === mana.color ||
            (mana.color === this.ALL_MANA &&
              userMana.color === this.COLORLESS_MANA)
          ) {
            if (mana.amount < userMana.amount) {
              card.manaCost[i].amount = 0;
            } else {
              card.manaCost[i].amount = mana.amount - userMana.amount;
            }
          }
        }
      });
    }

    console.log(filteredCards);
    console.log(copyFilteredCards);

    // const CARDS_FILTERED_ONES = JSON.parse(JSON.stringify(filteredCards));
    // for (let card of CARDS_FILTERED_ONES) {
    //   userMany.forEach(userMana => {
    //     for (let i = 0; i < card.manaCost.length; i++) {
    //       let mana = card.manaCost[i];
    //       if (
    //         (userMana.color === this.ALL_MANA &&
    //           SIMPLE_MANA.includes(mana.color)) ||
    //         (mana.color === this.ALL_MANA &&
    //           SIMPLE_MANA.includes(userMana.color))
    //       ) {
    //         if (mana.amount < userMana.amount) {
    //           card.manaCost[i].amount = -1;
    //         } else {
    //           card.manaCost[i].amount = mana.amount - userMana.amount;
    //         }
    //       }
    //     }
    //   });
    // }
    // console.log(filteredCards);
    // console.log(CARDS_FILTERED_ONES);
  }
}
