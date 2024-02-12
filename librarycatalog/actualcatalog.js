class Book{
    constructor(title,author,isbn,genre){
        this.title=title;
        this.author=author;
        this.isbn=isbn;
        this.genre=genre;
        this.availability = true;
        this.count=3;
        this.acount=3;
        console.log("in book constructor");
    }
}

class LibraryCatalog{
    constructor(){
        this.books=JSON.parse(localStorage.getItem('bookcatalog')) || [];
        console.log("catalog constructer");
    }
    createbook(title,author,isbn,genre){
        let newbook=new Book(title,author,isbn,genre);
        this.addBook(newbook);
    }
    addBook(book) {
        this.books.push(book);
        this.addtostorage();
        this.display();
        console.log("add book working");
    }
    removeBook(isbn) {
        this.books = this.books.filter(book => book.isbn !== isbn);
        this.addtostorage();
        this.display();
    }
    addtostorage(){
        localStorage.setItem('bookcatalog', JSON.stringify(this.books));
        console.log("suceesfully stored");
    }
    display() {
        const container = document.getElementById('display');
        container.innerHTML = '';
        this.books.forEach(book => {
            const Item = document.createElement('div');
            Item.classList.add('items');
            Item.innerHTML = `
                <p><strong>Title:</strong> ${book.title}</p>
                <p><strong>Author:</strong> ${book.author}</p>
                <p><strong>ISBN:</strong> ${book.isbn}</p>
                <p><strong>Genre:</strong> ${book.genre}</p>
                <p><strong>Availability:</strong> ${book.availability ? 'Available' : 'Not Available'}</p>
                <p><strong>Total QTY:</strong> ${book.count}</p>
                <p><strong>QTY AVBL:</strong> ${book.acount}</p>
                <button onclick="checkoutBook('${book.isbn}')">Checkout</button>
                <button onclick="returnBook('${book.isbn}')">Return</button>
                <button onclick="removeBook('${book.isbn}')">Remove</button>
            `;
            container.appendChild(Item);
        });
    }
    checkoutBook(isbn){
        console.log(this.books);
        const check = this.books.find(book => book.isbn === isbn);
        if (check) {
            if(check.availability==false ){
                alert("All are checked out");
            }
            else{
            console.log(check.availability);
            if(check.acount>0){
                check.acount=check.acount-1;
            }
            if(check.acount===0){
            check.availability = false;
            }
            this.addtostorage();
            this.display();
            alert(`Book ${check.title} has been checked out.`);
            console.log(check.availability);
            console.log(check.title);
            console.log(check.author);
            console.log(check.genre);
            }
        } else {
            alert('Books stock is out.');
        }
    }
    returnBook(isbn){
        const check = this.books.find(book => book.isbn === isbn);
        if (check) {
            if(check.acount==check.count){
                alert("All are in stock,No books are checked out");
            }
            else{
            check.availability = true;
            check.acount=check.acount+1;
            this.addtostorage();
            this.display();
            alert(`Book "${check.title}" has been returned.`);
            }
        } else {
            alert('Book not found.');
        }

    }
    searchbook(key,cat){
        let keyx=key.toLowerCase();
        console.log(keyx,cat);
        if(cat=="all"){
        console.log(this.books);
        const filteredBooks = this.books.filter(book =>
            book.title.toLowerCase().includes(keyx) ||
            book.author.toLowerCase().includes(keyx) ||
            book.genre.toLowerCase().includes(keyx)
        );
        console.log(filteredBooks);
        this.displaysearch(filteredBooks);
        }
        else{
        const filteredBooks = this.books.filter(book =>
                ((book.title.toLowerCase().includes(keyx))&&(cat=="title"))||
                ((book.author.toLowerCase().includes(keyx))&& (cat=="author")) ||
                ((book.genre.toLowerCase().includes(keyx)) && cat=="genre")
            );
        console.log(filteredBooks);
        this.displaysearch(filteredBooks);
        }
        
    }
    checkbookexist(isbn){
        const existbook=this.books.find(book=>
            book.isbn==isbn);
        return existbook;
    }
    increasecount(isbn){
        let bk=this.books.find(book=>
            book.isbn==isbn);
        bk.count=1+bk.count;
        bk.acount=1+bk.acount;
        return bk.count;
    }
    displaysearch(filteredBooks){
        const container = document.getElementById('display');
        container.innerHTML = '';
        console.log("i am in search display");
        if(filteredBooks.length!=0){
        filteredBooks.forEach(book => {
            const Item = document.createElement('div');
            Item.classList.add('items');
            Item.innerHTML = `
                <p><strong>Title:</strong> ${book.title}</p>
                <p><strong>Author:</strong> ${book.author}</p>
                <p><strong>ISBN:</strong> ${book.isbn}</p>
                <p><strong>Genre:</strong> ${book.genre}</p>
                <p><strong>Availability:</strong> ${book.availability ? 'Available' : 'Not Available'}</p>
                <p><strong>Total QTY:</strong> ${book.count}</p>
                <p><strong>QTY AVBL:</strong> ${book.acount}</p>
                <button onclick="checkoutBook('${book.isbn}')">Checkout</button>
                <button onclick="returnBook('${book.isbn}')">Return</button>
                <button onclick="removeBook('${book.isbn}')">Remove</button>  
            `;
            container.appendChild(Item);
            });
        }
        else{
            const Item = document.createElement('div');
            Item.classList.add('items');
            Item.innerHTML =`<p>NOTHING FOUND</p>`;
            container.appendChild(Item);
        }
    }
}

function removeBook(isbn){
    libraryobj.removeBook(isbn);
}
function checkoutBook(isbn){
    libraryobj.checkoutBook(isbn);
}
function returnBook(isbn){
    libraryobj.returnBook(isbn);
}

document.getElementById('frm1').addEventListener('submit',function(e){
    e.preventDefault();
    const title = document.getElementById('title').value;
    const author = document.getElementById('author').value;
    const isbn = document.getElementById('isbn').value;
    const genre = document.getElementById('genre').value;
    console.log("inside event listner");
    let check=libraryobj.checkbookexist(isbn);
    if(check){
        if(check.title!=title || check.author!=author || check.genre!=genre){
        alert("Book already exists,But info not matching");
        }
        else{
            let c=libraryobj.increasecount(isbn);
            libraryobj.addtostorage();
            libraryobj.display();
            alert("Matching with existing book,Stock incresed,Total Book stock: "+c);
        }
    }else{

        libraryobj.createbook(title,author,isbn,genre);
    }
    frm1.reset();
})
document.getElementById('search').addEventListener('input', function(e) {
    let x=document.getElementById('search').value;
    let y=document.getElementById('searchcategory').value;
    if(x===""){
        libraryobj.display();
    }
    console.log(x);
    libraryobj.searchbook(x,y);
});
document.getElementById('searchcategory').addEventListener('change', function(e) {
    let x=document.getElementById('search').value;
    let y=document.getElementById('searchcategory').value;
    if(x===""){
        libraryobj.display();
    }
    console.log(x);
    libraryobj.searchbook(x,y);
});
document.getElementById('searchbtn').addEventListener('click', function(e) {
    let x=document.getElementById('search').value;
    let y=document.getElementById('searchcategory').value;
    if(x===""){
        libraryobj.display();
    }
    console.log(x);
    libraryobj.searchbook(x,y);
});
const libraryobj=new LibraryCatalog();
libraryobj.display();