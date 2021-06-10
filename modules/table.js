// The table is divided in sections, each section is a row containing some boxes


// this function draws the row and adds them to the table
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


//these functions draw the horizontal and vertical boxes
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


// this function adds the boxes to each single row
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


// this is the function that, by calling the previous ones, creates the table
export function draw_table(table, tableWidth, tableHeight, numRows, rowHeight, numBoxes, width, height) {
  table.style.width = tableWidth+"px";
  table.style.height = tableHeight+"px";
  add_rows(table, numRows, rowHeight);
  add_boxes(numRows, numBoxes, width, height)
}
