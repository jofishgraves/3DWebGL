"use strict"

/**
 * A class that handles the widget of all objects
 */
class Widget
{
    //rotation
    rx
    ry
    rz

    //position
    tx
    ty
    tz

    //scale
    sx
    sy
    sz

    //misc
    rotateDir
    color

    //Constructor
    constructor(gl, program, posName, ltName, edges)
    {
        this.visible = true
        this.size = edges.length
        this.color = [0.5, 1.0, 0.5, 1.0]
        this.VBOSetup(gl, edges)

        this.FindMove(edges)

        this.vpos = gl.getAttribLocation(program, posName)
        this.localTransform = gl.getUniformLocation(program, ltName)
        this.Reset()
    }

    //Methods

    /**
     * Finds the edges of the object
     * @param {*} edges an array of edges that define the object
     */
    FindMove(edges)
    {
        let lowerLeft = [...edges[0]]
        let upperRight = [...edges[0]]

        for(let i = 0; i < edges.length; i++)
        {
            for(let j = 0; j < 3; j++)
            {
                lowerLeft[j] = Math.min(lowerLeft[j], edges[i][j])
                upperRight[j] = Math.max(upperRight[j], edges[i][j])
            }
        }

        let diff = subtract(upperRight, lowerLeft)

        this.transform = mat4(1)

        let diff2 = mult(diff, [1/2, 1/2, 1/2])

        let center = add(lowerLeft, diff2)
        center = mult(center, [-1, -1, -1])

        let max = Math.max(...diff)
        let scale = 1.7/max

        this.transform = mult(this.transform, scalem(scale,scale,scale))
        this.transform = mult(this.transform, translate(center))
    }  

    /**
     * Sets up the VBO of the object
     * @param {*} gl WebGL program
     * @param {*} edges Edges of the shape
     */
    VBOSetup(gl, edges)
    {
        this.vbuf =  gl.createBuffer()
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbuf)
	    gl.bufferData(gl.ARRAY_BUFFER,flatten(edges),gl.STATIC_DRAW)
    }

    /**
     * Defines a viewport for the widget
     * @param {*} x x position
     * @param {*} y y position
     * @param {*} w width of viewport
     * @param {*} h height of viewport
     */
    Viewport(x,y,w,h)
    {
        this.vx = x
        this.vy = y
        this.vw = w
        this.vh = h
    }

    /**
     * Displays the widget
     * @param {*} gl WebGL program to display
     */
    Display(gl)
    {
        this.Next()
        this.Transform()

        let loc = canvas.GL().getUniformLocation(canvas.Program(), "midT")
        let trans = mat4(1)

        canvas.GL().uniformMatrix4fv(loc, false, flatten(trans))

        gl.uniformMatrix4fv(this.localTransform, false, flatten(this.transform))

        gl.viewport(this.vx, this.vy, this.vw, this.vh)

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbuf)

        gl.vertexAttribPointer(this.vpos, 3, gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray(this.vpos)

        for(let i =0; i < this.size;++i) 
        {
            gl.drawArrays(gl.LINE_LOOP, 3*i, 3)
        }
    }

    /**
     * Sets the transforms the object
     */
    Transform()
    {
        let tmp = translate(this.tx, this.ty, this.tz)
        tmp = mult(tmp, scalem(this.sx, this.sy, this.sz))
        tmp = mult(tmp, rotate(this.rx, [1,0,0]))
        tmp = mult(tmp, rotate(this.ry, [0,1,0]))
        tmp = mult(tmp, rotate(this.rz, [0,0,1]))
        this.transform = tmp 
    }

    /**
     * Resets the transforms of the object.
     */
    Reset()
    {
        this.rx = -90
        this.ry = 80
        this.rz = 90
        this.tx = 1.5
        this.ty = -0.5
        this.tz = 0
        this.sx = 2
        this.sy = 2
        this.sz = 2
        this.rotateDir = false
    }

    /**
     * Gets the next animation frame of the object
     */
    Next()
    {
        this.tx -= 0.1

        if(this.tx <= -2.5)
        {
            this.tx = 2.5
        }
    }
}

/**
 * A class that defines the epcot object
 */
