import { colors, ctx, maze } from './main'

export class Maze {
	cellSize: number
	strokeWidth: number
	rows: number
	columns: number
	done: boolean
	current: Cell
	grid: Cell[][]
	stack: Cell[]

	constructor(
		cellSize: number,
		strokeWidth: number,
		rows: number,
		columns: number
	) {
		this.cellSize = cellSize
		this.strokeWidth = strokeWidth
		this.rows = rows
		this.columns = columns
		this.done = false
		this.current = new Cell(0, 0, [], 0, 0)
		this.grid = []
		this.stack = []
	}

	setup() {
		for (let r = 0; r < this.rows; r++) {
			let row = []
			for (let c = 0; c < this.columns; c++) {
				const cell = new Cell(r, c, this.grid, this.cellSize, this.strokeWidth)
				row.push(cell)
			}
			this.grid.push(row)
		}
		maze.width = this.cellSize * this.columns + this.strokeWidth
		maze.height = this.cellSize * this.rows + this.strokeWidth
		maze.style.background = colors.bg

		const y = Math.floor(Math.random() * this.rows)
		const x = Math.floor(Math.random() * this.columns)

		this.current = this.grid[y][x]
		this.updateGrid()
	}

	updateGrid() {
		for (let r = 0; r < this.rows; r++) {
			for (let c = 0; c < this.columns; c++) {
				let grid = this.grid
				if (grid[r][c].revisited) {
					grid[r][c].highlight(colors.revisited)
				} else if (grid[r][c].visited && grid[r][c] !== this.current) {
					grid[r][c].highlight(colors.visited)
				}
				grid[r][c].show()
			}
		}
	}

	highlightNeighbours(neighbours: Cell[]) {
		neighbours.forEach((neighbour) => {
			neighbour.highlight(colors.neighbour)
		})
	}

	draw() {
		maze.width = this.cellSize * this.columns + this.strokeWidth
		maze.height = this.cellSize * this.rows + this.strokeWidth
		maze.style.background = colors.bg

		this.current.highlight(colors.current)
		this.current.visited = true

		let neighbours = this.current.checkNeighbours()
		this.highlightNeighbours(neighbours)
		this.updateGrid()

		if (neighbours.length > 0) {
			let random = Math.floor(Math.random() * neighbours.length)
			let next = neighbours[random]

			this.current.removeWalls(this.current, next)

			this.stack.push(this.current)

			this.current = next
		} else if (this.stack.length > 0) {
			this.current.revisited = true
			let cell = this.stack.pop()!
			this.current = cell
		} else {
			this.done = true
			console.log(this.done)
		}
	}
}

class Cell {
	rowNum: number
	colNum: number
	parentGrid: Cell[][]
	cellSize: number
	strokeWidth: number
	visited: boolean
	revisited: boolean
	walls: {
		top: boolean
		right: boolean
		bottom: boolean
		left: boolean
	}

	constructor(
		rowNum: number,
		colNum: number,
		parentGrid: Cell[][],
		cellSize: number,
		strokeWidth: number
	) {
		this.rowNum = rowNum
		this.colNum = colNum
		this.parentGrid = parentGrid
		this.cellSize = cellSize
		this.strokeWidth = strokeWidth
		this.visited = false
		this.revisited = false
		this.walls = {
			top: true,
			right: true,
			bottom: true,
			left: true,
		}
	}

	checkNeighbours() {
		let grid = this.parentGrid
		let neighbours: Cell[] = []

		let top = this.rowNum !== 0 ? grid[this.rowNum - 1][this.colNum] : undefined
		let right =
			this.colNum !== grid[0].length - 1
				? grid[this.rowNum][this.colNum + 1]
				: undefined
		let bottom =
			this.rowNum !== grid.length - 1
				? grid[this.rowNum + 1][this.colNum]
				: undefined
		let left =
			this.colNum !== 0 ? grid[this.rowNum][this.colNum - 1] : undefined

		if (top && !top.visited) neighbours.push(top)
		if (right && !right.visited) neighbours.push(right)
		if (bottom && !bottom.visited) neighbours.push(bottom)
		if (left && !left.visited) neighbours.push(left)

		return neighbours
	}

	drawTopWall(x: number, y: number, length: number) {
		ctx.beginPath()
		ctx.moveTo(x - this.strokeWidth / 2, y)
		ctx.lineTo(x + length + this.strokeWidth / 2, y)
		ctx.stroke()
	}

	drawRightWall(x: number, y: number, length: number) {
		ctx.beginPath()
		ctx.moveTo(x + length, y - this.strokeWidth / 2)
		ctx.lineTo(x + length, y + length + this.strokeWidth / 2)
		ctx.stroke()
	}

	drawBottomWall(x: number, y: number, length: number) {
		ctx.beginPath()
		ctx.moveTo(x - this.strokeWidth / 2, y + length)
		ctx.lineTo(x + length + this.strokeWidth / 2, y + length)
		ctx.stroke()
	}

	drawLeftWall(x: number, y: number, length: number) {
		ctx.beginPath()
		ctx.moveTo(x, y - this.strokeWidth / 2)
		ctx.lineTo(x, y + length + this.strokeWidth / 2)
		ctx.stroke()
	}

	highlight(color: string) {
		let x = this.colNum * this.cellSize
		let y = this.rowNum * this.cellSize

		ctx.fillStyle = color
		ctx.fillRect(x, y, this.cellSize, this.cellSize)
	}

	removeWalls(cell1: Cell, cell2: Cell) {
		let x = cell1.colNum - cell2.colNum

		if (x == 1) {
			cell1.walls.left = false
			cell2.walls.right = false
		} else if (x == -1) {
			cell1.walls.right = false
			cell2.walls.left = false
		}

		let y = cell1.rowNum - cell2.rowNum

		if (y == 1) {
			cell1.walls.top = false
			cell2.walls.bottom = false
		} else if (y == -1) {
			cell1.walls.bottom = false
			cell2.walls.top = false
		}
	}

	show() {
		let x = this.colNum * this.cellSize + this.strokeWidth / 2
		let y = this.rowNum * this.cellSize + this.strokeWidth / 2

		ctx.strokeStyle = colors.wall
		ctx.lineWidth = this.strokeWidth

		if (this.walls.top) this.drawTopWall(x, y, this.cellSize)
		if (this.walls.right) this.drawRightWall(x, y, this.cellSize)
		if (this.walls.bottom) this.drawBottomWall(x, y, this.cellSize)
		if (this.walls.left) this.drawLeftWall(x, y, this.cellSize)
	}
}
