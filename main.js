// noinspection ES6ConvertVarToLetConst,HtmlRequiredAltAttribute

var allNum, rows, cols, mineNum, clickID, rowClickedOn, colClickedOn, boardSize, clickCounter = 0;

function BuildBoard() {
	var idInTable = 0, boardText = "";
	rows = prompt("Enter the number of Rows (please don't enter a number over 100 or lower than 4):");
	cols = prompt("Enter the number of columns (please don't enter a number over 100 or lower than 4):");
	if (screen.width > screen.height)
		boardSize = Math.floor(screen.width / rows / 3);
	else
		boardSize = Math.floor(screen.height / cols / 3);
	//creates the array
	allNum = new Array(rows);
	for (var x = 0; x < rows; x++) {
		allNum[x] = new Array(cols);
		for (var y = 0; y < cols; y++)
			allNum[x][y] = 0;
	}
	//creates the table
	for (var x = 0; x < rows; x++) {
		boardText = boardText + " <tr>";
		for (var y = 0; y < cols; y++) {
			boardText = boardText + "<td id='" + idInTable + "' onclick='tdPress(this);' class='canBeClickedOn'> <img src='Images/unclicked.png' width='" + boardSize + "' height='" + boardSize + "' /> </td>";
			idInTable++;
		}
		boardText = boardText + " </tr>";
	}
	document.getElementById("board").innerHTML = boardText;
	document.getElementById("board").border = "1";
	//add right click listener
	idInTable = 0;
	for (var x = 0; x < rows; x++) {
		for (var y = 0; y < cols; y++) {
			document.getElementById(idInTable).addEventListener('contextmenu', function (e) {
				e.preventDefault();
				clickID = parseInt(this.id);
				rowClickedOn = Math.floor(clickID / rows);
				colClickedOn = clickID % rows;
				if (allNum[rowClickedOn][colClickedOn] >= 29) {
					allNum[rowClickedOn][colClickedOn] -= 29; //cause flag in geometry
					this.innerHTML = "<img src='Images/unclicked.png' width='" + boardSize + "' height=' " + boardSize + "'/>";
					if (allNum[rowClickedOn][colClickedOn] === 9)
						mineNum++;
				}
				else if (allNum[rowClickedOn][colClickedOn] <= 9) {
					//var imageCheck = document.getElementById(clickID).innerHTML;
					//if (imageCheck == ' <img src="unclicked.png" width="51" height="51"> ') {
						allNum[rowClickedOn][colClickedOn] += 29; //cause flag in geometry
						this.innerHTML = "<img src='Images/flag.png' width='" + boardSize + "' height=' " + boardSize + "'/>";
						if (allNum[rowClickedOn][colClickedOn] === 38) //29 + 9
							mineNum--;
					//}
				}
				if (mineNum === 0) {
					alert("You Won!");
					document.getElementById("Images\win").src = "win.jpg";
					document.getElementById("Images\win").width = "900";
					document.getElementById("Images\win").height = "500";
				}
				return false;
			}, false);
			idInTable++;
		}
	}
}

function tdPress(currentThis) {
	clickID = parseInt(currentThis.id);
	rowClickedOn = Math.floor(clickID / rows);
	colClickedOn = clickID % rows;

	if (clickCounter === 0) {
		mineNum = Math.floor(rows * cols * 0.15);  //number of mines
		var tempNumMine = mineNum;
		while (tempNumMine > 0) {
			var mineRow = Math.floor(Math.random() * allNum[0].length); //equals to rows - 1
			var mineCol = Math.floor(Math.random() * allNum[1].length); //equals to cols - 1
			if (allNum[mineRow][mineCol] === 0 && mineRow !== rowClickedOn && mineCol !== colClickedOn) {
				allNum[mineRow][mineCol] = 9;
				if (mineRow + 1 < allNum[0].length)
					allNum[mineRow + 1][mineCol] = allNum[mineRow + 1][mineCol] + 1;
				if (mineRow > 0)
					allNum[mineRow - 1][mineCol] = allNum[mineRow - 1][mineCol] + 1;
				if (mineCol + 1 < allNum[1].length)
					allNum[mineRow][mineCol + 1] = allNum[mineRow][mineCol + 1] + 1;
				if (mineCol > 0)
					allNum[mineRow][mineCol - 1] = allNum[mineRow][mineCol - 1] + 1;
				if (mineRow > 0 && mineCol + 1 < allNum[1].length)
					allNum[mineRow - 1][mineCol + 1] = allNum[mineRow - 1][mineCol + 1] + 1;
				if (mineRow + 1 < allNum[0].length && mineCol + 1 < allNum[1].length)
					allNum[mineRow + 1][mineCol + 1] = allNum[mineRow + 1][mineCol + 1] + 1;
				if (mineRow + 1 < allNum[0].length && mineCol > 0)
					allNum[mineRow + 1][mineCol - 1] = allNum[mineRow + 1][mineCol - 1] + 1;
				if (mineRow > 0 && mineCol > 0)
					allNum[mineRow - 1][mineCol - 1] = allNum[mineRow - 1][mineCol - 1] + 1;
				tempNumMine--;
			}
		}
		clickCounter++;
	}

	if (allNum[rowClickedOn][colClickedOn] === 9) {
		for (var x = 0; x < rows; x++) {
			for (var y = 0; y < cols; y++) {
				if (allNum[x][y] === 9) {
					clickID = x * rows + y;
					document.getElementById(clickID).innerHTML = "<img src='Images/mine.png' width='" + boardSize + "' height=' " + boardSize + "'/>";
				}
			}
		}
		currentThis.innerHTML = "<img src='Images/openedmine.png' width='" + boardSize + "' height=' " + boardSize + "'/>";
		alert("You Lost!");
		document.getElementById("loseImage").src = "lose.jpg";
		document.getElementById("loseImage").width = "900";
		document.getElementById("loseImage").height = "500";
	}
	else
		CheckForZeros(rowClickedOn, colClickedOn);
}

