import { GithubUser } from "./githubUser.js";

export class Favorites {
    constructor(root) {
        this.root = document.querySelector(root);
        this.load();
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || [];
    }

    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries));
    }

    async add(username) {
        try {
            const userExists = this.entries.find(entry => entry.login === username);

            if(userExists) {
                throw new Error('Usuário já cadastrado');
            }

            const user = await GithubUser.search(username); 

            if(user.login === undefined) {
                throw new Error('Usuário não encontrado!');
            }

            this.entries = [user, ...this.entries];
            this.update();
            this.save();
        }
        catch (error) {
            alert(error.message);
        }
    }

    delete(user) {
        const filteredEntries = this.entries.filter(entry => entry.login !== user.login);
        this.entries = filteredEntries;

        this.update();
        this.save();
    }
}

export class Favoritesview extends Favorites {
    constructor(root) {
        super(root);

        this.tbody = this.root.querySelector('table tbody');

        this.update();
        this.onadd();
    }

    onadd() {
        const addButton = this.root.querySelector('.search button.favorite');

        window.document.onkeyup = event => {
            if(event.key === "Enter") {
                const { value } = this.root.querySelector('.search input');
                this.add(value);
            }
        }

        addButton.onclick = () => {
            const { value } = this.root.querySelector('.search input');

            this.add(value);
        }
    }

    update() {
        this.removeAllTr();
        
        if(this.entries.length !== 0) {
            this.entries.forEach( user => {
                const row = this.createRow();
    
                row.querySelector('.user img').src = `https://github.com/${user.login}.png`;
                row.querySelector('.user img').alt = `Imagem de ${user.name}`;
                row.querySelector('.user p').textContent = user.name;
                row.querySelector('.user a').href = `htpps://github.com/${user.login}`;
                row.querySelector('.user span').textContent = user.login;
                row.querySelector('.repositories').textContent = user.public_repos;
                row.querySelector('.followers').textContent = user.followers;
    
                row.querySelector('.remove').onclick = () => {
                    const isOk = confirm('Tem certeza que deseja deletar esse usuário?');
    
                    if(isOk) {
                        this.delete(user);
                    }
                }
    
                this.tbody.append(row);
            });
        }
        else {
            const emptyRow = this.createEmptyRow();
            this.tbody.append(emptyRow);
        }
    }

    createRow() {
        const tr = document.createElement('tr');

        tr.innerHTML = `

            <td class="user">
                <img src="https://github.com/Tramas3030.png" alt="Imagem de Tramas3030">
                <a href="https://github.com/Tramas3030" target="_blank">
                    <p>Tramas3030</p>
                    <span>/Tramas3030</span>
                </a>
            </td>
            <td class="repositories">15</td>
            <td class="followers">2</td>
            <td>
                <button class="remove">Remove</button>
            </td>
        `

        return tr;
    }

    createEmptyRow() {
        const emptyTr = document.createElement('tr');

        emptyTr.innerHTML = `
            <td class="empty">
                <img src="images/Estrela.svg" alt="Ícone de estrela">
                <p>Nenhum favorito ainda</p>
            </td>
            <td></td>
            <td></td>
            <td></td>
        `

        return emptyTr;
    }

    removeAllTr() {
        this.tbody.querySelectorAll('tr').forEach((tr) => {
            tr.remove();
        });
    }
}