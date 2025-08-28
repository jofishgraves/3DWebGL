"use strict"

/**
 * A class that handles the WebGL 3D canvas
 */
class Canvas
{   
    //Constructor
    constructor(w, h)
    {
        this.height = h
        this.width = w

        this.MakeCanvas()
        this.GLInit()
        this.MakeShaders()

        this.InitViewport()
    }

    //Methods

    /**
     * Makes the 3D canvas element
     */
    MakeCanvas()
    {
        this.canvas = document.createElement("canvas")
        this.canvas.tabIndex = 0 //allows for key presses when canvas is selected
        this.canvas.height = this.height
        this.canvas.width = this.width
        this.canvas.style="border:1px solid #000000;"

        document.body.appendChild(this.canvas);
    }
    
    /**
     * Initialize the WebGL package
     * @returns an alert if WebGL isn't available
     */
    GLInit()
    {
        this.gl = WebGLUtils.setupWebGL(this.canvas)

        //Checks if WebGL is available
        if (!this.gl) 
        {
            alert ("WebGL isn't available")
	        return;
        }

	    this.gl.getExtension('OES_standard_derivatives')
    }

    /**
     * Complies the 3D shaders of the program
     */
    MakeShaders()
    {
        this.program = initShaders(this.gl, "vertex-shader","fragment-shader")
        this.gl.useProgram(this.program)

        this.colorLoc = this.gl.getUniformLocation(this.program, "uniformEdgeColor")
    }

    /**
     * Initializes the WebGL viewport.
     */
    InitViewport()
    {
        this.gl.clearColor(1.0, 1.0, 1.0, 1.0)
        this.gl.viewport(0,0, this.width, this.height)
    }

    /**
     * Cleats the WebGL canvas
     */
    Clear()
    {
        this.gl.clear(this.gl.COLOR_BUFFER_BIT)
    }
    
    /**
     * Sets the edge color of the line object
     * @param {*} c A color that's defined as a vec4 value [r, g, b, s] values go from 0 to 1
     */
    SetEdgeColor(c)
    {
        this.gl.uniform4fv(this.colorLoc, c)
    }

    /**
     * Gets the program for WebGL
     * @returns the program
     */
    Program()
    {
        return this.program
    }

    /**
     * Gets the gl definition
     * @returns gl defintion
     */
    GL()
    {
        return this.gl
    }
}
