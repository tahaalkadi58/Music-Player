export class NavigationClass {
  static #lastId = -1;
  id: number;
  text: string;
  icon: string;

  constructor(text: string, icon: string) {
    this.text = text;
    this.icon = icon;
    this.id = ++NavigationClass.#lastId;
  }
}

export const navigationData = [
  new NavigationClass("home", "house"),
  new NavigationClass("profile", "user"),
  new NavigationClass("notification", "bell"),
  new NavigationClass("search", "search"),
  new NavigationClass("setting", "cog"),
];
