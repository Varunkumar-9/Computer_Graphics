"use strict";

var gl;
var points;
var step = 500;
var minPoints = 500;
var currentPoints = 5000;
// var NumPoints = 5000;

var color = [1.0, 0.0, 0.0, 1];
var flag =0;



window.onload = function init()
{

    var canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }
    canvas.width = 4096;
    canvas.height = 4096;



function updatePoints(){
    var vertices = [
        vec2( -1, -1 ),
        vec2(  0,  1 ),
        vec2(  1, -1 )
    ];


    
    var u = add( vertices[0], vertices[1] );
    var v = add( vertices[0], vertices[2] );
    var p = scale( 0.25, add( u, v ) );

    points = [ p ];
    for ( var i = 0; points.length < currentPoints; ++i ) {
        var j = Math.floor(Math.random() * 3);
        p = add( points[i], vertices[j] );
        p = scale( 0.5, p );
        points.push( p );
    }


    var vertexSh = `attribute vec4 vPosition;
    void
    main()
    {
        gl_PointSize = 2.0;
        gl_Position = vPosition;
    }`;
	
	
	var fragmentSh = `precision mediump float;
    uniform vec4 Color_Vector;	
    
    void
    main()
    {
        
        gl_FragColor = Color_Vector;
        
        
    }`;
	

	
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShader,vertexSh);
	gl.compileShader(vertexShader);
	
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShader,fragmentSh);
	gl.compileShader(fragmentShader);
	
	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
    gl.useProgram( program );
    var colorLocation = gl.getUniformLocation(program, "Color_Vector");
    gl.uniform4fv(colorLocation, color);
    var bufferId = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, bufferId );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(points), gl.STATIC_DRAW );
    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );
}

function animate() {
    currentPoints = currentPoints- (currentPoints * 0.1);
    if(currentPoints < 500){
        currentPoints=5000;
    }
    updatePoints();
    Color_Random()


    canvas.width = canvas.width/2;
    canvas.height = canvas.height/2;
    gl.viewport( 0, 0, canvas.width, canvas.height );
    if(canvas.width == 0 || canvas.height == 0 ){
        canvas.width = 4096;
        canvas.height = 4096;
    }
   
    gl.clearColor( 1.0, 1.0, 1.0, 1.0 );
    render();
  }
  
  var SB = document.getElementById("Play-pause");
  SB.addEventListener("click",() => {
      setInterval(animate, 1000)
  })


 };


function render() {
    gl.clear( gl.COLOR_BUFFER_BIT );
    console.log(points.length);
    gl.drawArrays( gl.POINTS, 0, points.length );
}

function Color_Random() {
    var color_ran = [[1.0,0.0,0.0,1],[0.75,1.0,0.0,1],[0.0,0.0,1.0,1],[.5,0.75,0.2,1],[0.25,0.5,0.0,1], [1.0,0.7,0.5,1],[0.3,0.1,0.8,0.3],[1.0,0.3,0.7,1],[0.2,0.1,0.3,0.6]];
    color = color_ran[flag%9];
    flag+=1;
}




