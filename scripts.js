// Album class: Represents Album
class Album {
    constructor (title, artist, releaseDate, albumLink, referenceCode){
        this.title = title;
        this.artist = artist;
        this.releaseDate = releaseDate;
        this.referenceCode = referenceCode;
        this.albumLink = albumLink;
        
    }
}
//UI Class : handles UI Tasks
class UI {
    // Display Album
    static displayAlbum(){
        const albums = Store.getAlbums();

        albums.forEach((album => UI.addAlbumToList(album)));
        
    }
    // ADDS ALBUM TO TABLE
    static addAlbumToList(album) {
        const list = document.querySelector("#albumList");
        const row = document.createElement("tr");
        //CREATE AND ADD INFO TO TABLE ROW
        row.innerHTML = `
        <td><a href="#" class="btn-complete"><i class="far fa-check-circle"></i></a></td>
        <td>${album.title}</td>
        <td>${album.artist}</td>
        <td>${album.releaseDate}</td>
        <td>${album.referenceCode}</td>
        <td><a href="${album.albumLink}" target="_blank" class><i class="fas fa-music"></i></a></td>
        <td><a href="#" class= "btn btn-danger btn-sm delete">X</a></td>
        `;
        //add album class for search
        row.classList.add("album")
        list.appendChild(row);
    }
    // LISTEN TO DELETE BUTTON
    static deleteAlbum(el){
        if (el.classList.contains("delete")){
            el.parentElement.parentElement.remove();
        }
    }

    // LISTEN TO COMPLETE BUTTON
    /*static completeAlbum(el) {
        if (el.classList.contains("btn-complete")){
            el.parentElement.classList.add("bg-success");
        }
    }*/

    // ALERT FOR DANGER / SUCCESS

    static showAlert(message, className) {
        const div = document.createElement("div");
        div.className = `alert alert-${className}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector(".container");
        const form = document.querySelector("#albumForm");
        container.insertBefore(div, form);

        //  3 seconds timeout
        setTimeout(()=> document.querySelector(".alert").remove(), 3000)
    }

    // Clear Fields
    static clearFields() {
        document.querySelector("#title").value = "";
        document.querySelector("#artist").value = "";
        document.querySelector("#releaseDate").value = "";
    }
    
}

//Store Class: Handles Storage
class Store {

    // GETS ALBUMS FROM STORAGE
    static getAlbums() {
        let albums;
        if (localStorage.getItem("albums")=== null){
            albums = [];
        }else{
            albums = JSON.parse(localStorage.getItem("albums"));
        }
        return albums;
    }
    //ADDS ALBUMS TO STORAGE
    static addAlbum(album){
        const albums = Store.getAlbums();
        albums.push(album);
        localStorage.setItem("albums", JSON.stringify(albums))
    }
    // REMOVES ALBUM FROM STORAGE
    static removeAlbum(referenceCode){
        const albums = Store.getAlbums();
        albums.forEach((album, index)=> {
            if (album.referenceCode === referenceCode){
                album.pop();
            }
        });
        localStorage.setItem("albums",JSON.stringify(albums));
    }
}

// Event: Display Album
document.addEventListener("DOMContentLoaded", UI.displayAlbum);

// Event: Add Album
document.querySelector("#albumForm").addEventListener("submit", (e) => {
    e.preventDefault();
    // Get form values
    const title = document.querySelector("#title").value;
    const artist = document.querySelector("#artist").value;
    const releaseDate = document.querySelector("#releaseDate").value;
    const referenceCode = referenceCreator(6);
    // Create RANDOM reference code
    function referenceCreator(length){
        var result = "";
        var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        var charactersLength = characters.length;
        for (var i = 0; i < length; i++){
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    const albumLink = document.querySelector("#albumLink").value;

    //Validate 
    if (title === "" || artist === "" || releaseDate === ""){
        UI.showAlert("Please complete album information", "danger")
    }else{
        //Instatiate Album
        const album = new Album (title, artist, releaseDate, albumLink,referenceCode)
    

    // Add album to List
    UI.addAlbumToList(album);

    //Add album to Store
    
    Store.addAlbum(album);


    }

});

// Event: Delete Album
document.querySelector("#albumList").addEventListener("click", (e)=>{
    //Remove Album from UI
    UI.deleteAlbum(e.target);

    //Remove Album from Store
    Store.removeAlbum(e.target.parentElement.previousElementSibling.textContent);

    //Alert Success MSG/ DELETE SUCCESFULL
    UI.showAlert("Album removed", "success");

});
// Event: Album search
    //get search input element
let searchInput = document.getElementById("searchBar");
    //add event listener
searchInput.addEventListener("keyup", filterAlbums);

    function filterAlbums(){
        //get value of input
        let searchValue = searchInput.value.toUpperCase();
        // get albumsList table (tbody)
        let albumList = document.getElementById("albumList");
        // get album elements from table (tr)
        let albumElement = albumList.querySelectorAll("tr.album");
        //loop through albumElements (tr´s)
        for (i = 0; i < albumElement.length; i++){
            let a = albumElement[i].getElementsByTagName("td")[0];
            
            //If matched
            if(a.innerHTML.toUpperCase().indexOf(searchValue) > -1 ){
                albumElement[i].style.display = "";

            }else {
                albumElement[i].style.display = "none";
            }
        }
    }



// Event: Complete album
/*
document.querySelector("#albumList").addEventListener("click", (e)=>{
    UI.completeAlbum(e.target)
});*/