class Epcot extends Widget
{
    //rotation
    rx
    ry
    rz

    //position
    tx
    ty
    tz

    //scale
    sx
    sy
    sz

    //misc
    color

    //Constructor
    constructor(gl, program, posName, ltName, edges)
    {
        super(gl, program, posName, ltName, edges)
        this.color = [0.1, 0.2, 0.5, 1.0]
        this.Reset()
    }

    //Methods
    Reset()
    {
        this.rx = 85
        this.ry = 15
        this.rz = 0
        this.tx = 0
        this.ty = 0
        this.tz = 0
        this.sx = 1.5
        this.sy = 1.5
        this.sz = 1.5
    }

    Transform()
    {
        let tmp = translate(this.tx, this.ty, this.tz)
        tmp = mult(tmp, scalem(this.sx, this.sy, this.sz))
        tmp = mult(tmp, rotate(this.rx, [1,0,0]))
        tmp = mult(tmp, rotate(this.ry, [0,1,0]))
        tmp = mult(tmp, rotate(this.rz, [0,0,1]))
        this.transform = tmp
    }

    Next()
    {
        this.rz++
    }

    Display(gl)
    {
        this.Next()
        this.Transform()

        gl.uniformMatrix4fv(this.localTransform, false, flatten(this.transform))

        gl.viewport(this.vx, this.vy, this.vw, this.vh)

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbuf)

        gl.vertexAttribPointer(this.vpos, 3, gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray(this.vpos)

        for(let i =0; i < this.size;++i) 
        {
            gl.drawArrays(gl.LINE_LOOP, 3*i, 3)
        }
    }
}

/**
 * A class that handles the teapot object
 */
class Teapot extends Widget
{
    //rotation
    rx
    ry
    rz

    //local position
    tx
    ty
    tz

    //scale
    sx
    sy
    sz

    //Misc
    scaleUp
    color

    //Constructor
    constructor(gl, program, posName, ltName, edges)
    {
        super(gl, program, posName, ltName, edges)
        this.color = [0.8, 0.8, 0.5, 1.0]
        this.Reset()
    }

    //Methods
    Reset()
    {
        this.rx = -90
        this.ry = 15
        this.rz = 30
        this.tx = -0.2
        this.ty = 0
        this.tz = 0
        this.sx = 1.2
        this.sy = 1.2
        this.sz = 1.2
        this.scaleUp = false
    }

    Transform()
    {
        let tmp = translate(this.tx, this.ty, this.tz)
        tmp = mult(tmp, scalem(this.sx, this.sy, this.sz))
        tmp = mult(tmp, rotate(this.rx, [1,0,0]))
        tmp = mult(tmp, rotate(this.ry, [0,1,0]))
        tmp = mult(tmp, rotate(this.rz, [0,0,1]))
        this.transform = tmp
    }

    Next()
    {
        if(this.sx <= 0)
        {
            this.scaleUp = true
        }
        else if(this.sx >= 1.2)
        {
            this.scaleUp = false
        }

        if(this.scaleUp)
        {
            this.sx += 0.05
            this.sy += 0.05
            this.sz += 0.05
        }
        else
        {
            this.sx -= 0.05
            this.sy -= 0.05
            this.sz -= 0.05
        }
    }

    Display(gl)
    {
        this.Next()
        this.Transform()

        gl.uniformMatrix4fv(this.localTransform, false, flatten(this.transform))

        gl.viewport(this.vx, this.vy, this.vw, this.vh)

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbuf)

        gl.vertexAttribPointer(this.vpos, 3, gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray(this.vpos)

        for(let i =0; i < this.size;++i) 
        {
            gl.drawArrays(gl.LINE_LOOP, 3*i, 3)
        }
    }
}

//Complex Items

/**
 * A class that defines the first major complex object (A meteorite cube)
 */
class Complex1 extends Widget
{
    //rotation
    rx
    ry
    rz

    //position
    tx
    ty
    tz

    //scale
    sx
    sy
    sz

    //misc
    color

    //Constructor
    constructor(gl, program, posName, ltName, edges)
    {
        super(gl, program, posName, ltName, edges)
        this.color = [0.2, 0.2, 0.2, 1.0]
        this.Reset()
    }

