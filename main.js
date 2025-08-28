"use strict"

var canvas = new Canvas(500,500)
let timer = null

//World properities
let sca = 0
let px = 0
let py = 0
let pz = 0

//Objects
let objects = []
let complex = []

/**
 * Makes the objects of the demo
 */
function MakeItems()
{   
    //Canvas Parameters
    let cx = canvas.height/2
    let cy = canvas.width/2

    let tea = new Teapot(canvas.GL(), canvas.Program(), "vPosition", "firstT", Teapot_Triangles)
    tea.Viewport(0, 0, cx, cy)
    objects.push(tea)

    let ep = new Epcot(canvas.GL(), canvas.Program(), "vPosition", "firstT", Epcot_Triangles)
    ep.Viewport(cx, 0, cx, cy)
    objects.push(ep)

    let tank = new Widget(canvas.GL(), canvas.Program(), "vPosition", "firstT", Lizard_Triangles) //this will be the lizard
    tank.Viewport(cx, cy, cx, cy)
    objects.push(tank)

    for(let i = 0; i < 15; i++)
    {
        complex.push(new Complex1(canvas.GL(), canvas.Program(), "vPosition", "firstT", Cube_Triangles))
    }

    complex.push(new Epcot2(canvas.GL(), canvas.Program(), "vPosition", "firstT", Epcot_Triangles))

    complex.push(new Complex2(canvas.GL(), canvas.Program(), "vPosition", "firstT", XWing_Triangles))
    for(let i = 0; i < complex.length; i++)
    {
        complex[i].Viewport(0,cy,cx,cy)
    }
}

/**
 * Displays all of the objects
 */
function Display()
{
    canvas.Clear()
    objects.forEach(DisplayItem)
    complex.forEach(DisplayItem)
}

/**
 * Displayes each item passed through
 * @param {*} item object to be displayed
 */
function DisplayItem(item)
{
    canvas.SetEdgeColor(item.color)
    item.Display(canvas.GL())
}

/**
 * Defines every tick from an timer or interval
 */
function Tick()
{
    Display()
}

MakeItems()
Display()
timer = setInterval(Tick, 80)