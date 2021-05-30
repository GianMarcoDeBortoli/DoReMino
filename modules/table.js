//---------------------------------------- CREATION of TABLE -----------------------------------------------------------
//prende in argomento la const table, il numero di rows e l'altezza di una row.
//crea le rows, le disegna, aggiunge gli attributi per il flex del contenuto e le appendChilda al table.
function add_rows(table, num, height) {
  for (let i = 0; i < num; i++) {
      let row = document.createElement("div");
      row.classList.add("row");
      row.id = "row"+i;
      row.style.height = height+"px";
      if (i%2 == 0) {
          row.style.flexFlow = "row wrap";
      } else {
          row.style.flexFlow = "row-reverse wrap";
      }
      table.appendChild(row);
  }
}

//due funzioni ausiliarie chiamate poi dalla add_boxes che disegnano i singoli box e danno gli attributi per il flex di contenuto
function horiz_box(box, dim1, dim2) {
  box.classList.add("box");
  box.style.width = dim2+"px";
  box.style.height = dim1+"px";
}

function vert_box(box, dim1, dim2) {
  box.classList.add("box");
  box.style.width = dim1+"px";
  box.style.height = dim2+"px";

}

//prende in argomento il numero di rows, il numero di boxes per ogni row e le dimensioni di un box
//prende una row alla volta per id, crea l'elemento box, chiama per i primi numBox-1 la horiz_box e per l'ultimo
//di ogni riga la vert_box per disegnarli. Infine assegna il box alla row.
function add_boxes(numRows, numBoxes, width, height) {
  let cntbox = 0;

  for (let i = 0; i < numRows; i++) {

      let row = document.getElementById("row"+i);

      for (let j = 0; j < numBoxes-1; j++) {
          let box = document.createElement("div");
          horiz_box(box, width, height);
          box.textContent = cntbox;
          box.id = cntbox;
          cntbox++;
          row.appendChild(box);
      }

      let box = document.createElement("div");
      vert_box(box, width, height);
      box.textContent = cntbox;
      box.id = cntbox;
      cntbox++;
      row.appendChild(box);
  }
}


export function draw_table(table, tableWidth, tableHeight, numRows, rowHeight, numBoxes, width, height) {
  table.style.width = tableWidth+"px";
  table.style.height = tableHeight+"px";
  add_rows(table, numRows, rowHeight);
  add_boxes(numRows, numBoxes, width, height)
}
