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
  userTotalMana: number;

  ALL_MANA = "A";
  COLORLESS_MANA = "C";

  CARDS: Card[];
  userMana: Mana[];

  constructor(
    private cardsPipe: CardsFormatterPipe,
    private manaPipe: ManaCostPipe
  ) {}

  ngOnInit(): void {
    let formattedCards = this.cardsPipe.transform(DATA.cards);
    this.CARDS = this.manaPipe.transform(formattedCards, false);
  }

  transformUserInput(value: string): Mana[] {
    return this.manaPipe.transform(value, true);
  }

  search() {
    this.userMana = this.transformUserInput(this.searchValue);
    this.userTotalMana = this.countUserTotalMana();
    let CARDS = JSON.parse(JSON.stringify(this.CARDS));
    for (let card of CARDS) {
      this.checkIfCardFits(card);
      console.log(card);
      console.log(this.checkIfCardFits(card));
    }
  }

  countUserTotalMana() {
    var total = 0;
    this.userMana.forEach(many => {
      total = total + many.amount;
    });
    return total;
  }

  modifyUserandCardMana(cardMana, userMana) {
    if (cardMana.amount < userMana.amount) {
      userMana.amount = userMana.amount - cardMana.amount;
      cardMana.amount = 0;
    } else {
      cardMana.amount = cardMana.amount - userMana.amount;
      userMana.amount = 0;
    }
  }

  checkIfCardFits(card: Card): boolean {
    let userMana = <Mana[]>JSON.parse(JSON.stringify(this.userMana));

    if (card.convertedManaCost === 0) {
      return true;
    }

    if (card.convertedManaCost > this.userTotalMana || !card.manaCost) {
      return false;
    }

    for (let i = 0; i < card.manaCost.length; i++) {
      let cardMana = card.manaCost[i];

      userMana.forEach(userMana => {
        if (
          userMana.color === cardMana.color ||
          (cardMana.color === this.ALL_MANA &&
            userMana.color === this.COLORLESS_MANA)
        ) {
          this.modifyUserandCardMana(cardMana, userMana);
        }
      });
    }

    if (Object.values(card.manaCost).every(x => x.amount === 0)) {
      return true;
    }

    // return "ad";
  }
}