function CheckForZeros(row, col) {
	SwitchTheBoard(row, col);
	//if (allNum[row][col] < 10)
	//	allNum[row][col] += 10;
	if (allNum[row][col] === 0) {
		allNum[row][col] += 10;
		if (row + 1 < allNum[0].length) {
			CheckForZeros(row + 1, col);
		}
		if (row > 0) {
			CheckForZeros(row - 1, col);
		}
		if (col + 1 < allNum[1].length) {
			CheckForZeros(row, col + 1);
		}
		if (col > 0) {
			CheckForZeros(row, col - 1);
		}
		if (row > 0 && col + 1 < allNum[1].length) {
			CheckForZeros(row - 1, col + 1);
		}
		if (row + 1 < allNum[0].length && col + 1 < allNum[1].length) {
			CheckForZeros(row + 1, col + 1);
		}
		if (row + 1 < allNum[0].length && col > 0) {
			CheckForZeros(row + 1, col - 1);
		}
		if (row > 0 && col > 0) {
			CheckForZeros(row - 1, col - 1);
		}
	}
}

function SwitchTheBoard(row, col) {
	clickID = row * rows + col;
	switch (allNum[row][col]) {
		case 1 || 11:
			document.getElementById(clickID).innerHTML = "<img src='Images/t1.png' width='" + boardSize + "' height=' " + boardSize + "'/>";
			break;
		case 2 || 12:
			document.getElementById(clickID).innerHTML = "<img src='Images/t2.png' width='" + boardSize + "' height=' " + boardSize + "'/>";
			break;
		case 3 || 13:
			document.getElementById(clickID).innerHTML = "<img src='Images/t3.png' width='" + boardSize + "' height=' " + boardSize + "'/>";
			break;
		case 4 || 14:
			document.getElementById(clickID).innerHTML = "<img src='Images/t4.png' width='" + boardSize + "' height=' " + boardSize + "'/>";
			break;
		case 5 || 15:
			document.getElementById(clickID).innerHTML = "<img src='Images/t5.png' width='" + boardSize + "' height=' " + boardSize + "'/>";
			break;
		case 6 || 16:
			document.getElementById(clickID).innerHTML = "<img src='Images/t6.png' width='" + boardSize + "' height=' " + boardSize + "'/>"
			break;
		case 7 || 17:
			document.getElementById(clickID).innerHTML = "<img src='Images/t7.png' width='" + boardSize + "' height=' " + boardSize + "'/>";
			break;
		case 8 || 18:
			document.getElementById(clickID).innerHTML = "<img src='Images/t8.png' width='" + boardSize + "' height=' " + boardSize + "'/>";
			break;
		default:
			document.getElementById(clickID).innerHTML = "<img src='Images/t0.png' width='" + boardSize + "' height=' " + boardSize + "'/>";
	}
	if (allNum[row][col] > 29)
		document.getElementById(clickID).innerHTML = "<img src='Images/flag.png' width='" + boardSize + "' height=' " + boardSize + "'/>";
}

function EndOfGame() {
	document.getElementById("winImage").src = "white.jpg";
	document.getElementById("loseImage").src = "white.jpg";
	document.getElementById("winImage").width = "1";
	document.getElementById("winImage").height = "1";
	document.getElementById("loseImage").width = "1";
	document.getElementById("loseImage").height = "1";
	BuildBoard();
	clickCounter = 0;
}
