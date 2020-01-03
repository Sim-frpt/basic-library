let myLibrary  = JSON.parse( window.localStorage.getItem( 'library' ) ) || [];

// If there is data in local storage, I have to rebuild the object to preserve inheritance and get access to methods
if ( myLibrary.length !== 0 ) {
  myLibrary = myLibrary.map( object => {
    return new Book( object.title, object.author, object.pages,object.isRead );
  });
} else {
  myLibrary.push(
    new Book( "Bellamy", "Guy de Maupassant", 255, true),
    new Book( "Dune", "Frank Herbert", 321, false )
  );
}

const books          = document.getElementsByClassName( "books" )[0];
const form           = document.getElementsByClassName( "form__new-book" )[0];
const newBookButton  = document.getElementsByClassName( "button__new-book" )[0];
const formSection    = document.getElementsByClassName( "form__section" )[0];
const hideFormButton = document.getElementsByClassName( "button__hide-form")[0];

function Book( title, author, pages, isRead ) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.isRead = isRead;
}

Book.prototype.info = function() {
  const read = this.isRead ? "read" : "not read yet";
  return `${this.title} by ${this.author}, ${this.pages} pages, ${read}`
}

Book.prototype.toggle = function() {
  return this.isRead = ! this.isRead;
}

function addBookToLibrary( event ) {
  event.preventDefault();

  const formValues = event.target.elements;

  const book = new Book(
    formValues.title.value,
    formValues.author.value,
    formValues.pages.value,
    formValues["reading-status"].checked,
  );

  myLibrary.push( book );

  updateLocalStorage( myLibrary );

  resetForm( event.target );

  formSection.style.display = '';

  render( myLibrary );
}

function updateLocalStorage( array ) {

  window.localStorage.setItem( 'library', JSON.stringify( array ) );
}

function resetForm( form ) {
  const inputs = form.getElementsByTagName( "input" );

  for ( let input of inputs ) {
    switch( input.type ) {
      case "text":
        input.value = '';
        break;
      case "number":
        input.value = '';
        break;
      case "checkbox":
        input.checked = false;
        break;
    }
  }
}

function render( books ) {
  const container = document.getElementsByClassName( "books" )[0];
  container.innerHTML = '';

  books.forEach( ( book, index ) => {
    const card                = document.createElement( "div" );
    const title               = document.createElement( "h1" );
    const author              = document.createElement( "h2" );
    const details             = document.createElement( "ul" );
    const span                = document.createElement( "span" );
    const pages               = document.createElement( "li" );
    const readingStatus       = document.createElement( "li" );
    const removeButton        = document.createElement( "button" );
    const toggleReadingButton = document.createElement( "button" );
    const fragment            = document.createDocumentFragment();

    card.classList.add( "book__card" );
    title.classList.add( "book__title" );
    author.classList.add( "book__author" );
    details.classList.add( "book__details" );
    pages.classList.add( "book__pages" );
    readingStatus.classList.add( "book__reading-status" );
    removeButton.classList.add( "book__remove-button" );
    removeButton.setAttribute( "data-book-index", index );
    toggleReadingButton.classList.add( "book__toggle-button" );
    toggleReadingButton.setAttribute( "data-book-index", index );

    details.appendChild( pages );
    details.appendChild( readingStatus );

    title.textContent = book.title;
    author.textContent = book.author;
    pages.textContent = `${book.pages} pages`;
    readingStatus.textContent = book.isRead ? "Read" : "Unread";
    removeButton.textContent = "Remove";
    toggleReadingButton.textContent = "Toggle Read Status";

    fragment.append( title, author, details, removeButton, toggleReadingButton );
    card.append( fragment );

    container.append( card );
  } );
}

function handleClick( event ) {
  if ( event.target.className === "book__remove-button" ) {
    const bookIndex = event.target.dataset.bookIndex;

    myLibrary.splice( bookIndex, 1 );

    updateLocalStorage( myLibrary );

    render( myLibrary );

  } else if ( event.target.className === "book__toggle-button" ) {
    const bookIndex = event.target.dataset.bookIndex;
    const currentBook = myLibrary[bookIndex];

    currentBook.toggle();

    updateLocalStorage( myLibrary );

    render( myLibrary );
  }
}

function revealForm( event ) {
  if ( formSection.style.display === '' ) {
    formSection.style.display = "block";
  }
}

function hideForm( event ) {
  if ( formSection.style.display === "block" ) {
    formSection.style.display = '';
  }

  resetForm( document.getElementsByTagName( "form" )[0] );
}

form.addEventListener( "submit", addBookToLibrary );
books.addEventListener( "click", handleClick );
newBookButton.addEventListener( "click", revealForm );
hideFormButton.addEventListener( "click", hideForm );

render( myLibrary );