    //Methods
    Reset()
    {
        this.rx = Math.floor(Math.random() * 360)
        this.ry = Math.floor(Math.random() * 360)
        this.rz = Math.floor(Math.random() * 360)
        this.tx = (Math.random() * 1) - (Math.random() * 1.3)
        this.ty = (Math.random() * 1) - (Math.random() * 1.3)
        this.tz = 0

        let uniScale = Math.random() * 0.2
        while (uniScale < 0.05)
        {
            uniScale = Math.random() * 0.2
        }
        this.sx = uniScale
        this.sy = uniScale
        this.sz = uniScale
    }

    Transform()
    {
        let tmp = translate(this.tx, this.ty, this.tz)
        tmp = mult(tmp, scalem(this.sx, this.sy, this.sz))
        tmp = mult(tmp, rotate(this.rx, [1,0,0]))
        tmp = mult(tmp, rotate(this.ry, [0,1,0]))
        tmp = mult(tmp, rotate(this.rz, [0,0,1]))
        this.transform = tmp
    }

    Next()
    {
        this.rx++
        this.ry += 0.5
        this.rz++
    }

    Display(gl)
    {
        this.Next()
        this.Transform()

        gl.uniformMatrix4fv(this.localTransform, false, flatten(this.transform))

        gl.viewport(this.vx, this.vy, this.vw, this.vh)

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbuf)

        gl.vertexAttribPointer(this.vpos, 3, gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray(this.vpos)

        for(let i =0; i < this.size;++i) 
        {
            gl.drawArrays(gl.LINE_LOOP, 3*i, 3)
        }
    }
}

/**
 * A class that defines the second complex object (XWing)
 */
class Complex2 extends Widget
{
    //rottation
    rx
    ry
    rz

    //position
    tx
    ty
    tz

    //scale
    sx
    sy
    sz

    //misc
    color

    //Constructor
    constructor(gl, program, posName, ltName, edges)
    {
        super(gl, program, posName, ltName, edges)
        this.color = [0.6, 0.6, 0.6, 1.0]
        this.Reset()
    }

    //Methods
    Reset()
    {
        this.rx = 90
        this.ry = -5
        this.rz = -30
        this.tx = 1.7
        this.ty = -1
        this.tz = 0
        this.sx = 1.2
        this.sy = 1.2
        this.sz = 1.2
    }

    Transform()
    {
        let tmp = translate(this.tx, this.ty, this.tz)
        tmp = mult(tmp, scalem(this.sx, this.sy, this.sz))
        tmp = mult(tmp, rotate(this.rx, [1,0,0]))
        tmp = mult(tmp, rotate(this.ry, [0,1,0]))
        tmp = mult(tmp, rotate(this.rz, [0,0,1]))
        this.transform = tmp
    }

    Next()
    {
        this.tx -= 0.1
        this.ty += 0.05
        this.sx -= 0.07
        this.sy -= 0.07
        this.sz -= 0.07
        this.rz++

        if(this.tx < -0.1)
        {
            this.Reset()
        }
    }

    Display(gl)
    {
        this.Next()
        this.Transform()

        gl.uniformMatrix4fv(this.localTransform, false, flatten(this.transform))

        gl.viewport(this.vx, this.vy, this.vw, this.vh)

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vbuf)

        gl.vertexAttribPointer(this.vpos, 3, gl.FLOAT, false, 0, 0)
        gl.enableVertexAttribArray(this.vpos)

        for(let i =0; i < this.size;++i) 
        {
            gl.drawArrays(gl.LINE_LOOP, 3*i, 3)
        }
    }
}

/**
 * A class that defines another epcot
 */
class Epcot2 extends Epcot
{
    //Misc
    color

    //Constructor
    constructor(gl, program, posName, ltName, edges)
    {
        super(gl, program, posName, ltName, edges)
        this.color = [0.5, 0.1, 0.3, 1.0]
        this.Reset()
    }

    //Methods
    Reset()
    {
        this.rx = 85
        this.ry = 5
        this.rz = 0
        this.tx = 0
        this.ty = 0
        this.tz = 0
        this.sx = 1.0
        this.sy = 1.0
        this.sz = 1.0
    }
}