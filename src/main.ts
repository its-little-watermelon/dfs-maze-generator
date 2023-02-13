import { Maze } from './maze'
import './style.css'

const getCSSVarValue = (varName: string) => {
	return getComputedStyle(document.documentElement).getPropertyValue(
		'--' + varName
	)
}

export const colors = {
	bg: getCSSVarValue('bg'),
	current: getCSSVarValue('currentCell'),
	neighbour: getCSSVarValue('neighbourCell'),
	visited: getCSSVarValue('visitedCell'),
	revisited: getCSSVarValue('revisitedCell'),
	wall: getCSSVarValue('wall'),
}

export const maze: HTMLCanvasElement = document.getElementById(
	'maze'
) as HTMLCanvasElement
export const ctx = maze.getContext('2d')!

const playButton: HTMLButtonElement = document.getElementById(
	'play-button'
)! as HTMLButtonElement
const playButtonImage: HTMLImageElement = playButton.querySelector('.img')!
const nextButton: HTMLButtonElement = document.getElementById(
	'next-button'
)! as HTMLButtonElement
const newMazeButton: HTMLButtonElement = document.getElementById(
	'new-maze-button'
)! as HTMLButtonElement
const speedInput: HTMLInputElement = document.getElementById(
	'speed-input'
)! as HTMLInputElement
const settingsDiv = document.querySelector('.settings') as HTMLElement
const additionalSettingsDiv = document.querySelector(
	'.additional-settings'
) as HTMLElement

const speedOptions = [800, 400, 150, 75, 20]
let speedIndex = 2
let animationSpeed = speedOptions[speedIndex]
let reqId: any
let isAnimationPlaying = false

let newMaze = new Maze(40, 2, 13, 20)
newMaze.setup()

function animate() {
	setTimeout(() => {
		reqId = requestAnimationFrame(animate)

		newMaze.draw()

		if (newMaze.done || !isAnimationPlaying) {
			window.cancelAnimationFrame(reqId)
			if (newMaze.done) {
				settingsDiv.style.display = 'none'
				additionalSettingsDiv.style.display = 'block'
				isAnimationPlaying = false
				playButtonImage.src = '/triangle.svg'
				nextButton.disabled = false
			}
		}
	}, animationSpeed)
}

playButton.addEventListener('click', () => {
	if (isAnimationPlaying) {
		isAnimationPlaying = false
		playButtonImage.src = '/triangle.svg'
		nextButton.disabled = false
	} else {
		isAnimationPlaying = true
		animate()
		playButtonImage.src = '/rectangle.svg'
		nextButton.disabled = true
	}
})

nextButton.addEventListener('click', () => {
	newMaze.draw()
})

newMazeButton.addEventListener('click', () => {
	newMaze = new Maze(40, 2, 13, 20)
	newMaze.setup()
	settingsDiv.style.display = 'block'
	additionalSettingsDiv.style.display = 'none'
})

speedInput.addEventListener('change', (e: any) => {
	speedIndex = e.target.value
	animationSpeed = speedOptions[speedIndex]
	console.log(animationSpeed)
})
