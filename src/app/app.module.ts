import { CardsFormatterPipe } from "./_pipes/cards-formatter.pipe";
import { ManaCostPipe } from "./_pipes/manaCost.pipe";
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AppComponent } from "./app.component";

@NgModule({
  declarations: [AppComponent, ManaCostPipe, CardsFormatterPipe],
  imports: [BrowserModule, FormsModule],
  providers: [ManaCostPipe, CardsFormatterPipe],
  bootstrap: [AppComponent]
})
export class AppModule {}
