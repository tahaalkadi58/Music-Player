class CardsClass {
  static #lastId = -1;
  id: number;
  text: string;
  icon: string;
  href: string;

  constructor(text: string, icon: string, href: string) {
    this.text = text;
    this.icon = icon;
    this.href = href;
    this.id = ++CardsClass.#lastId;
  }
}

export const cardsData = [
  new CardsClass("Favourites", "heart", "/favorites"),
  new CardsClass("History", "history", "/history"),
  new CardsClass("Tools", "tools", "/"),
];
