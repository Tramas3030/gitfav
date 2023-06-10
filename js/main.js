import { Favoritesview } from "./favorites.js";

class App {
  constructor() {
    this.favoritesView = new Favoritesview("#app");
    this.inputSearch = document.querySelector("#input-search");
  }

  async addUserToTable(username) {
    if (!username) {
      return;
    }

    await this.favoritesView.add(username);
    this.inputSearch.value = "";
  }
}

new App();